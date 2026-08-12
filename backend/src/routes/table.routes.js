const express = require('express');
const router = express.Router();
const {
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
} = require('../controllers/tableController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roleCheck');
const { tableValidator } = require('../utils/validators');

router.use(protect);

router.get('/', getAllTables);
router.get('/:id', getTableById);
router.post('/', authorize('admin', 'manager'), tableValidator, createTable);
router.put('/:id', authorize('admin', 'manager', 'waiter'), updateTable);
router.delete('/:id', authorize('admin', 'manager'), deleteTable);

module.exports = router;
