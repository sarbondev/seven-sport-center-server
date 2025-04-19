import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
} from "../controllers/blog.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.post("/", isAuth, createBlog);
router.put("/:id", isAuth, updateBlog);
router.delete("/:id", isAuth, deleteBlog);

export default router;
