import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone_number?: string;
  address?: string;
  role: "USER" | "ADMIN" | "MODERATOR" | "EMPLOYEE";
  isBlocked: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name:         { type: String, required: true },
    email:        { type: String, required: true, unique: true, lowercase: true },
    password:     { type: String, select: false },
    phone_number: { type: String, default: "" },
    address:      { type: String, default: "" },
    role: {
      type: String,
      enum: ["USER", "ADMIN", "MODERATOR", "EMPLOYEE"],
      default: "USER",
    },
    isBlocked: { type: Boolean, default: false },
    avatar:    { type: String, default: "" },
  },
  { timestamps: true }
);

// Tránh recompile model trong Next.js hot reload
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
