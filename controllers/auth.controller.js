import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

export const register = async (req, res) => {
  const { fullName, phoneNumber, password } = req.body;

  try {
    if (!phoneNumber || !fullName || !password) {
      return res
        .status(409)
        .json({ message: "Barcha maydonlarni to'ldiring." });
    }
    const existingUser = await Admin.findOne({ phoneNumber });
    if (existingUser)
      return res.status(400).json({
        message: "Bunday telefon raqam bilan oldin ro'yhatdan o'tilgan.",
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      fullName,
      phoneNumber,
      password: hashedPassword,
    });
    await newAdmin.save();

    res.status(201).json({ message: "Yangi admin ro'yhatdan o'tdi." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const admin = await Admin.findOne({ phoneNumber });
    if (!admin) return res.status(404).json({ message: "Admin topilmadi." });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Noto'g'ri parol yoki telefon raqam." });

    const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({ token, admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
