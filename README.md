# Foodora - MERN Stack Food Delivery App (Zomato/Swiggy Clone)

## Overview
Foodora is a complete, production-ready food delivery application built using the MERN stack (MongoDB, Express.js, React 18 with Vite, Node.js). It features two distinct panels: an Admin Panel for managing restaurants, foods, and orders, and a Customer App for browsing, cart management, and order tracking.

## Features
- **Authentication**: JWT-based authentication with role-based access control (Admin & User).
- **Admin Panel**: Full CRUD operations for managing restaurants, food items, and order statuses.
- **Customer App**: Browse restaurants, view menus, manage cart, track orders dynamically.
- **Cart Management**: Add/remove items with real-time total updates.
- **Responsive Design**: Tailwind CSS ensures a seamless experience across all devices.
- **Image Handling**: Integrated with Cloudinary for robust image uploads.

## Tech Stack
- **Frontend**: React 18, Vite, React Router v6, Context API, Tailwind CSS, Lucide React, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, Multer, Cloudinary.

## Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)
- Cloudinary Account (for image uploads)

## Setup Instructions

### Environment Setup
Create a `.env` file in the `backend` folder and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
```

### Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Seed the database with sample data (optional but recommended):
   ```bash
   npm run seed
   ```
   *Note: This creates an admin user with email `admin@foodora.com` and password `admin`.*
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The API will run on http://localhost:5000*

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The React app will run on http://localhost:5173*

## Usage
- **User Side**: Navigate to `http://localhost:5173`, browse restaurants, create an account, add foods to cart, and place an order.
- **Admin Side**: Navigate to `http://localhost:5173/admin/login`, log in using `admin@foodora.com / admin`, and manage the application.
