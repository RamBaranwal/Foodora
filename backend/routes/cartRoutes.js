const express = require('express');
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getCart);

router.route('/add')
    .post(protect, addToCart);

router.route('/remove/:foodId')
    .delete(protect, removeFromCart);

module.exports = router;
