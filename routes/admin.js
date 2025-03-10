import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  deleteAdmin,
  getAllAdmins,
  getUser,
  getAdmin,
  login,
  register,
  updateAdmin,
} from "../controllers/admin.js";

const router = express.Router();

router.post("/register", isAuth, register);
router.post("/login", login);

router.get("/", isAuth, getAllAdmins);
router.get("/profile", isAuth, getUser);
router.get("/:id", isAuth, getAdmin);
router.put("/:id", isAuth, updateAdmin);
router.delete("/:id", isAuth, deleteAdmin);

export default router;
