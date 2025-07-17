import express from "express";
import BlogRoutes from "./blog.routes.js";
import TrainerRoutes from "./trainer.routes.js";
import AdminRoutes from "./admin.routes.js";
import AuthRoutes from "./auth.routes.js";

const router = express.Router();

router.use("/auth", AuthRoutes);
router.use("/blog", BlogRoutes);
router.use("/trainer", TrainerRoutes);
router.use("/admin", AdminRoutes);

export default router;
