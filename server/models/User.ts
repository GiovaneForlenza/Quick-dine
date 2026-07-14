import { Document, model, Schema } from "mongoose";

// Created the interface for the user
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: "user" | "admin" | "owner";
  createdAt: Date;
  updatedAt: Date;
}

// Defined the schema for the user
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      minlength: 6,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin", "owner"],
      default: "user",
    },
  },
  { timestamps: true },
);

// Deleted the password before adding it to the DB
UserSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export const User = model<IUser>("User", UserSchema);
