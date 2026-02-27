const Order = require('../models/Order');
const Cart = require('../models/Cart');

const createOrder = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, please log in' });
        }
        const { deliveryAddress, paymentMethod } = req.body;
        const cart = await Cart.findOne({ userId: req.user._id }).populate('items.foodId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'No items in cart' });
        }

        const orderItems = cart.items.map(item => ({
            foodId: item.foodId._id,
            name: item.foodId.name,
            price: item.foodId.price,
            quantity: item.quantity
        }));

        const order = new Order({
            userId: req.user._id,
            items: orderItems,
            totalAmount: cart.totalAmount,
            deliveryAddress,
            paymentMethod,
        });

        const createdOrder = await order.save();

        // Empty cart
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, please log in' });
        }
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, getUserOrders, getAllOrders, updateOrderStatus };
