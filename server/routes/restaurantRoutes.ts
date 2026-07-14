import { Router } from "express";
import {
  getdRestaurantBySlug,
  getFesturedRestaurants,
  getRestaurantAvailability,
  getRestaurants,
} from "../controllers/restaurantController.js";

const restaurantRouter = Router();

restaurantRouter.get("/", getRestaurants);
restaurantRouter.get("/featured", getFesturedRestaurants);
restaurantRouter.get("/:slug", getdRestaurantBySlug);
restaurantRouter.get("/:id/availability", getRestaurantAvailability);

export default restaurantRouter;
