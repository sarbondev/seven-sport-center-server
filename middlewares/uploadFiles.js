import multer from "multer";
import crypto from "crypto";
import path from "path";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      const hash = crypto.randomBytes(16).toString("hex");
      const ext = path.extname(file.originalname);
      cb(null, `${hash}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

export default function (req, res) {
  upload.array("photo")(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    const uploadedPhotos = req.files.map(
      (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
    );
    res.status(200).json({
      message: "Photos successfully uploaded!",
      photos: uploadedPhotos,
    });
  });
}
