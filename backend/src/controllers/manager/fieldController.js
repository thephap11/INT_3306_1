// =============================
// CONTROLLER: Nhận request từ client và gọi xuống service
// =============================
import { getAllFieldsService } from "../../services/fieldService.js";
import { getFieldByIdService } from "../../services/fieldService.js";
import { updateFieldService } from "../../services/fieldService.js";
import db from "../../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Controller lấy danh sách toàn bộ sân bóng
 * Không nhận tham số
 * Gọi service để lấy dữ liệu và trả về response JSON
 */
export const getAllFields = async (req, res) => {
  try {
    // Gọi service xử lý database
    const fields = await getAllFieldsService();

    res.json({
      success: true,
      data: fields,
    });
  } catch (error) {
    console.error("Error fetching fields:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách sân",
    });
  }
};

/**
 * Controller lấy thông tin chi tiết sân theo ID
 * Nhận req.params.field_id từ route
 * Trả về chi tiết sân hoặc lỗi nếu không tồn tại
 */
export const getFieldById = async (req, res) => {
  try {
    const fieldId = req.params.id;

    const field = await getFieldByIdService(fieldId);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sân bóng",
      });
    }

    res.json({
      success: true,
      data: field,
    });
  } catch (error) {
    console.error("Error in getFieldById:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin sân",
    });
  }
};

/**
 * Cập nhật thông tin sân bóng
 * Nhận req.params.id và req.body (field_name, location, status)
 */
export const updateField = async (req, res) => {
  try {
    console.log("🔥 BODY:", req.body);
    const fieldId = req.params.id;
    const { field_name, location, status } = req.body;

    // Validate dữ liệu gửi lên
    if (!field_name && !location && !status) {
      return res.status(400).json({
        success: false,
        message: "Bạn phải gửi ít nhất một trường để cập nhật",
      });
    }

    // Gọi service update
    const updatedField = await updateFieldService(fieldId, {
      field_name,
      location,
      status,
    });

    if (!updatedField) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sân để cập nhật",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật sân thành công",
      data: updatedField,
    });
  } catch (error) {
    console.error("Error updating field:", error);

    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật sân",
    });
  }
};

/**
 * Upload 1 ảnh, lưu record vào field_images
 * Multer đã lưu file vào uploads/fields và gắn req.file
 */
export const uploadFieldImage = async (req, res) => {
  try {
    const fieldId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Chưa chọn ảnh" });
    }

    // Tạo đường dẫn lưu trong DB (dùng đường dẫn public)
    const imageUrl = `/uploads/fields/${req.file.filename}`;

    // Lưu vào DB: field_images (image_id PK auto, field_id, image_url, uploaded_at)
    await db.query(
      `INSERT INTO field_images (field_id, image_url, uploaded_at) VALUES (?, ?, NOW())`,
      [fieldId, imageUrl]
    );

    return res.json({
      success: true,
      message: "Upload ảnh thành công",
      image_url: imageUrl,
    });
  } catch (error) {
    console.error("Upload image error:", error);
    return res.status(500).json({ success: false, message: "Upload thất bại" });
  }
};

/**
 * Lấy danh sách ảnh của 1 sân theo field_id
 */
export const getFieldImages = async (req, res) => {
  try {
    const fieldId = req.params.id;
    const [rows] = await db.query(
      "SELECT * FROM field_images WHERE field_id = ? ORDER BY uploaded_at DESC",
      [fieldId]
    );

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Get images error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

/**
 * Xóa ảnh: xoá record DB + file vật lý trên server
 * URL: DELETE /api/manager/fields/images/:imageId
 */
export const deleteFieldImage = async (req, res) => {
  try {
    const imageId = req.params.imageId;

    // Lấy record để biết file path
    const [rows] = await db.query(
      "SELECT * FROM field_images WHERE image_id = ?",
      [imageId]
    );
    const image = rows[0];

    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy ảnh" });
    }

    // Xóa file trên ổ cứng
    const filePath = path.join(__dirname, "../../..", image.image_url); // vì image_url like /uploads/fields/xxx
    // hoặc: path.join(process.cwd(), image.image_url)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Xóa DB
    await db.query("DELETE FROM field_images WHERE image_id = ?", [imageId]);

    return res.json({ success: true, message: "Xóa ảnh thành công" });
  } catch (error) {
    console.error("Delete image error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Xóa ảnh thất bại" });
  }
};
