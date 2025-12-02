import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đảm bảo thư mục uploads tồn tại
const uploadPath = path.join(__dirname, "../../uploads/fields");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `field_${Date.now()}${ext}`);
  },
});

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/bmp",
];

const fileFilter = (req, file, cb) => {
  console.log("=== FILE INFO ===");
  console.log("originalname:", file.originalname);
  console.log("mimetype:", file.mimetype);

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid image type"));
  }
  cb(null, true);
};

export const uploadSingle = multer({ storage, fileFilter }).single("image");
