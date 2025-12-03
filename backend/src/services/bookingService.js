// src/services/bookingService.js
import db from "../config/db.js";

/**
 * Lấy danh sách booking với filter và phân trang cơ bản
 * filters: { status, field_id, page, limit }
 */
export const getBookingsService = async (filters = {}) => {
  const { status, field_id, page = 1, limit = 20 } = filters;

  const offset = (Number(page) - 1) * Number(limit);

  // Query lấy thông tin booking + customer + field
  let sql = `
    SELECT 
      b.booking_id,
      b.customer_id,
      p.name AS customer_name,
      b.field_id,
      b.schedule_id,
      b.start_time,
      b.end_time,
      b.status,
      b.note,
      b.price
    FROM bookings b
    LEFT JOIN person p ON b.customer_id = p.person_id
    LEFT JOIN fields f ON b.field_id = f.field_id
    WHERE 1=1
  `;

  const params = [];

  if (status) {
    sql += " AND b.status = ?";
    params.push(status);
  }

  if (field_id) {
    sql += " AND b.field_id = ?";
    params.push(field_id);
  }

  sql += " LIMIT ? OFFSET ?";
  params.push(Number(limit), Number(offset));

  const [rows] = await db.query(sql, params);
  return rows;
};

/**
 * Lấy tổng số booking
 */
export const countBookingsService = async (filters = {}) => {
  const { status, field_id } = filters;

  let sql = `SELECT COUNT(*) AS total FROM bookings b WHERE 1=1`;
  const params = [];

  if (status) {
    sql += " AND b.status = ?";
    params.push(status);
  }

  if (field_id) {
    sql += " AND b.field_id = ?";
    params.push(field_id);
  }

  const [rows] = await db.query(sql, params);
  return rows[0].total || 0;
};

// Xác nhận duyệt booking
export const approveBookingService = async (booking_id) => {
  // 1. Lấy booking hiện tại
  const [bookingRows] = await db.query(
    "SELECT * FROM bookings WHERE booking_id = ?",
    [booking_id]
  );

  if (bookingRows.length === 0) {
    throw new Error("Booking không tồn tại");
  }

  const booking = bookingRows[0];

  // 2. Chỉ duyệt nếu status = pending
  if (booking.status !== "pending") {
    throw new Error("Booking không ở trạng thái chờ duyệt");
  }

  // 3. Lấy thông tin slot sân từ field_schedules
  const [scheduleRows] = await db.query(
    "SELECT * FROM field_schedules WHERE schedule_id = ?",
    [booking.schedule_id]
  );

  if (scheduleRows.length === 0) {
    throw new Error("Lịch sân không tồn tại");
  }

  const schedule = scheduleRows[0];

  // 4. Kiểm tra slot đang trống hay đã bị đặt
  if (schedule.is_available === 0) {
    throw new Error("Lịch sân này đã được đặt. Không thể duyệt booking.");
  }

  // 5. Duyệt booking: từ pending → confirmed
  await db.query(
    "UPDATE bookings SET status = 'confirmed' WHERE booking_id = ?",
    [booking_id]
  );

  // 6. Update field_schedules: đánh dấu đã có người đặt (is_available = 0)
  await db.query(
    "UPDATE field_schedules SET is_available = 0 WHERE schedule_id = ?",
    [booking.schedule_id]
  );

  return { message: "Xác nhận đặt sân thành công" };
};

export const completeBookingService = async (booking_id) => {
  // 1. Lấy booking
  const [bookingRows] = await db.query(
    "SELECT * FROM bookings WHERE booking_id = ?",
    [booking_id]
  );

  if (bookingRows.length === 0) {
    throw new Error("Booking không tồn tại");
  }

  const booking = bookingRows[0];

  // 2. Chỉ cho hoàn thành nếu booking đang ở trạng thái confirmed
  if (booking.status !== "confirmed") {
    throw new Error("Chỉ có thể hoàn thành booking đã được xác nhận");
  }

  // 3. Cập nhật booking → finished
  await db.query("UPDATE bookings SET status = 'ready' WHERE booking_id = ?", [
    booking_id,
  ]);

  // 4. Mở lịch sân trở lại
  await db.query(
    "UPDATE field_schedules SET is_available = 1 WHERE schedule_id = ?",
    [booking.schedule_id]
  );

  return { message: "Hoàn thành sân — mở lại lịch thành công" };
};
