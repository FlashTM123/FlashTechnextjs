import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomer extends Document {
    customer_id: string;
    full_name: string;
    email: string;
    password?: string;
    phone_number?: string;
    avatar: string;
    gender: "MALE" | "FEMALE" | "OTHER" | "HIDDEN";
    date_of_birth?: Date;
    address?: string;
    city?: string;
    status: "ACTIVE" | "BLOCKED" | "PENDING" | "INACTIVE";
    tier: "BRONZE" | "SILVER" | "GOLD" | "DIAMOND";
    points: number;
    isVerified: boolean;
    lastLogin?: Date;
    adminNote?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
    {
    customer_id: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: false },
    phone_number: { type: String, required: false },
    avatar: { type: String, required: true },
    gender: { type: String, required: true },
    date_of_birth: { type: Date, required: false },
    address: { type: String, required: false },
    city: { type: String, required: false },
    status: { type: String, required: true },
    tier: { type: String, required: true },
    points: { type: Number, required: true },
    isVerified: { type: Boolean, required: true },
    lastLogin: { type: Date, required: false },
    adminNote: { type: String, required: false },
},
    {
        timestamps: true,
        // Prisma MongoDB: model Customer → collection "customer" (chữ thường)
        collection: "customer",
    },
);

const Customer: Model<ICustomer> = mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema);

export default Customer;