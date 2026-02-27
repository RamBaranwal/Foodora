import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantMenu from './pages/RestaurantMenu';
import FoodRestaurants from './pages/FoodRestaurants';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageRestaurants from './pages/admin/ManageRestaurants';
import ManageFoods from './pages/admin/ManageFoods';
import ManageOrders from './pages/admin/ManageOrders';

import AdminLayout from './components/AdminLayout';

function AppContent() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';
    const isAuthRoute = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/admin/login';

    return (
        <div className="flex flex-col min-h-screen">
            {!isAdminRoute && <Navbar />}
            <main className={isAdminRoute ? "flex-grow h-screen overflow-hidden" : "flex-grow"}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/restaurant/:id" element={<RestaurantMenu />} />
                    <Route path="/food/:name" element={<FoodRestaurants />} />

                    {/* User Protected Routes */}
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<ProtectedRoute roleRequired="admin"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/restaurants" element={<ProtectedRoute roleRequired="admin"><AdminLayout><ManageRestaurants /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/restaurants/:id/foods" element={<ProtectedRoute roleRequired="admin"><AdminLayout><ManageFoods /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/orders" element={<ProtectedRoute roleRequired="admin"><AdminLayout><ManageOrders /></AdminLayout></ProtectedRoute>} />
                </Routes>
            </main>
            {!isAdminRoute && !isAuthRoute && <Footer />}
        </div>
    );
}

function App() {
    return (
        <Router>
            <Toaster position="top-center" reverseOrder={false} />
            <AppContent />
        </Router>
    );
}

export default App;
