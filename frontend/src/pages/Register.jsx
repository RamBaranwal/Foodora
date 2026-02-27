import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, ShieldPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
    // Mode state: 'customer' or 'admin'
    const [mode, setMode] = useState('customer');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [adminSecret, setAdminSecret] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === 'customer') {
                await register(name, email, password, 'user');
                toast.success('Registration successful!');
                navigate('/');
            } else {
                await register(name, email, password, 'admin', adminSecret);
                toast.success('Admin Registration successful!');
                navigate('/admin/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="w-full max-w-md mx-auto px-4 relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
                    <p className="mt-3 text-lg text-gray-600">Join Foodora today</p>
                </div>

                <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-2xl border border-gray-100 relative">
                    {/* Toggle Buttons */}
                    <div className="flex p-1 bg-gray-100 rounded-2xl mb-8 relative">
                        <button
                            onClick={() => { setMode('customer'); setName(''); setEmail(''); setPassword(''); setAdminSecret(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all duration-300 relative z-10 ${mode === 'customer' ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <UserPlus size={18} />
                            Customer
                        </button>
                        <button
                            onClick={() => { setMode('admin'); setName(''); setEmail(''); setPassword(''); setAdminSecret(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all duration-300 relative z-10 ${mode === 'admin' ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <ShieldPlus size={18} />
                            Admin
                        </button>

                        {/* Animated Slider Background */}
                        <div
                            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl transition-all duration-300 shadow-sm ${mode === 'customer' ? 'left-1 bg-orange-600' : 'left-[calc(50%+2px)] bg-gray-900'
                                }`}
                        ></div>
                    </div>

                    <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                {mode === 'admin' ? 'Business Name' : 'Full Name'}
                            </label>
                            <input
                                type="text" required
                                value={name} onChange={(e) => setName(e.target.value)}
                                className={`w-full px-5 py-4 border rounded-2xl focus:outline-none focus:ring-2 transition ${mode === 'admin'
                                    ? 'bg-gray-50 border-gray-200 focus:ring-gray-900 focus:bg-white'
                                    : 'bg-gray-50 border-gray-200 focus:ring-orange-500 focus:bg-white'
                                    }`}
                                placeholder={mode === 'admin' ? 'Restaurant Name' : 'John Doe'}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                {mode === 'admin' ? 'Admin Email' : 'Email address'}
                            </label>
                            <input
                                type="email" required
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-5 py-4 border rounded-2xl focus:outline-none focus:ring-2 transition ${mode === 'admin'
                                    ? 'bg-gray-50 border-gray-200 focus:ring-gray-900 focus:bg-white'
                                    : 'bg-gray-50 border-gray-200 focus:ring-orange-500 focus:bg-white'
                                    }`}
                                placeholder={mode === 'admin' ? 'admin@foodora.com' : 'Enter your email'}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                            <input
                                type="password" required
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-5 py-4 border rounded-2xl focus:outline-none focus:ring-2 transition ${mode === 'admin'
                                    ? 'bg-gray-50 border-gray-200 focus:ring-gray-900 focus:bg-white'
                                    : 'bg-gray-50 border-gray-200 focus:ring-orange-500 focus:bg-white'
                                    }`}
                                placeholder="••••••••"
                            />
                        </div>
                        {mode === 'admin' && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Admin Secret Key</label>
                                <input
                                    type="password" required
                                    value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)}
                                    className="w-full px-5 py-4 border bg-gray-50 border-gray-200 focus:bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                                    placeholder="Enter backend secret key"
                                />
                            </div>
                        )}
                        <button
                            type="submit" disabled={loading}
                            className={`w-full py-4 text-lg font-bold text-white rounded-2xl focus:ring-4 transition shadow-lg disabled:opacity-50 ${mode === 'admin'
                                ? 'bg-gray-900 hover:bg-black focus:ring-gray-500/30 shadow-gray-900/30'
                                : 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-200 shadow-orange-500/30'
                                }`}
                        >
                            {loading ? 'Processing...' : `Sign Up as ${mode === 'admin' ? 'Admin' : 'Customer'}`}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-600 font-medium text-sm">
                        Already have an account? <Link to="/login" className={`font-bold transition ${mode === 'admin' ? 'text-gray-900 hover:text-gray-700' : 'text-orange-600 hover:text-orange-800'}`}>Sign in instead</Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Register;
