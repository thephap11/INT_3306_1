import express from "express";
import {
  getAllFields,
  getFieldById,
} from "../../controllers/manager/fieldController.js";

const router = express.Router();

// GET /api/manager/fields → Lấy danh sách sân
router.get("/", getAllFields);

// GET /api/manager/fields/:id → Xem chi tiết sân
router.get("/:id", getFieldById);

export default router;
