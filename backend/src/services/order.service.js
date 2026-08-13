const Order = require('../models/Order');

/**
 * Get order statistics for dashboard
 */
const getOrderStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalOrders, todayOrders, revenue, pendingOrders] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: today } }),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    Order.countDocuments({ status: { $in: ['pending', 'confirmed', 'preparing'] } }),
  ]);

  return {
    totalOrders,
    todayOrders,
    totalRevenue: revenue[0]?.total || 0,
    pendingOrders,
  };
};

module.exports = { getOrderStats };
