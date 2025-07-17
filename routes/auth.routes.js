import express from "express";
import {
  changePassword,
  login,
  register,
} from "../controllers/auth.controller.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", isAuth, register);
router.post("/change-password", isAuth, changePassword);

export default router;
