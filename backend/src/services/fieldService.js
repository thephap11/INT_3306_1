// =============================
// SERVICE: Xử lý nghiệp vụ liên quan đến sân bóng
// =============================
import db from "../config/db.js";

/**
 * Lấy toàn bộ danh sách sân bóng
 * @returns {Promise<Array>} danh sách tất cả sân trong bảng "fields"
 */
export const getAllFieldsService = async () => {
  const [rows] = await db.query("SELECT * FROM fields");
  return rows;
};

/**
 * Lấy thông tin chi tiết một sân bóng theo ID
 * @param {number} fieldId - ID của sân bóng cần xem
 * @returns {Promise<Object|null>} thông tin sân hoặc null nếu không tồn tại
 */
export const getFieldByIdService = async (id) => {
  try {
    const [rows] = await db.query("SELECT * FROM fields WHERE field_id = ?", [
      id,
    ]);

    console.log("Kết quả truy vấn:", rows); // <— thêm log này

    return rows[0] || null;
  } catch (err) {
    console.error("🔥 Lỗi SQL:", err); // <— và thêm log này
    throw err;
  }
};
