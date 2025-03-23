import Blog from "../models/blog.js";
import { upload } from "../middlewares/Uploader.js";

export const getAllBlogs = async (_, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Тренер не найден" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    upload.array("photos")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { title, description } = req.body;
      if (!title || !description) {
        return res.status(400).json({ message: "Все поля обязательны" });
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
      message: "Ошибка при создании блога",
      error: error.message,
    });
  }
};

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
        return res.status(404).json({ message: "Блог не найден" });
      }

      res.status(200).json(updatedBlog);
    });
  } catch (error) {
    res.status(500).json({
      message: "Ошибка при обновлении блога",
      error: error.message,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Блог не найден" });
    }

    res.status(200).json({ message: "Блог удален" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при удалении блога", error: error.message });
  }
};
