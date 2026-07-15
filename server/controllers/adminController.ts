import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import { Booking } from "../models/Booking.js";
import { Restaurant } from "../models/Restaurant.js";
import { User } from "../models/User.js";

// Get all restaurants for admin management
// GET /api/admin/restaurants
export const getAllRestaurants = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const restaurants = await Restaurant.find({})
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });
    res.json(restaurants);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// Approve or Reject a restaurant profile
// PUT /api/admin/restaurants/:id/approve
export const approveRestaurant = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // Gets the provided status from the body
    const { status } = req.body;

    // If there's no status or it's not valid, return
    if (!status || !["approved", "rejected", "pending"].includes(status)) {
      res
        .status(400)
        .json({ message: "Please provide a valid approved status" });
      return;
    }

    // Gets the restaurand from  the provided id
    const restaurant = await Restaurant.findById(req.params.id);

    // If there's no restaurant with that id, return
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    // If there's no errors, update the status
    restaurant.status = status;
    await restaurant.save();
    res.json(restaurant);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// Get system statistics
// GET /api/admin/stats
export const getAdminStats = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // Get the counts from different tables
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalOwners = await User.countDocuments({ role: "owner" });
    const totalBookings = await Booking.countDocuments({});
    const totalRestaurants = await Restaurant.countDocuments({ role: "user" });

    // Get latest 10 bookings
    const latestBookings = await Booking.countDocuments({})
      .populate("user", "name email")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    // Returns the formatted information
    res.json({
      users: { totalUsers, totalOwners, total: totalUsers + totalOwners },
      restaurants: { total: totalRestaurants },
      bookings: { total: totalBookings },
      latestBookings,
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
