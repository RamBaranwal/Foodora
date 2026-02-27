import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    LayoutDashboard,
    Store,
    ListOrdered,
    LogOut,
    Menu,
    X
} from 'lucide-react';

const AdminLayout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const links = [
        { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { to: '/admin/restaurants', label: 'Restaurants', icon: <Store size={18} /> },
        { to: '/admin/orders', label: 'Orders', icon: <ListOrdered size={18} /> },
    ];

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 shadow-2xl text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 lg:static lg:block flex flex-col`}
            >
                <div className="flex items-center justify-between h-20 px-6 border-b border-gray-800 bg-gray-950">
                    <span className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                        <span className="text-primary text-3xl">.</span>Foodora
                    </span>
                    <button className="lg:hidden text-gray-400 hover:text-white transition" onClick={() => setSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto mt-6 px-4 space-y-2">
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 ${isActive(link.to)
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            {link.icon}
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-800 bg-gray-950">
                    <div className="flex items-center space-x-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-primary">
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center space-x-2 text-white bg-gray-800 hover:bg-red-600 px-4 py-3 w-full rounded-xl transition duration-200 font-bold"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top bar */}
                <header className="bg-white shadow-sm h-20 flex items-center px-6 lg:px-10 border-b border-gray-200 z-10">
                    <button className="lg:hidden mr-4 text-gray-600 hover:text-primary transition" onClick={() => setSidebarOpen(true)}>
                        <Menu size={26} />
                    </button>
                    <h1 className="text-xl font-extrabold text-gray-800">Admin Control Panel</h1>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-10 hide-scrollbar bg-gray-50">
                    {children}
                </main>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminLayout;
