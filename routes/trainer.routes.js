import express from "express";
import {
  getAllTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
} from "../controllers/trainer.controller.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/", getAllTrainers);
router.get("/:id", getTrainerById);
router.post("/", isAuth, createTrainer);
router.put("/:id", isAuth, updateTrainer);
router.delete("/:id", isAuth, deleteTrainer);

export default router;
