import { Document, model, Schema, Types } from "mongoose";
import crypto from "crypto";

// Created the interface for the user
export interface IBooking extends Document {
  user: Types.ObjectId;
  restaurant: Types.ObjectId;
  date: Date;
  time: string;
  guests: number;
  ocation?: string;
  specialRequests?: string;
  status: "confirmed" | "cancelled" | "completed";
  bookingId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Defined the schema for the user
const BookingSchema = new Schema<IBooking>({
  user: { type: Types.ObjectId, ref: "User", required: true },
  restaurant: { type: Types.ObjectId, ref: "Restaurant", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true, min: 1 },
  ocation: { type: String, trim: true },
  specialRequests: { type: String, trim: true },
  status: {
    type: String,
    enum: ["confirmed", "cancelled", "completed"],
    default: "confirmed",
  },
  bookingId: { type: String, unique: true },
});

// Deleted the password before adding it to the DB
BookingSchema.pre("save", function () {
  if (!this.bookingId) {
    this.bookingId = `GR-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  }
});

export const Booking = model<IBooking>("Booking", BookingSchema);
