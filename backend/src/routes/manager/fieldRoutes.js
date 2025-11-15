import express from "express";
import { getFields } from "../../controllers/manager/fieldController.js";

const router = express.Router();

router.get("/", getFields);

export default router;
