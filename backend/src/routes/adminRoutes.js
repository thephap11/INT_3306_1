
import { Router } from "express";
import { ping } from "../controllers/adminController.js";
import { requireAuth, } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
const r = Router();
r.get("/ping", requireAuth, requireRole("admin"), ping);
export default r;
