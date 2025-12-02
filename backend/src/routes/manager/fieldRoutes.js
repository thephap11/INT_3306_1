// ROUTES xác định URL và ánh xạ đến controller tương ứng
import express from "express";
import {
  getAllFields,
  getFieldById,
  updateField,
} from "../../controllers/manager/fieldController.js";
import {
  uploadFieldImage,
  getFieldImages,
  deleteFieldImage,
} from "../../controllers/manager/fieldController.js";
import { uploadSingle } from "../../middleware/upload.js";

const router = express.Router();

// upload single image
router.post("/:id/upload-image", uploadSingle, uploadFieldImage);

// lấy danh sách ảnh
router.get("/:id/images", getFieldImages);

// xóa ảnh
router.delete("/images/:imageId", deleteFieldImage);

// các route động
router.get("/", getAllFields);
router.get("/:id", getFieldById);
router.put("/:id", updateField);

export default router;
