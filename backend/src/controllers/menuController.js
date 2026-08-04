const MenuItem = require('../models/MenuItem');
const { sendSuccess, sendError } = require('../utils/helpers');

// GET /api/menu
const getAllMenuItems = async (req, res, next) => {
  try {
    const { category, available } = req.query;
    const filter = {};

    if (category) filter.category = category;
    // Only apply filter when explicitly passed as query param
    if (available === 'true')  filter.isAvailable = true;
    if (available === 'false') filter.isAvailable = false;

    const items = await MenuItem.find(filter)
      .populate('category', 'name description')
      .sort({ createdAt: -1 });

    sendSuccess(res, 200, 'Menu items fetched.', { count: items.length, items });
  } catch (error) {
    next(error);
  }
};

// GET /api/menu/:id
const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('category', 'name');
    if (!item) return sendError(res, 404, 'Menu item not found.');
    sendSuccess(res, 200, 'Menu item fetched.', { item });
  } catch (error) {
    next(error);
  }
};

// POST /api/menu
const createMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.create(req.body);
    sendSuccess(res, 201, 'Menu item created.', { item });
  } catch (error) {
    next(error);
  }
};

// PUT /api/menu/:id
const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return sendError(res, 404, 'Menu item not found.');
    sendSuccess(res, 200, 'Menu item updated.', { item });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/menu/:id
const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 404, 'Menu item not found.');
    sendSuccess(res, 200, 'Menu item deleted.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
