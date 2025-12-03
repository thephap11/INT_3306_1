// src/controllers/manager/bookingController.js
import {
  getBookingsService,
  countBookingsService,
  approveBookingService,
  completeBookingService,
} from "../../services/bookingService.js";

/**
 * GET /api/manager/bookings
 * Query params hỗ trợ: status, field_id, page, limit
 */
export const getAllBookings = async (req, res) => {
  try {
    const { status, field_id, page, limit } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (field_id) filters.field_id = field_id;
    if (page) filters.page = page;
    if (limit) filters.limit = limit;

    const [bookings, total] = await Promise.all([
      getBookingsService(filters),
      countBookingsService(filters),
    ]);

    res.json({
      success: true,
      data: bookings,
      meta: {
        total,
        page: Number(page || 1),
        limit: Number(limit || 20),
      },
    });
  } catch (err) {
    console.error("Error in getAllBookings:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách đặt sân",
    });
  }
};

export const approveBookingController = async (req, res) => {
  try {
    const { booking_id } = req.params;

    const result = await approveBookingService(booking_id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const completeBookingController = async (req, res) => {
  try {
    const result = await completeBookingService(req.params.booking_id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
