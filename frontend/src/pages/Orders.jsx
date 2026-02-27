import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Package, Truck, CheckCircle2, Clock, XCircle } from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/user');
                setOrders(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <LoadingSpinner />;

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock className="text-yellow-500 w-8 h-8" />;
            case 'Preparing': return <Package className="text-orange-500 w-8 h-8 animate-pulse" />;
            case 'Out for Delivery': return <Truck className="text-blue-500 w-8 h-8 animate-bounce" />;
            case 'Delivered': return <CheckCircle2 className="text-green-500 w-8 h-8" />;
            case 'Cancelled': return <XCircle className="text-orange-500 w-8 h-8" />;
            default: return <Clock className="text-gray-500 w-8 h-8" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'Preparing': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'Out for Delivery': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Delivered': return 'bg-green-50 text-green-700 border-green-200';
            case 'Cancelled': return 'bg-orange-50 text-orange-700 border-orange-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-in">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Your Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500 font-medium">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full border border-gray-100 shadow-inner">
                                {getStatusIcon(order.status)}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Order #{order._id.substring(order._id.length - 6)}</span>
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 font-medium">Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    {order.items.map((item, index) => (
                                        <span key={index} className="text-sm bg-gray-100 px-3 py-1 rounded-lg text-gray-700 font-medium">
                                            {item.quantity}x {item.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-shrink-0 text-center md:text-right mt-4 md:mt-0">
                                <p className="text-gray-500 text-sm font-medium mb-1">Total Amount</p>
                                <div className="text-2xl font-extrabold text-gray-900">₹{order.totalAmount}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
