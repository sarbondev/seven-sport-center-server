import Blog from "../models/blog.js";
import { upload } from "../middlewares/Uploader.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Barcha bloglarni olish
export const getAllBlogs = async (req, res) => {
  try {
    const { title } = req.query;
    const query = {};
    if (title) query.title = { $regex: title, $options: "i" };
    const blogs = await Blog.find(query);
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// Blogni ID orqali olish
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog topilmadi" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// Yangi blog yaratish
export const createBlog = async (req, res) => {
  try {
    upload.array("photos")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { title, description } = req.body;
      if (!title || !description) {
        return res
          .status(400)
          .json({ message: "Barcha maydonlar to‘ldirilishi shart" });
      }

      const photos = req.files.map(
        (file) =>
          `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
      );

      const newBlog = new Blog({
        title,
        photos,
        description,
      });

      await newBlog.save();
      res.status(201).json(newBlog);
    });
  } catch (error) {
    res.status(500).json({
      message: "Blog yaratishda xatolik yuz berdi",
      error: error.message,
    });
  }
};

// Blogni yangilash
export const updateBlog = async (req, res) => {
  try {
    upload.array("photos")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { title, description } = req.body;

      const updateData = { title, description };

      if (req.files && req.files.length > 0) {
        updateData.photos = req.files.map(
          (file) =>
            `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
        );
      }

      const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedBlog) {
        return res.status(404).json({ message: "Blog topilmadi" });
      }

      res.status(200).json(updatedBlog);
    });
  } catch (error) {
    res.status(500).json({
      message: "Blog yangilashda xatolik yuz berdi",
      error: error.message,
    });
  }
};

// Blogni o‘chirish
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog topilmadi" });
    }

    if (blog.photos && blog.photos.length > 0) {
      blog.photos.forEach((photo) => {
        const slicedImage = photo.slice(30);
        const filePath = path.join(__dirname, "..", "uploads", slicedImage);
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          } else {
            console.warn(`Fayl topilmadi: ${filePath}`);
          }
        } catch (err) {
          console.error(`Rasmni o‘chirishda xatolik: ${filePath}`, err);
        }
      });
    }

    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Blog o‘chirildi", deletedBlog });
  } catch (error) {
    res.status(500).json({
      message: "Blogni o‘chirishda xatolik yuz berdi",
      error: error.message,
    });
  }
};
