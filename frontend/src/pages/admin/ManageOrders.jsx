import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/orders/${id}/status`, { status: newStatus });
            toast.success('Order status updated');
            fetchOrders();
        } catch (error) {
            toast.error('Error updating status');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">Manage Orders</h1>

            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-6 items-center">
                        <div className="flex-1 w-full lg:w-auto">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Order ID: {order._id}</h3>
                                    <p className="text-sm font-semibold text-gray-500 mt-1">
                                        Placed: {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="bg-gray-50 px-4 py-2 rounded-xl text-center sm:text-right border">
                                    <p className="text-sm font-bold text-gray-500 uppercase">Total Amount</p>
                                    <p className="text-2xl font-extrabold text-primary">₹{order.totalAmount}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2 uppercase text-sm tracking-wide">Customer Details</h4>
                                    <p className="font-medium text-gray-700">{order.userId?.name || 'N/A'}</p>
                                    <p className="text-gray-500 text-sm">{order.userId?.email || 'N/A'}</p>
                                    <div className="mt-3 bg-blue-50 text-blue-800 p-3 rounded-xl border border-blue-100 flex">
                                        <span className="font-semibold text-sm mr-2 w-16">Delivery:</span>
                                        <span className="text-sm font-medium">{order.deliveryAddress}</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2 uppercase text-sm tracking-wide">Order Items</h4>
                                    <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black bg-gray-200 w-6 h-6 flex items-center justify-center rounded text-gray-600">{item.quantity}</span>
                                                    <span className="font-bold text-gray-700">{item.name}</span>
                                                </div>
                                                <span className="font-bold text-gray-500">₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0 w-full lg:w-64 bg-gray-50 p-5 rounded-2xl border flex flex-col justify-center">
                            <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-3 text-center">Update Status</label>
                            <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                className={`w-full p-4 border rounded-xl shadow-sm focus:outline-none focus:ring-2 font-bold cursor-pointer text-center appearance-none ${order.status === 'Delivered' ? 'bg-green-100 text-green-800 border-green-300' :
                                        order.status === 'Cancelled' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                                            'bg-white text-gray-800 focus:ring-primary'
                                    }`}
                            >
                                <option value="Pending">🕒 Pending</option>
                                <option value="Preparing">🍳 Preparing</option>
                                <option value="Out for Delivery">🚚 Out for Delivery</option>
                                <option value="Delivered">✅ Delivered</option>
                                <option value="Cancelled">❌ Cancelled</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageOrders;
