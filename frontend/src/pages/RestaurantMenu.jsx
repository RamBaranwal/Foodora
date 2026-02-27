import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import FoodCard from '../components/FoodCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Star, MapPin } from 'lucide-react';

const RestaurantMenu = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resData = await api.get(`/restaurants/${id}`);
                setRestaurant(resData.data);

                const foodData = await api.get(`/foods/${id}`);
                setFoods(foodData.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (!restaurant) return <div className="text-center py-20 text-2xl font-bold">Restaurant not found</div>;

    const categories = [...new Set(foods.map(item => item.category))];

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-3xl p-6 shadow-sm mb-10 border border-gray-100 animate-slide-in">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <img src={restaurant.image} alt={restaurant.name} className="w-full md:w-64 h-64 object-cover rounded-2xl" />
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{restaurant.name}</h1>
                        <p className="text-lg text-gray-500 mt-2">{restaurant.description}</p>
                        <div className="mt-4 flex flex-wrap gap-4 items-center justify-center md:justify-start">
                            <span className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">
                                {restaurant.rating || 'New'} <Star className="w-4 h-4 fill-current" />
                            </span>
                            <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                                <MapPin className="w-4 h-4" /> {restaurant.address}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-3xl font-bold mb-8 tracking-tight">Menu</h2>
                {categories.map(category => (
                    <div key={category} className="mb-10">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">{category}</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {foods.filter(food => food.category === category).map(food => (
                                <FoodCard key={food._id} food={food} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RestaurantMenu;
