import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import RootRoutes from "./routes/root.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.get("/", (_, res) => res.send("Hello world"));
app.use("/api", RootRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    )
  )
  .catch((err) => console.log(err));
