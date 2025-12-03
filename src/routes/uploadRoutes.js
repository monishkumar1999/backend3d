import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/models/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST /api/upload/model
router.post("/model", upload.single("model"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const fileUrl = `http://localhost:5000/uploads/models/${req.file.filename}`;

  res.json({ success: true, url: fileUrl });
});

export default router;
