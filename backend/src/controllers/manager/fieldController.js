import db from "../../config/db.js";

export const getAllFields = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM fields");

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching fields:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách sân",
    });
  }
};
