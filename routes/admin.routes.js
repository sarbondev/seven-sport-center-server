import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  deleteAdmin,
  getAllAdmins,
  getUser,
  getAdmin,
  updateAdmin,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.use(isAuth);

router.get("/", getAllAdmins);
router.get("/profile", getUser);
router.get("/:id", getAdmin);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

export default router;
