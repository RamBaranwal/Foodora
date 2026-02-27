import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { cart, fetchCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!cart || cart.items.length === 0) {
            navigate('/cart');
        }
    }, [cart, navigate]);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/orders', { deliveryAddress: address, paymentMethod });
            toast.success('Order placed successfully!');
            await fetchCart();
            navigate('/orders');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const totalPayable = (cart?.totalAmount || 0) + 54;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-in">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Checkout</h1>

            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
                <form onSubmit={handlePlaceOrder} className="space-y-8">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Address</h2>
                        <textarea
                            required
                            rows="3"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            placeholder="Enter your complete delivery address..."
                        ></textarea>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                        <div className="space-y-3">
                            <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={paymentMethod === 'COD'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-5 h-5 text-primary focus:ring-primary border-gray-300"
                                />
                                <span className="ml-3 font-semibold text-gray-800">Cash on Delivery (COD)</span>
                            </label>
                            <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Online"
                                    checked={paymentMethod === 'Online'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-5 h-5 text-primary focus:ring-primary border-gray-300"
                                />
                                <span className="ml-3 font-semibold text-gray-800">Pay Online (Mock)</span>
                            </label>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-600 font-medium">Total Amount to Pay</span>
                            <span className="text-2xl font-extrabold text-gray-900">₹{totalPayable}</span>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition disabled:opacity-50 shadow-lg shadow-orange-200"
                        >
                            {loading ? 'Processing...' : 'Place Order securely'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
