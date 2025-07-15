import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import getPort from "get-port";

import RootRoutes from "./routes/root.routes.js";

// .env faylini yuklash
dotenv.config();

// Fayl va papka yo‘lini aniqlash
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT) || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware’lar
app.use(cors());
app.use(express.json());

// Yuklangan fayllarni servis qilish
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

// Test uchun oddiy route
app.get("/", (_, res) => res.send("Salom, dunyo!"));

// API route’lar
app.use("/api", RootRoutes);

// Serverni ishga tushuruvchi funksiyasi
const startServer = async () => {
  if (!MONGODB_URI) {
    console.error("❌ MongoDB URI .env faylida ko‘rsatilmagan.");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB bilan muvaffaqiyatli ulanildi.");

    const availablePort = await getPort({ port: DEFAULT_PORT });

    app.listen(availablePort, () => {
      console.log(`🚀 Server ishga tushdi: http://localhost:${availablePort}`);
      if (availablePort !== DEFAULT_PORT) {
        console.log(
          `ℹ️  ${DEFAULT_PORT}-port band edi. ${availablePort}-port tanlandi.`
        );
      }
    });
  } catch (error) {
    console.error("❌ Serverni ishga tushirishda xatolik:", error.message);
    process.exit(1);
  }
};

startServer();
