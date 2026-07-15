import jwt from "jsonwebtoken";
// Get all restaurants
// GET /api/restaurants
import { Request, Response } from "express";
import { Restaurant } from "../models/Restaurant.js";
import { User } from "../models/User.js";
import { Booking } from "../models/Booking.js";

// Get all restaurants that match the search query
// GET /api/restaurants
export const getRestaurants = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Gets all information provided from que query
    const { search, priceRange, rating, location, sort } = req.query;

    // Initializes the objects and assumes it's approved
    const queryObj: any = { status: "approved" };

    // Checks if the user has searched for something
    if (search) {
      queryObj.$or = [
        { name: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // Checks if the price range limit search has been set
    if (priceRange) {
      const prices = Array.isArray(priceRange) ? priceRange : [priceRange];
      queryObj.priceRange = { $in: prices };
    }

    // Checks if the rating limit search has been set
    if (rating) {
      queryObj.rating = { $gte: parseFloat(rating as string) };
    }

    // Checks if the location search has been set
    if (location) {
      queryObj.location = { $regex: location as string, $options: "i" };
    }

    // Checks if the search has been sorted somehow
    let sortOptions: any = { createdAt: -1 };
    if (sort === "rating") {
      sortOptions = { rating: -1 };
    } else if (sort === "price_low") {
      sortOptions = { priceRange: 1 };
    } else if (sort === "price_high") {
      sortOptions = { priceRange: -1 };
    }

    // Gets the restaurant with the search options and sorts it with the selected sorting
    const restaurant = await Restaurant.find(queryObj).sort(sortOptions);
    res.json(restaurant);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Get features and exclusive restaurants
// GET /api/restaurants/features
export const getFesturedRestaurants = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const featured = await Restaurant.find({
      status: "approved",
      $or: [{ featured: true, exclusive: true }],
    }).limit(6);
    res.json(featured);
  } catch (error: any) {
    console.error("Get featured restaurants error: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single restaurant by slug
// GET /api/restaurants/:slug
export const getdRestaurantBySlug = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug });
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }
    if (restaurant.status !== "approved") {
      let isAuthorized = false;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        try {
          const token = req.headers.authorization.split(" ")[1];
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string,
          ) as { id: string };
          const user = await User.findById(decoded.id);
          if (
            user &&
            (user.role === "admin" ||
              (user.role === "owner" &&
                restaurant.owner.toString() === user._id.toString()))
          ) {
            isAuthorized = true;
          }
        } catch (error) {}
      }
      if (!isAuthorized) {
        res
          .status(404)
          .json({ message: "Restaurant not found or pending approval" });
        return;
      }
    }
    res.json(restaurant);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Get dynamic seat availability for slots
// GET /api/restaurants/:id/availability
export const getRestaurantAvailability = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { date } = req.query;
    if (!date) {
      res.status(400).json({ message: "Please provide a date" });
      return;
    }

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    const bookingDate = new Date(date as string);
    const bookings = await Booking.find({
      restaurant: restaurant._id,
      date: bookingDate,
      status: "confirmed",
    });
    if (!bookings) {
      res.status(401).json({
        message:
          "THIS WAS NOT IN THE TUTORIAL: No confirmed booking for this date",
      });
      return;
    }

    const availability = restaurant.availableSlots.map((slot) => {
      const bookedSeats = bookings
        .filter((b) => b.time === slot)
        .reduce((sum, b) => sum + b.guests, 0);
      const totalSeats = restaurant.totalSeats || 20;
      const availableSeats = Math.max(0, totalSeats - bookedSeats);
      return { time: slot, availableSeats, isAvailable: { availableSeats: 0 } };
    });
    res.json(availability);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};
