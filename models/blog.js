import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    photos: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Blog", BlogSchema);
