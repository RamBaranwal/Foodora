const Restaurant = require('../models/Restaurant');

const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({});
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyRestaurants = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });
        const restaurants = await Restaurant.find({ owner: req.user._id });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (restaurant) {
            res.json(restaurant);
        } else {
            res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createRestaurant = async (req, res) => {
    try {
        const { name, description, address, isActive, rating, image } = req.body;

        const restaurant = new Restaurant({
            name,
            image,
            description,
            address,
            isActive,
            rating,
            owner: req.user._id
        });

        const createdRestaurant = await restaurant.save();
        res.status(201).json(createdRestaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateRestaurant = async (req, res) => {
    try {
        const { name, description, address, isActive, rating, image } = req.body;
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        // ensure admin owns this restaurant
        if (!req.user || restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this restaurant' });
        }

        restaurant.name = name || restaurant.name;
        restaurant.description = description || restaurant.description;
        restaurant.address = address || restaurant.address;
        restaurant.isActive = isActive !== undefined ? isActive : restaurant.isActive;
        restaurant.rating = rating || restaurant.rating;

        if (image) {
            restaurant.image = image;
        }

        const updatedRestaurant = await restaurant.save();
        res.json(updatedRestaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        if (!req.user || restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this restaurant' });
        }

        await restaurant.deleteOne();
        res.json({ message: 'Restaurant removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getRestaurants, getRestaurantById, createRestaurant, updateRestaurant, deleteRestaurant, getMyRestaurants };
