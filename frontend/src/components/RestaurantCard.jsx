import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
    return (
        <Link to={`/restaurant/${restaurant._id}`} className="block group animate-slide-in">
            <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 border border-gray-100 pb-4">
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {!restaurant.isActive && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-bold text-xl uppercase tracking-widest">Closed</span>
                        </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg shadow-md flex items-center gap-1">
                        <span className="text-sm font-bold text-green-700">{restaurant.rating || 'New'}</span>
                        <Star className="text-green-700 w-4 h-4 fill-current" />
                    </div>
                </div>
                <div className="px-4 mt-4">
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{restaurant.name}</h3>
                    </div>
                    <p className="text-sm font-medium text-gray-500 mt-1 line-clamp-1">{restaurant.description}</p>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-3">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="line-clamp-1">{restaurant.address}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RestaurantCard;
