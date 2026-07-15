import { v2 as cloudinary } from "cloudinary";
import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import { Booking } from "../models/Booking.js";
import { Restaurant } from "../models/Restaurant.js";

// Helper function to upload buffer to Bloudinary
const uploadToCloudinary = (
  fileBuffer: Buffer,
): Promise<{ secure_url: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "QuickDine" },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Upload failed"));
        resolve({ secure_url: result.secure_url });
      },
    );
    stream.end(fileBuffer);
  });
};

// Get owner's restaurant
// GET /api/owner/restaurant
export const getOwnerRestaurant = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // Gets the restaurant from the owner id
    const restaurant = await Restaurant.findOne({ owner: req.user?._id });
    // If there's none, return
    if (!restaurant) {
      res.status(200).json(null);
      return;
    }

    // Return the found restaurant
    res.json(restaurant);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// Create owner's restaurant (submitted to pending)
// POST /api/owner/restaurant
export const createOwnerRestaurant = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const existing = await Restaurant.findOne({ owner: req.user?._id });
    if (existing) {
      res
        .status(400)
        .json({ message: "You already have a registered restaurant" });
      return;
    }

    const {
      name,
      description,
      cuisine,
      priceRange,
      location,
      address,
      chef,
      tags,
      availableSlots,
      totalSeats,
    } = req.body;

    if (
      !name ||
      !description ||
      !cuisine ||
      !priceRange ||
      !location ||
      !address ||
      !chef
    ) {
      res
        .status(400)
        .json({ message: "Please provide all required information" });
      return;
    }

    // Create the slug from the restaurant name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const slugExist = await Restaurant.findOne({ slug });
    if (slugExist) {
      res
        .status(400)
        .json({ message: "A restaurant with this name already exists" });
      return;
    }

    // Handle image
    let imageUrl = "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    // Setup parsed tags and slots
    const parsedTags =
      typeof tags === "string"
        ? tags.split(",").map((t) => t.trim())
        : tags || [];

    const parsedSlots =
      typeof availableSlots === "string"
        ? availableSlots.split(",").map((s) => s.trim())
        : availableSlots || ["17:00", "18:00", "19:00", "20:00", "21:00"];

    const restaurant = await Restaurant.create({
      name,
      slug,
      description,
      cuisine,
      priceRange,
      location,
      address,
      chef,
      image: imageUrl,
      tags: parsedTags,
      availableSlots: parsedSlots,
      totalSeats: totalSeats ? Number(totalSeats) : 20,
      owner: req.user?._id,
      status: "pending",
    });
    res.status(201).json(restaurant);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// Update owner's restaurant
// PUT /api/owner/restaurant
export const updateOwnerRestaurant = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user?._id });
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant profile not found" });
      return;
    }
    const {
      name,
      description,
      cuisine,
      priceRange,
      location,
      address,
      chef,
      tags,
      availableSlots,
      totalSeats,
    } = req.body;
    if (name) restaurant.name = name;
    if (description) restaurant.description = description;
    if (cuisine) restaurant.cuisine = cuisine;
    if (priceRange) restaurant.priceRange = priceRange;
    if (location) restaurant.location = location;
    if (address) restaurant.address = address;
    if (chef) restaurant.chef = chef;
    if (totalSeats) restaurant.totalSeats = totalSeats;

    if (tags) {
      restaurant.tags =
        typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : tags;
    }

    if (availableSlots) {
      restaurant.availableSlots =
        typeof availableSlots === "string"
          ? availableSlots.split(",").map((s) => s.trim())
          : availableSlots;
    }

    // Handle image update if any
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      restaurant.image = result.secure_url;
    }

    const updated = await restaurant.save();
    res.json(updated);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// Get bookings for owner's restaurant
// GET /api/owner/bookings
export const getOwnerBookings = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // Gets the restaurant with the user id
    const restaurant = await Restaurant.findOne({ owner: req.user?._id });

    // If there's none, return
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant profile not found" });
      return;
    }

    // Gets the bookings from the found restaurant id
    const bookings = await Booking.find({ restaurant: restaurant._id })
      .populate("user", "name email phone")
      .sort({ date: -1, time: -1 });
    res.json(bookings);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// Update status of a booking
// PUT /api/owner/bookings/:id/status
export const updateBookingStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // Gets the status from the body
    const status = req.body;

    // If there's no status, or it's not a valid one, return
    if (!status || !["confirmed", "cancelled", "completed"].includes(status)) {
      res.status(400).json({ message: "Please enter a valid booking status" });
      return;
    }

    // Try to find the booking with the provided id
    const booking = await Booking.findById(req.params.id);
    // If there's no booking, return
    if (!booking) {
      res.status(404).json({ message: "Booking not founf" });
      return;
    }

    // Try to find the restaurant with the provided id
    const restaurant = await Restaurant.findById(booking.restaurant);
    // If the restaurant doesn't exist or if the user is not the owner, return
    if (
      !restaurant ||
      restaurant.owner.toString() !== req.user?._id.toString()
    ) {
      res
        .status(401)
        .json({ message: "Not authorized to manage this booking" });
      return;
    }

    // If no errors update the booking status and save
    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
