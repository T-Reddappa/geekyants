import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAssignment extends Document {
  engineerId: Types.ObjectId;
  projectId: Types.ObjectId;
  allocationPercentage: number; // 0-100
  startDate: Date;
  endDate: Date;
  role: string; // e.g., Developer, Tech Lead
}

const assignmentSchema: Schema = new Schema(
  {
    engineerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    allocationPercentage: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    role: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAssignment>("Assignment", assignmentSchema);
