import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "engineer" | "manager";
  skills: string[];
  seniority: "junior" | "mid" | "senior";
  maxCapacity: number;
  department: string;
}

const UserSchema: Schema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["engineer", "manager"], required: true },
  skills: [String],
  seniority: { type: String, enum: ["junior", "mid", "senior"] },
  maxCapacity: Number,
  department: String,
});

export default mongoose.model<IUser>("User", UserSchema);
