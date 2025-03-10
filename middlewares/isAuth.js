import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (!token) return res.json({ message: "Запрешено" });
  const { userId } = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = userId;
  next();
}
