const Cart = require('../models/Cart');
const FoodItem = require('../models/FoodItem');

const getCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, please log in' });
        }
        let cart = await Cart.findOne({ userId: req.user._id }).populate('items.foodId');
        if (!cart) {
            cart = await Cart.create({ userId: req.user._id, items: [], totalAmount: 0 });
        }

        // Calculate total amount
        cart.totalAmount = cart.items.reduce((acc, item) => {
            return acc + (item.foodId ? item.foodId.price * item.quantity : 0);
        }, 0);
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addToCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, please log in' });
        }
        const { foodId, quantity } = req.body;
        const food = await FoodItem.findById(foodId);

        if (!food) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            cart = await Cart.create({ userId: req.user._id, items: [], totalAmount: 0 });
        }

        const itemIndex = cart.items.findIndex(p => p.foodId.toString() === foodId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
        } else {
            cart.items.push({ foodId, quantity });
        }

        await cart.save();
        cart = await Cart.findOne({ userId: req.user._id }).populate('items.foodId');

        // update total
        cart.totalAmount = cart.items.reduce((acc, item) => {
            return acc + (item.foodId.price * item.quantity);
        }, 0);
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, please log in' });
        }
        const { foodId } = req.params;
        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.foodId.toString() !== foodId);
        await cart.save();

        cart = await Cart.findOne({ userId: req.user._id }).populate('items.foodId');
        cart.totalAmount = cart.items.reduce((acc, item) => {
            return acc + (item.foodId.price * item.quantity);
        }, 0);
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCart, addToCart, removeFromCart };
