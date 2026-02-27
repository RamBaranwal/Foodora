import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import RestaurantCard from '../components/RestaurantCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
    const [foods, setFoods] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [foodsRes, restaurantsRes] = await Promise.all([
                    api.get('/foods/unique/all'),
                    api.get('/restaurants')
                ]);
                setFoods(foodsRes.data);
                setRestaurants(restaurantsRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Best foods in your locality</h1>
                <p className="text-lg text-gray-600">Discover top-rated local dining spots and get your favorite dishes delivered.</p>
            </div>

            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">What's on your mind?</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {foods.map(food => (
                        <Link
                            to={`/food/${encodeURIComponent(food.name)}`}
                            key={food._id}
                            className="flex flex-col items-center group cursor-pointer"
                        >
                            <div className="w-32 h-32 rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 border-2 border-transparent group-hover:border-orange-500">
                                <img
                                    src={food.image || '/placeholder-food.jpg'}
                                    alt={food.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition-colors text-center w-full truncate">
                                {food.name}
                            </h3>
                            <p className="text-sm text-gray-500">{food.count} options</p>
                        </Link>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-6">Top restaurants for you</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {restaurants.map(restaurant => (
                        <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
