import Field from '../models/Field.js';
import { Op } from 'sequelize';

// GET /api/user/fields
export const listFields = async (req, res) => {
  try {
    const { q, limit = 50, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    const where = { status: 'active' };
    if (q) {
      // basic search on field_name or location using Sequelize operators
      where[Op.or] = [
        { field_name: { [Op.like]: `%${q}%` } },
        { location: { [Op.like]: `%${q}%` } }
      ];
    }

    const fields = await Field.findAll({
      where,
      order: [['field_id', 'ASC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });

    // Map to frontend-friendly shape
    const data = fields.map(f => ({
      field_id: f.field_id,
      field_name: f.field_name,
      location: f.location || 'Chưa cập nhật',
      status: f.status,
      image: '/images/fields/placeholder.svg',
      // extra ui-only fields
      price: 'Liên hệ',
      pricePerHour: null,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      reviews: Math.floor(Math.random() * 200 + 10),
      type: 'Sân 7 người',
      facilities: ['Bãi đỗ xe', 'Đèn chiếu sáng', 'Phòng thay đồ'],
      openTime: '5h - 23h',
      distance: '2.5km',
      isOpen: true
    }));

    // return plain array (frontend expects array)
    res.json(data);
  } catch (error) {
    console.error('List fields error:', error);
    res.status(500).json({ message: 'Server error when fetching fields' });
  }
};
