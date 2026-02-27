import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageFoods = () => {
    const { id: restaurantId } = useParams();
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', image: '', price: '', category: '', isAvailable: true });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchFoods();
    }, [restaurantId]);

    const fetchFoods = async () => {
        try {
            const { data } = await api.get(`/foods/${restaurantId}`);
            setFoods(data);
        } catch (error) {
            toast.error('Failed to load foods');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await api.put(`/foods/${editingId}`, formData);
                toast.success('Food updated');
            } else {
                await api.post(`/foods/${restaurantId}`, formData);
                toast.success('Food added');
            }
            setIsModalOpen(false);
            setFormData({ name: '', image: '', price: '', category: '', isAvailable: true });
            setEditingId(null);
            fetchFoods();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving food');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this food item?')) {
            try {
                await api.delete(`/foods/${id}`);
                toast.success('Food deleted');
                fetchFoods();
            } catch (error) {
                toast.error('Error deleting food');
            }
        }
    };

    const openEditModal = (food) => {
        setEditingId(food._id);
        setFormData({ name: food.name, image: food.image, price: food.price, category: food.category, isAvailable: food.isAvailable });
        setIsModalOpen(true);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div className="flex items-center gap-4">
                    <Link to="/admin/restaurants" className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"><ArrowLeft size={24} /></Link>
                    <h1 className="text-3xl font-extrabold text-gray-900">Manage Menu Items</h1>
                </div>
                <button
                    onClick={() => { setEditingId(null); setFormData({ name: '', image: '', price: '', category: '', isAvailable: true }); setIsModalOpen(true); }}
                    className="bg-primary hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-md"
                >
                    <Plus size={20} /> Add Item
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-bold text-gray-600">Image</th>
                            <th className="p-4 font-bold text-gray-600">Name</th>
                            <th className="p-4 font-bold text-gray-600">Price</th>
                            <th className="p-4 font-bold text-gray-600">Category</th>
                            <th className="p-4 font-bold text-gray-600">Available</th>
                            <th className="p-4 font-bold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foods.map(food => (
                            <tr key={food._id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4">
                                    <img src={food.image} alt={food.name} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                                </td>
                                <td className="p-4 font-bold text-gray-900">{food.name}</td>
                                <td className="p-4 font-extrabold text-primary">₹{food.price}</td>
                                <td className="p-4 text-gray-500 font-medium">{food.category}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${food.isAvailable ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                        {food.isAvailable ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-3">
                                        <button onClick={() => openEditModal(food)} className="text-yellow-600 hover:text-yellow-800 p-1.5 rounded-lg hover:bg-yellow-50 transition"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDelete(food._id)} className="text-orange-600 hover:text-orange-800 p-1.5 rounded-lg hover:bg-orange-50 transition"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative animate-slide-in">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingId ? 'Edit Food Item' : 'Add Food Item'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                                    <input required type="url" placeholder="https://example.com/image.jpg" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />
                                </div>
                                {formData.image && (
                                    <img src={formData.image} alt="preview" className="w-16 h-16 object-cover rounded-xl mt-6 border shadow-sm" />
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                                    <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                                    <input required type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mt-4">
                                <input type="checkbox" checked={formData.isAvailable} onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })} className="w-5 h-5 text-primary rounded focus:ring-primary" id="isAvail" />
                                <label htmlFor="isAvail" className="font-bold text-gray-700 cursor-pointer">Available for order</label>
                            </div>
                            <div className="flex gap-4 mt-8 pt-4 border-t">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition">Cancel</button>
                                <button type="submit" className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition shadow-lg">{editingId ? 'Update' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageFoods;
