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
    console.error("🔥 Lỗi SQL:", err);
    throw err;
  }
};

/**
 * Cập nhật thông tin sân bóng
 * Cho phép update:
 * - field_name
 * - price
 * - location
 * - status
 */
export const updateFieldService = async (id, data) => {
  try {
    const updateFields = [];
    const values = [];

    if (data.field_name !== undefined) {
      updateFields.push("field_name = ?");
      values.push(data.field_name);
    }

    if (data.price !== undefined) {
      updateFields.push("price = ?");
      values.push(data.price);
    }

    if (data.location !== undefined) {
      updateFields.push("location = ?");
      values.push(data.location);
    }

    if (data.status !== undefined) {
      updateFields.push("status = ?");
      values.push(data.status);
    }

    // Không có gì để update
    if (updateFields.length === 0) {
      return null;
    }

    const sql = `UPDATE fields SET ${updateFields.join(
      ", "
    )} WHERE field_id = ?`;

    values.push(id);

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) return null;

    // Lấy lại dữ liệu sau update
    const [updated] = await db.query(
      "SELECT * FROM fields WHERE field_id = ?",
      [id]
    );

    return updated[0];
  } catch (error) {
    console.error("🔥 Lỗi updateFieldService:", error);
    throw error;
  }
};
