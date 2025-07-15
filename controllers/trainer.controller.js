import Trainer from "../models/trainer.js";
import { upload } from "../middlewares/Uploader.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Barcha trenerlarni olish
export const getAllTrainers = async (_, res) => {
  try {
    const trainers = await Trainer.find();
    res.status(200).json(trainers);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// Trenerni ID orqali olish
export const getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: "Trener topilmadi" });
    }
    res.status(200).json(trainer);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// Yangi trener yaratish
export const createTrainer = async (req, res) => {
  try {
    upload.single("photo")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { fullName, experience, level, students } = req.body;
      if (!fullName || !level || !students) {
        return res
          .status(400)
          .json({ message: "Barcha maydonlarni to‘ldirish majburiy" });
      }

      const photo = req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : null;

      const newTrainer = new Trainer({
        fullName,
        photo,
        experience,
        level,
        students,
      });

      await newTrainer.save();
      res.status(201).json(newTrainer);
    });
  } catch (error) {
    res.status(500).json({
      message: "Trenerni yaratishda xatolik yuz berdi",
      error: error.message,
    });
  }
};

// Trenerni yangilash
export const updateTrainer = async (req, res) => {
  try {
    upload.single("photo")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { fullName, experience, level, students } = req.body;

      const updateData = {
        fullName,
        experience,
        level,
        students,
      };

      if (req.file) {
        updateData.photo = `${req.protocol}://${req.get("host")}/uploads/${
          req.file.filename
        }`;
      }

      const updatedTrainer = await Trainer.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedTrainer) {
        return res.status(404).json({ message: "Trener topilmadi" });
      }

      res.status(200).json(updatedTrainer);
    });
  } catch (error) {
    res.status(500).json({
      message: "Trenerni yangilashda xatolik yuz berdi",
      error: error.message,
    });
  }
};

// Trenerni o‘chirish
export const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: "Trener topilmadi" });
    }

    if (trainer.photo) {
      const slicedPhoto = trainer.photo.slice(30);
      const filePath = path.join(__dirname, "..", "uploads", slicedPhoto);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        } else {
          console.warn(`Fayl topilmadi: ${filePath}`);
        }
      } catch (err) {
        console.error(`Rasmni o‘chirishda xatolik: ${filePath}`, err);
      }
    }

    const deletedTrainer = await Trainer.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Trener o‘chirildi", deletedTrainer });
  } catch (error) {
    res.status(500).json({
      message: "Trenerni o‘chirishda xatolik yuz berdi",
      error: error.message,
    });
  }
};
