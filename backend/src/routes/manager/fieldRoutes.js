import express from "express";
import { getAllFields } from "../../controllers/manager/fieldController.js";

const router = express.Router();

// GET /api/manager/fields
router.get("/", getAllFields);

export default router;
