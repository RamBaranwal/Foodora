const express = require('express');
const { getRestaurants, getRestaurantById, createRestaurant, updateRestaurant, deleteRestaurant, getMyRestaurants } = require('../controllers/restaurantController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getRestaurants)
    .post(protect, admin, createRestaurant);

router.get('/my', protect, admin, getMyRestaurants);

router.route('/:id')
    .get(getRestaurantById)
    .put(protect, admin, updateRestaurant)
    .delete(protect, admin, deleteRestaurant);

module.exports = router;
