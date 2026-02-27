const express = require('express');
const { getUniqueFoods, getFoodsByName, getFoodsByRestaurant, createFood, updateFood, deleteFood } = require('../controllers/foodController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/unique/all', getUniqueFoods);
router.get('/search', getFoodsByName);

router.route('/:restaurantId')
    .get(getFoodsByRestaurant)
    .post(protect, admin, createFood);

router.route('/:id')
    .put(protect, admin, updateFood)
    .delete(protect, admin, deleteFood);

module.exports = router;
