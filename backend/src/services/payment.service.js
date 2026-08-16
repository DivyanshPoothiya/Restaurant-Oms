const Order = require('../models/Order');

/**
 * Process payment for an order (stub — wire in a real gateway for production)
 */
const processPayment = async (orderId, method) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found.');
  if (order.paymentStatus === 'paid') throw new Error('Order is already paid.');

  order.paymentStatus = 'paid';
  order.paymentMethod = method;
  await order.save();

  return order;
};

module.exports = { processPayment };
