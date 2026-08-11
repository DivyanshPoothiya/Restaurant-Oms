const express = require('express');
const router = express.Router();
const {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roleCheck');
const { menuItemValidator } = require('../utils/validators');

// Public: anyone can browse the menu
router.get('/', getAllMenuItems);
router.get('/:id', getMenuItemById);

// Protected: only admin and manager can modify
router.post('/', protect, authorize('admin', 'manager'), menuItemValidator, createMenuItem);
router.put('/:id', protect, authorize('admin', 'manager'), updateMenuItem);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteMenuItem);

module.exports = router;
