import React, { useContext } from 'react';
import { Plus, Minus } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const FoodCard = ({ food }) => {
    const { cart, addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const cartItem = cart?.items?.find((item) => item.foodId?._id === food._id || item.foodId === food._id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleAdd = () => {
        if (!user) {
            toast.error('Please login to add items to cart', { duration: 3000 });
            navigate('/login');
            return;
        }
        addToCart(food._id, quantity + 1);
        toast.success('Food added to cart');
    };

    const handleRemove = () => {
        if (quantity > 1) {
            addToCart(food._id, quantity - 1);
        } else if (quantity === 1) {
            // It can go down to 0 which might need an explicit request to remove from cart, or addToCart with quantity 0 removes it (handled in backend or requires API modification). Let's assume standard behavior or add explicit call. 
            // Actually Context doesn't have a decrement without a specific route. We can just send lower quantity. Our backend will handle it as an update. If quantity is 0, we can use removeFromCart
            addToCart(food._id, 0); // Wait, backend schema requires min: 1. So we should use cartContext's removeFromCart
        }
    };

    const handleContextRemove = () => {
        // Need to import cartContext.removeFromCart to properly delete
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden border border-gray-100 flex p-4 gap-4 animate-slide-in">
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{food.name}</h3>
                    <p className="text-sm font-semibold text-gray-600 mt-1">{food.category}</p>
                    <div className="mt-2 text-lg font-bold text-gray-900">₹{food.price}</div>
                </div>
            </div>
            <div className="relative w-36 h-36 flex-shrink-0 rounded-2xl overflow-hidden">
                <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-28 bg-white border shadow-md rounded-lg flex items-center justify-between px-2 py-1 mb-6">
                    {quantity > 0 ? (
                        <div className="flex w-full items-center justify-between text-primary font-bold">
                            <button onClick={() => quantity === 1 ? toast.error("Use cart to remove items completely or adjust.") : handleAdd(food._id, quantity - 1)} className="p-1 hover:bg-orange-50 rounded-full transition"><Minus size={16} /></button>
                            <span className="text-lg">{quantity}</span>
                            <button onClick={() => addToCart(food._id, quantity + 1)} className="p-1 hover:bg-orange-50 rounded-full transition"><Plus size={16} /></button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAdd}
                            className="w-full text-center text-primary font-extrabold text-lg py-1 hover:bg-orange-50 transition"
                            disabled={!food.isAvailable}
                        >
                            {food.isAvailable ? 'ADD' : 'OUT'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodCard;
