import mongoose from "mongoose";

const TrainerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    photo: { type: String, required: true },
    experience: { type: String, required: true },
    achievements: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Trainer", TrainerSchema);
