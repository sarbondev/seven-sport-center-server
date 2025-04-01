import mongoose from "mongoose";

const TrainerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    photo: { type: String, required: true },
    experience: { type: String, required: true },
    level: { type: String, required: true },
    students: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Trainer", TrainerSchema);
