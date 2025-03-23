import Trainer from "../models/trainer.js";
import { upload } from "../middlewares/Uploader.js";

export const getAllTrainers = async (_, res) => {
  try {
    const trainers = await Trainer.find();
    res.status(200).json(trainers);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

export const getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: "Тренер не найден" });
    }
    res.status(200).json(trainer);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

export const createTrainer = async (req, res) => {
  try {
    upload.single("photo")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { fullName, experience, achievements } = req.body;
      if (!fullName || !experience) {
        return res.status(400).json({ message: "Все поля обязательны" });
      }

      const photo = req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : null;

      const newTrainer = new Trainer({
        fullName,
        photo,
        experience,
        achievements,
      });

      await newTrainer.save();
      res.status(201).json(newTrainer);
    });
  } catch (error) {
    res.status(500).json({
      message: "Ошибка при создании тренера",
      error: error.message,
    });
  }
};

export const updateTrainer = async (req, res) => {
  try {
    upload.single("photo")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { fullName, experience, achievements } = req.body;

      const updateData = {
        fullName,
        experience,
        achievements,
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
        return res.status(404).json({ message: "Тренер не найден" });
      }

      res.status(200).json(updatedTrainer);
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при обновлении тренера", error: error.message });
  }
};

export const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: "Тренер не найден" });
    }

    res.status(200).json({ message: "Тренер удален" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при удалении тренера", error: error.message });
  }
};
