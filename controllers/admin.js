import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

export const register = async (req, res) => {
  const { fullName, phoneNumber, password } = req.body;

  try {
    const existingUser = await Admin.findOne({ phoneNumber });
    if (existingUser)
      return res.status(400).json({ message: "Номер телефона уже существует" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      fullName,
      phoneNumber,
      password: hashedPassword,
    });
    await newAdmin.save();

    res.status(201).json({ message: "Администратор успешно зарегистрирован" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const admin = await Admin.findOne({ phoneNumber });
    if (!admin)
      return res.status(404).json({ message: "Администратор не найден" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Неверные учетные данные" });

    const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({ token, admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAdmins = async (_, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin)
      return res.status(404).json({ message: "Администратор не найден" });

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");
    res.json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: "Администратор удален" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const foundAdmin = await Admin.findById(req.userId);
    if (!foundAdmin)
      return res.status(404).json({ message: "Администратор не найден" });
    return res.status(200).json(foundAdmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
