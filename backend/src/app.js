import "./config/dotenv.js";
import "./config/database.js"; // Initialize database connection
import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import adminRoutes from "./routes/admin/adminRoutes.js";
import managerRoutes from "./routes/manager/managerRoutes.js";
import userRoutes from "./routes/user/userRoutes.js";
import authRoutes from "./routes/user/authRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (_, res) => res.json({ 
  name: "football-management-backend",
  version: "0.1.0",
  status: "running",
  endpoints: {
    auth: "/api/auth",
    user: "/api/user",
    admin: "/api/admin",
    manager: "/api/manager"
  }
}));

export default app;
