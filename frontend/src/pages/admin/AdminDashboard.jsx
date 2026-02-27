import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { Store, ListOrdered, Package, CheckCircle } from "lucide-react";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        restaurants: 0,
        orders: 0,
        pending: 0,
        delivered: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [resData, orderData] = await Promise.all([
                    api.get("/restaurants"),
                    api.get("/orders"),
                ]);
                const orders = orderData.data;
                const restaurantsList = resData.data;

                setStats({
                    restaurants: restaurantsList.length,
                    orders: orders.length,
                    pending: orders.filter((o) => o.status === "Pending").length,
                    delivered: orders.filter((o) => o.status === "Delivered").length,
                });
                setRecentOrders(orders.slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: "Restaurants", value: stats.restaurants, icon: <Store size={28} />, color: "bg-blue-500", shadow: "shadow-blue-500/30" },
        { label: "Total Orders", value: stats.orders, icon: <ListOrdered size={28} />, color: "bg-primary", shadow: "shadow-orange-500/30" },
        { label: "Pending", value: stats.pending, icon: <Package size={28} />, color: "bg-amber-500", shadow: "shadow-amber-500/30" },
        { label: "Delivered", value: stats.delivered, icon: <CheckCircle size={28} />, color: "bg-emerald-500", shadow: "shadow-emerald-500/30" },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1 font-medium">Overview of your platform's activity</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center space-x-5 hover:shadow-md transition-shadow group">
                        <div className={`${stat.color} text-white p-4 rounded-xl shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform duration-300`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="p-8 text-center bg-white">
                        <p className="text-gray-500 font-medium">No orders yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-xs border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-4">Order ID</th>
                                    <th className="px-8 py-4">Customer</th>
                                    <th className="px-8 py-4">Total Amount</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4 rounded-tr-3xl">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5 font-mono text-xs text-gray-600 font-medium">
                                            #{order._id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="px-8 py-5 font-bold text-gray-900">
                                            {order.userId?.name || "Guest"}
                                        </td>
                                        <td className="px-8 py-5 font-black text-gray-900">
                                            ₹{order.totalAmount}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span
                                                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                                                    order.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-blue-100 text-blue-800'
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-gray-500 font-medium whitespace-nowrap">
                                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
