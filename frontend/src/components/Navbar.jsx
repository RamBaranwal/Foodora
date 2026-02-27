import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, LogOut, Menu } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const cartItemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-3xl font-extrabold text-primary tracking-tight">Foodora</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link to="/cart" className="relative group p-2">
                            <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-primary transition" />
                            {cartItemCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700 font-medium hidden sm:block">Hi, {user.name}</span>
                                {user.role === 'admin' && (
                                    <Link to="/admin/dashboard" className="text-sm font-medium text-gray-700 hover:text-primary transition">
                                        Admin Panel
                                    </Link>
                                )}
                                <button onClick={handleLogout} className="text-gray-500 hover:text-primary transition">
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link to="/login" className="text-gray-700 font-medium hover:text-primary transition mt-1">
                                    Log in
                                </Link>
                                <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
