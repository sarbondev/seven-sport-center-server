import jwt from "jsonwebtoken";

export default function (req, res, next) {
  try {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
    if (!token) {
      return res
        .status(403)
        .json({ message: "Вход запрещен: token не действителен!" });
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = userId;
    next();
  } catch (error) {
    console.error("Token не действителен!:", error.message);
    return res
      .status(403)
      .json({ message: "Вход запрещен: token не действителен!" });
  }
}