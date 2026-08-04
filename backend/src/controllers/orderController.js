const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Table = require('../models/Table');
const { sendSuccess, sendError } = require('../utils/helpers');

// GET /api/orders
const getAllOrders = async (req, res, next) => {
  try {
    const { status, paymentStatus, limit = 50 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const orders = await Order.find(filter)
      .populate('table', 'tableNumber')
      .populate('items.menuItem', 'name price')
      .populate('assignedWaiter', 'name')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    sendSuccess(res, 200, 'Orders fetched.', { count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('table', 'tableNumber location')
      .populate('items.menuItem', 'name price imageUrl')
      .populate('assignedWaiter', 'name email');

    if (!order) return sendError(res, 404, 'Order not found.');
    sendSuccess(res, 200, 'Order fetched.', { order });
  } catch (error) {
    next(error);
  }
};

// POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { tableId, items, customerName, notes, assignedWaiter } = req.body;

    // Enrich items with current price snapshot
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const menuItem = await MenuItem.findById(item.menuItem);
        if (!menuItem) throw new Error(`Menu item ${item.menuItem} not found.`);
        if (!menuItem.isAvailable) throw new Error(`${menuItem.name} is not available.`);
        return {
          menuItem: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: item.quantity,
          notes: item.notes,
        };
      })
    );

    const order = await Order.create({
      table: tableId,
      items: enrichedItems,
      customerName,
      notes,
      assignedWaiter,
    });

    // Mark table as occupied
    if (tableId) {
      await Table.findByIdAndUpdate(tableId, {
        status: 'occupied',
        currentOrder: order._id,
      });
    }

    // Emit socket event
    const io = req.app.get('io');
    if (io) io.emit('newOrder', order);

    sendSuccess(res, 201, 'Order created.', { order });
  } catch (error) {
    next(error);
  }
};

// PUT /api/orders/:id
const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('table', 'tableNumber')
      .populate('items.menuItem', 'name price');

    if (!order) return sendError(res, 404, 'Order not found.');

    // Emit socket event for status changes
    const io = req.app.get('io');
    if (io) io.emit('orderStatusUpdated', { orderId: order._id, status: order.status, order });

    sendSuccess(res, 200, 'Order updated.', { order });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return sendError(res, 400, 'Invalid status value.');
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('table', 'tableNumber');

    if (!order) return sendError(res, 404, 'Order not found.');

    // Free table when order is served or cancelled
    if (['served', 'cancelled'].includes(status) && order.table) {
      await Table.findByIdAndUpdate(order.table._id, {
        status: 'available',
        currentOrder: null,
      });
    }

    const io = req.app.get('io');
    if (io) io.emit('orderStatusUpdated', { orderId: order._id, status: order.status, order });

    sendSuccess(res, 200, 'Order status updated.', { order });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/orders/:id
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return sendError(res, 404, 'Order not found.');
    sendSuccess(res, 200, 'Order deleted.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
};
