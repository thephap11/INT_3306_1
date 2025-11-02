
import { Router } from "express";
import { ping } from "../controllers/userController.js";
const r = Router();
r.get("/ping", ping);
export default r;
