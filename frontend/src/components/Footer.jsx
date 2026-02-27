import React from 'react';
import { Twitter, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white mt-auto pt-10 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-4 tracking-tight">Foodora</h2>
                        <p className="text-gray-400 text-sm">
                            Your favorite food delivery partner, bringing the best local restaurants straight to your door.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Company</h3>
                        <ul className="text-gray-400 text-sm space-y-2">
                            <li><a href="#" className="hover:text-white transition">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition">Blog</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Legal</h3>
                        <ul className="text-gray-400 text-sm space-y-2">
                            <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
                            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Admin</h3>
                        <ul className="text-gray-400 text-sm space-y-2">
                            <li><a href="/admin/login" className="hover:text-white transition">Admin Portal</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Social Links</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition"><Facebook /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition"><Twitter /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition"><Instagram /></a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Foodora. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
