import "./config/dotenv.js";
import db from "./config/db.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";

// manager
import managerFieldRoutes from "./routes/manager/fieldRoutes.js";
import managerBookingRoutes from "./routes/manager/bookingRoutes.js";
import managerPaymentRoutes from "./routes/manager/paymentRoutes.js";

// admin
import adminRoutes from "./routes/admin/adminRoutes.js";

// user
import userRoutes from "./routes/user/userRoutes.js";
import authRoutes from "./routes/user/authRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Manager routes
app.use("/api/manager/fields", managerFieldRoutes);
app.use("/api/manager/bookings", managerBookingRoutes);
app.use("/api/manager/payments", managerPaymentRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// User routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Football Backend Running!" });
});

// Test kết nối Database
db.getConnection()
  .then(() => console.log("MySQL connected successfully!"))
  .catch((err) => console.error("MySQL connection error:", err));

export default app;
