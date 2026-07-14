import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { AuthRequest } from "../middlewares/auth.js";

// Helper to generate JWT token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

// Register a new user
export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Check for mandatory data
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: "Please provide all required fields" });
      return;
    }

    // Check if the user is registered
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hasedPassword,
      phone,
      role,
    });

    // Checks if the user has been created
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// Authenticate a user & get token
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for mandatory data
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Please provide email and password" });
      return;
    }

    // Check if the user is registered
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Check if password matched
    const isMatch = await bcrypt.compare(password, user.password || "");

    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Returns the user data if email and password is correct
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// Get user profile
// @access private
export const getUserProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorizes" });
      return;
    }
    res.json(req.user);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
