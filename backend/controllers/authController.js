const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (res, userId, role) => {
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, adminSecret } = req.body;

        if (role === 'admin') {
            const secret = process.env.ADMIN_SECRET;
            if (!secret) {
                return res.status(500).json({ message: 'Server configuration error: ADMIN_SECRET is not set.' });
            }
            if (!adminSecret || adminSecret.trim() !== secret.trim()) {
                return res.status(401).json({ message: 'Invalid Admin Secret Key' });
            }
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password, role });

        if (user) {
            generateToken(res, user._id, user.role);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id, user.role);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, logoutUser, getUserProfile };
