const FoodItem = require('../models/FoodItem');
const Restaurant = require('../models/Restaurant');

const getUniqueFoods = async (req, res) => {
    try {
        const uniqueFoods = await FoodItem.aggregate([
            {
                $group: {
                    _id: { $toLower: "$name" }, // group by case-insensitive name
                    name: { $first: "$name" },
                    image: { $first: "$image" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        res.json(uniqueFoods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFoodsByName = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) return res.status(400).json({ message: "Food name required" });

        const foods = await FoodItem.find({ name: { $regex: new RegExp('^' + name + '$', 'i') } })
            .populate('restaurantId', 'name image rating deliveryTime');
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFoodsByRestaurant = async (req, res) => {
    try {
        const foods = await FoodItem.find({ restaurantId: req.params.restaurantId });
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createFood = async (req, res) => {
    try {
        const { name, price, category, isAvailable, image } = req.body;

        // ensure the authenticated admin owns the restaurant
        const restaurant = await Restaurant.findById(req.params.restaurantId);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        if (!req.user || restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to add food to this restaurant' });
        }

        const food = new FoodItem({
            restaurantId: req.params.restaurantId,
            name,
            image,
            price,
            category,
            isAvailable
        });

        const createdFood = await food.save();
        res.status(201).json(createdFood);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateFood = async (req, res) => {
    try {
        const { name, price, category, isAvailable, image } = req.body;
        const food = await FoodItem.findById(req.params.id);
        if (!food) return res.status(404).json({ message: 'Food not found' });

        const restaurant = await Restaurant.findById(food.restaurantId);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        if (!req.user || restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this food' });
        }

        food.name = name || food.name;
        food.price = price || food.price;
        food.category = category || food.category;
        food.isAvailable = isAvailable !== undefined ? isAvailable : food.isAvailable;

        if (image) {
            food.image = image;
        }

        const updatedFood = await food.save();
        res.json(updatedFood);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteFood = async (req, res) => {
    try {
        const food = await FoodItem.findById(req.params.id);
        if (!food) return res.status(404).json({ message: 'Food not found' });

        const restaurant = await Restaurant.findById(food.restaurantId);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        if (!req.user || restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this food' });
        }

        await food.deleteOne();
        res.json({ message: 'Food removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUniqueFoods, getFoodsByName, getFoodsByRestaurant, createFood, updateFood, deleteFood };
