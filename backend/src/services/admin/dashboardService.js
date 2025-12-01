import { User, Field, Booking, Payment } from '../../models/index.js';
import { Op } from 'sequelize';

/**
 * Get dashboard statistics
 */
export const getDashboardStatsService = async () => {
  // User stats
  const totalUsers = await User.count({ where: { role: 'user' } });
  const activeUsers = await User.count({ where: { role: 'user', status: 'active' } });

  // Field stats
  const totalFields = await Field.count();
  const activeFields = await Field.count({ where: { status: 'active' } });

  // Booking stats
  const totalBookings = await Booking.count();
  const pendingBookings = await Booking.count({ where: { status: 'pending' } });

  // Today's bookings
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayBookings = await Booking.count({
    where: {
      start_time: {
        [Op.gte]: today,
        [Op.lt]: tomorrow
      }
    }
  });

  // Revenue stats
  const totalRevenue = await Payment.sum('amount', {
    where: { status: 'completed' }
  }) || 0;

  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthlyRevenue = await Payment.sum('amount', {
    where: {
      status: 'completed',
      payment_date: { [Op.gte]: thisMonthStart }
    }
  }) || 0;

  // Pending payments
  const pendingPayments = await Payment.count({ where: { status: 'pending' } });

  // Recent bookings (last 5)
  const recentBookings = await Booking.findAll({
    limit: 5,
    order: [['start_time', 'DESC']],
    include: [
      {
        model: User,
        as: 'customer',
        attributes: ['person_name', 'phone']
      },
      {
        model: Field,
        as: 'field',
        attributes: ['field_name']
      }
    ]
  });

  // Bookings by status
  const bookingsByStatus = await Booking.findAll({
    attributes: [
      'status',
      [Booking.sequelize.fn('COUNT', Booking.sequelize.col('booking_id')), 'count']
    ],
    group: ['status']
  });

  return {
    users: {
      total: totalUsers,
      active: activeUsers
    },
    fields: {
      total: totalFields,
      active: activeFields
    },
    bookings: {
      total: totalBookings,
      pending: pendingBookings,
      today: todayBookings
    },
    revenue: {
      total: parseFloat(totalRevenue).toFixed(2),
      monthly: parseFloat(monthlyRevenue).toFixed(2),
      pendingPayments: pendingPayments
    },
    recentBookings: recentBookings,
    bookingsByStatus: bookingsByStatus
  };
};

/**
 * Get revenue by date range
 */
export const getRevenuByDateRangeService = async (startDate, endDate) => {
  const payments = await Payment.findAll({
    where: {
      status: 'completed',
      payment_date: {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      }
    },
    include: [
      {
        model: Field,
        as: 'field',
        attributes: ['field_name']
      },
      {
        model: User,
        as: 'customer',
        attributes: ['person_name']
      }
    ],
    order: [['payment_date', 'DESC']]
  });

  const totalRevenue = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

  return {
    payments: payments,
    totalRevenue: totalRevenue.toFixed(2),
    count: payments.length
  };
};

/**
 * Get revenue by field
 */
export const getRevenueByFieldService = async (fieldId, startDate, endDate) => {
  const whereClause = {
    field_id: fieldId,
    status: 'completed'
  };

  if (startDate && endDate) {
    whereClause.payment_date = {
      [Op.between]: [new Date(startDate), new Date(endDate)]
    };
  }

  const payments = await Payment.findAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: 'customer',
        attributes: ['person_name']
      },
      {
        model: Booking,
        as: 'booking',
        attributes: ['start_time', 'end_time']
      }
    ],
    order: [['payment_date', 'DESC']]
  });

  const totalRevenue = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

  return {
    payments: payments,
    totalRevenue: totalRevenue.toFixed(2),
    count: payments.length
  };
};

/**
 * Get monthly revenue statistics
 */
export const getMonthlyRevenueStatsService = async (year) => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59);

  const payments = await Payment.findAll({
    where: {
      status: 'completed',
      payment_date: {
        [Op.between]: [startDate, endDate]
      }
    },
    attributes: [
      [Payment.sequelize.fn('MONTH', Payment.sequelize.col('payment_date')), 'month'],
      [Payment.sequelize.fn('SUM', Payment.sequelize.col('amount')), 'revenue'],
      [Payment.sequelize.fn('COUNT', Payment.sequelize.col('payment_id')), 'count']
    ],
    group: [Payment.sequelize.fn('MONTH', Payment.sequelize.col('payment_date'))],
    order: [[Payment.sequelize.fn('MONTH', Payment.sequelize.col('payment_date')), 'ASC']]
  });

  // Fill in missing months with 0
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    revenue: 0,
    count: 0
  }));

  payments.forEach(payment => {
    const monthIndex = payment.get('month') - 1;
    monthlyData[monthIndex] = {
      month: payment.get('month'),
      revenue: parseFloat(payment.get('revenue')),
      count: parseInt(payment.get('count'))
    };
  });

  return monthlyData;
};
