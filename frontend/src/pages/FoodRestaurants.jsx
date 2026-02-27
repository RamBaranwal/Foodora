import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const FoodRestaurants = () => {
    const { name } = useParams();
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const { data } = await api.get(`/foods/search?name=${name}`);
                setFoods(data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch restaurants for this food');
            } finally {
                setLoading(false);
            }
        };
        fetchFoods();
    }, [name]);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Restaurants serving {name}</h1>
            </div>

            {foods.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-xl text-gray-500">No restaurants found serving {name}.</p>
                    <Link to="/" className="text-orange-500 hover:underline mt-4 inline-block">Go back to home</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {foods.map(food => (
                        <div key={food._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
                            {/* We use the food image or restaurant image, food is better */}
                            <div className="relative h-48">
                                <img
                                    src={food.image || (food.restaurantId && food.restaurantId.image)}
                                    alt={food.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                                    <span className="text-sm font-semibold flex items-center text-gray-800">
                                        ⭐ {food.restaurantId?.rating || 'New'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 flex-grow flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 truncate pr-2">
                                        {food.restaurantId?.name || 'Unknown Restaurant'}
                                    </h3>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                    <span className="flex items-center">
                                        ⏱️ {food.restaurantId?.deliveryTime || '30-40'} min
                                    </span>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-900">₹{food.price}</span>
                                    {food.isAvailable ? (
                                        <button
                                            onClick={() => {
                                                addToCart(food._id, 1);
                                                toast.success('Added to cart!');
                                            }}
                                            className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-500 hover:text-white transition-colors duration-200 font-medium"
                                        >
                                            Add +
                                        </button>
                                    ) : (
                                        <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed font-medium">
                                            Sold out
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FoodRestaurants;
