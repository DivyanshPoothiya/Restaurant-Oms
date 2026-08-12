const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/roleCheck');

router.use(protect);
router.use(authorize('admin', 'manager'));

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
