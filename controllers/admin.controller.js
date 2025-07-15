import bcrypt from "bcrypt";
import Admin from "../models/admin.js";

// Barcha adminlarni olish
export const getAllAdmins = async (_, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bitta adminni ID bo‘yicha olish
export const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin)
      return res.status(404).json({ message: "Administrator topilmadi" });

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin ma'lumotlarini yangilash
export const updateAdmin = async (req, res) => {
  try {
    const { fullName, phoneNumber, password } = req.body;

    const existingUser = await Admin.findOne({ phoneNumber });
    if (!existingUser)
      return res.status(400).json({ message: "Administrator topilmadi" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      { fullName, phoneNumber, password: hashedPassword },
      { new: true }
    ).select("-password");

    res.json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Adminni o‘chirish
export const deleteAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: "Administrator o‘chirildi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tizimga kirgan foydalanuvchi (admin) ma'lumotlarini olish
export const getUser = async (req, res) => {
  try {
    const foundAdmin = await Admin.findById(req.userId);
    if (!foundAdmin)
      return res.status(404).json({ message: "Administrator topilmadi" });

    return res.status(200).json(foundAdmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
