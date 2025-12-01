
import { Router } from "express";
import { listBookings, approveBooking, rejectBooking } from "../../controllers/manager/bookingController.js";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { requireRole } from "../../middleware/roleMiddleware.js";

const r = Router();

// Booking management
r.get('/bookings', listBookings);
r.put('/bookings/:id/approve', approveBooking);
r.put('/bookings/:id/reject', rejectBooking);

export default r;