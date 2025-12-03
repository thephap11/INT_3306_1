// src/routes/manager/bookingRoutes.js
import express from "express";
import { getAllBookings } from "../../controllers/manager/bookingController.js";
import { approveBookingController } from "../../controllers/manager/bookingController.js";
import { completeBookingController } from "../../controllers/manager/bookingController.js";

const router = express.Router();

// GET /api/manager/bookings
router.get("/", getAllBookings);

// Xác nhận booking
router.put("/approve/:booking_id", approveBookingController);
// Hoàn thành booking
router.put("/complete/:booking_id", completeBookingController);

export default router;
