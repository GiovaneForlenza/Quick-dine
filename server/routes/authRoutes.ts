import { Router } from "express";
import {
  getUserProfile,
  loginUser,
  registerUser,
} from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/profile", protect, getUserProfile);

export default authRouter;
