import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', image: '', description: '', address: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const { data } = await api.get('/restaurants/my');
            setRestaurants(data);
        } catch (error) {
            toast.error('Failed to load restaurants');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await api.put(`/restaurants/${editingId}`, formData);
                toast.success('Restaurant updated');
            } else {
                await api.post('/restaurants', formData);
                toast.success('Restaurant added');
            }
            setIsModalOpen(false);
            setFormData({ name: '', image: '', description: '', address: '' });
            setEditingId(null);
            fetchRestaurants();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving restaurant');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this restaurant?')) {
            try {
                await api.delete(`/restaurants/${id}`);
                toast.success('Restaurant deleted');
                fetchRestaurants();
            } catch (error) {
                toast.error('Error deleting restaurant');
            }
        }
    };

    const openEditModal = (rest) => {
        setEditingId(rest._id);
        setFormData({ name: rest.name, image: rest.image, description: rest.description, address: rest.address });
        setIsModalOpen(true);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h1 className="text-3xl font-extrabold text-gray-900">Manage Restaurants</h1>
                <button
                    onClick={() => { setEditingId(null); setFormData({ name: '', image: '', description: '', address: '' }); setIsModalOpen(true); }}
                    className="bg-primary hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-md"
                >
                    <Plus size={20} /> Add New
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-bold text-gray-600">Image</th>
                            <th className="p-4 font-bold text-gray-600">Name</th>
                            <th className="p-4 font-bold text-gray-600">Address</th>
                            <th className="p-4 font-bold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurants.map(rest => (
                            <tr key={rest._id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4">
                                    <img src={rest.image} alt={rest.name} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                                </td>
                                <td className="p-4 font-bold text-gray-900">{rest.name}</td>
                                <td className="p-4 text-gray-500 font-medium">{rest.address}</td>
                                <td className="p-4">
                                    <div className="flex gap-3">
                                        <Link to={`/admin/restaurants/${rest._id}/foods`} className="text-blue-600 hover:text-blue-800 font-bold bg-blue-50 px-3 py-1.5 rounded-lg transition">Menu</Link>
                                        <button onClick={() => openEditModal(rest)} className="text-yellow-600 hover:text-yellow-800 p-1.5 rounded-lg hover:bg-yellow-50 transition"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDelete(rest._id)} className="text-orange-600 hover:text-orange-800 p-1.5 rounded-lg hover:bg-orange-50 transition"><Trash2 size={18} /></button>
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingId ? 'Edit Restaurant' : 'Add Restaurant'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
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
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
                                <input required type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />
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

export default ManageRestaurants;
