const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roleCheck');
const { orderValidator } = require('../utils/validators');

router.use(protect);

router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.post('/', orderValidator, createOrder);
router.put('/:id', authorize('admin', 'manager', 'waiter'), updateOrder);
router.patch('/:id/status', authorize('admin', 'manager', 'waiter', 'kitchen'), updateOrderStatus);
router.delete('/:id', authorize('admin', 'manager'), deleteOrder);

module.exports = router;
