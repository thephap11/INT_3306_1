
import { Router } from "express";
import { ping } from "../controllers/userController.js";
import { listFields } from "../controllers/fieldController.js";

const r = Router();

r.get("/ping", ping);

// Public: list fields
r.get('/fields', listFields);

export default r;
