import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Cart = () => {
    const { cart, removeFromCart, addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-slide-in">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Go ahead and explore top restaurants!</p>
                <Link to="/" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition shadow-md shadow-orange-200">
                    Browse Restaurants
                </Link>
            </div>
        );
    }

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-in">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-4">
                    {cart.items.map((item) => (
                        <div key={item._id || item.foodId._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src={item.foodId.image} alt={item.foodId.name} className="w-20 h-20 rounded-xl object-cover" />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{item.foodId.name}</h3>
                                    <p className="text-gray-500 font-medium">₹{item.foodId.price}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center justify-center bg-gray-50 border rounded-lg overflow-hidden">
                                    <button onClick={() => item.quantity > 1 ? addToCart(item.foodId._id, item.quantity - 1) : removeFromCart(item.foodId._id)} className="p-2 hover:bg-gray-200 transition text-gray-600"><Minus size={16} /></button>
                                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                                    <button onClick={() => addToCart(item.foodId._id, item.quantity + 1)} className="p-2 hover:bg-gray-200 transition text-gray-600"><Plus size={16} /></button>
                                </div>
                                <div className="text-lg font-bold w-20 text-right">₹{item.foodId.price * item.quantity}</div>
                                <button onClick={() => removeFromCart(item.foodId._id)} className="text-orange-500 hover:text-orange-700 transition p-2 bg-orange-50 rounded-lg">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full lg:w-96 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Bill Details</h2>
                    <div className="space-y-4 mb-6 text-gray-600">
                        <div className="flex justify-between font-medium">
                            <span>Item Total</span>
                            <span>₹{cart.totalAmount}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                            <span>Delivery Fee</span>
                            <span>₹49</span>
                        </div>
                        <div className="flex justify-between font-medium">
                            <span>Platform Fee</span>
                            <span>₹5</span>
                        </div>
                        <div className="border-t pt-4 flex justify-between font-extrabold text-xl text-gray-900">
                            <span>To Pay</span>
                            <span>₹{cart.totalAmount + 54}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleCheckout}
                        className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 transition shadow-lg shadow-orange-200"
                    >
                        Proceed to Checkout <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
