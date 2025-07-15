import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

// Foydalanuvchi tizimga kirganini tekshiruvchi oddiy middleware
const checkAuth = async (req, res, next) => {
  try {
    // So‘rov sarlavhasidan tokenni olish
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

    // Agar token taqdim etilmagan bo‘lsa
    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Ruxsat berilmadi. Token mavjud emas. Iltimos, avval tizimga kiring.",
      });
    }

    // Tokenni tekshirish
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Admin foydalanuvchini topish
    const admin = await Admin.findById(decoded.userId).select("-password");
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Noto‘g‘ri token. Foydalanuvchi topilmadi.",
      });
    }

    // Foydalanuvchi ma’lumotlarini so‘rovga biriktirish, boshqa funksiyalar foydalanishi uchun
    req.user = admin;
    req.userId = admin._id;

    // Keyingi funksiyaga o‘tish
    next();
  } catch (error) {
    console.log("Autentifikatsiya xatosi:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token formati noto‘g‘ri.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token muddati tugagan. Iltimos, qayta tizimga kiring.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Autentifikatsiya muvaffaqiyatsiz tugadi.",
    });
  }
};

export default checkAuth;
