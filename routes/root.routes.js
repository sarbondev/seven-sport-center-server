import express from "express";
import BlogRoutes from "./blog.routes.js";
import TrainerRoutes from "./trainer.routes.js";
import AdminRoutes from "./admin.routes.js";

const router = express.Router();

router.use("/blog", BlogRoutes);
router.use("/trainer", TrainerRoutes);
router.use("/admin", AdminRoutes);

export default router;
