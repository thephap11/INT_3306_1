// =============================
// CONTROLLER: Nhận request từ client và gọi xuống service
// =============================
import { getAllFieldsService } from "../../services/fieldService.js";
import { getFieldByIdService } from "../../services/fieldService.js";
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
