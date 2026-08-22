const { body, validationResult } = require('express-validator');

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Auth validators
const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'waiter', 'kitchen'])
    .withMessage('Invalid role'),
  validate,
];

const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// Menu item validators
const menuItemValidator = [
  body('name').trim().notEmpty().withMessage('Item name is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  validate,
];

// Order validators
const orderValidator = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.menuItem')
    .notEmpty()
    .withMessage('Each item must have a menuItem ID'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  validate,
];

// Table validators
const tableValidator = [
  body('tableNumber')
    .isInt({ min: 1 })
    .withMessage('Table number must be a positive integer'),
  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Capacity must be at least 1'),
  validate,
];

module.exports = {
  registerValidator,
  loginValidator,
  menuItemValidator,
  orderValidator,
  tableValidator,
  validate,
};
