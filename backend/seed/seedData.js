const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');
const connectDB = require('../config/db');
const bcrypt = require('bcryptjs');

dotenv.config();

connectDB();

const restaurants = [
    {
        name: "Jaipur Spice",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Authentic Rajasthani cuisine.",
        address: "C-Scheme, Jaipur",
        rating: 4.8
    },
    {
        name: "The Royal Thali",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Famous for traditional Laal Maas.",
        address: "Bapu Nagar, Jaipur",
        rating: 4.6
    },
    {
        name: "South Indian Delights",
        image: "https://images.unsplash.com/photo-1610192244261-3f33de4155e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Best Dosa and Idli in town.",
        address: "Malviya Nagar, Jaipur",
        rating: 4.5
    },
    {
        name: "Spice Symphony",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "North Indian specialties.",
        address: "Raja Park, Jaipur",
        rating: 4.3
    }
];

const foodItemsTemplate = [
    { name: "Dal Baati Churma", price: 250, category: "Indian", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { name: "Laal Maas", price: 450, category: "Indian", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { name: "Pyaaz Kachori", price: 99, category: "Snacks", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { name: "Masala Dosa", price: 150, category: "South Indian", image: "https://images.unsplash.com/photo-1610192244261-3f33de4155e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { name: "Paneer Butter Masala", price: 300, category: "Indian", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { name: "Garlic Naan", price: 50, category: "Indian", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { name: "Gulab Jamun", price: 120, category: "Desserts", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
    { name: "Veg Hakka Noodles", price: 180, category: "Chinese", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
];

const importData = async () => {
    try {
        await Restaurant.deleteMany();
        await FoodItem.deleteMany();
        await User.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const adminHash = await bcrypt.hash('123123', salt);
        const customerHash = await bcrypt.hash('customer123', salt);

        // create users first so we can assign ownership
        const createdUsers = await User.insertMany([
            {
                name: "Admin User",
                email: "shyam@gmail.com",
                password: adminHash,
                role: "admin"
            },
            {
                name: "Customer User",
                email: "customer@foodora.com",
                password: customerHash,
                role: "customer"
            }
        ]);

        const adminUser = createdUsers.find(u => u.role === 'admin');

        // attach owner to restaurants
        const restaurantsWithOwner = restaurants.map(r => ({ ...r, owner: adminUser._id }));
        const createdRestaurants = await Restaurant.insertMany(restaurantsWithOwner);

        for (let i = 0; i < createdRestaurants.length; i++) {
            const rest = createdRestaurants[i];
            const items = foodItemsTemplate.map(item => ({
                ...item,
                restaurantId: rest._id,
            }));
            await FoodItem.insertMany(items);
        }

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
