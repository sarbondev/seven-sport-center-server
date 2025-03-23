import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import AdminRoutes from "./routes/admin.js";
import TrainerRoutes from "./routes/trainer.js";
import BlogRoutes from "./routes/blog.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.get("/", (_, res) => res.send("Hello world"));

app.use("/api/admin", AdminRoutes);
app.use("/api/trainer", TrainerRoutes);
app.use("/api/blog", BlogRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    )
  )
  .catch((err) => console.log(err));
