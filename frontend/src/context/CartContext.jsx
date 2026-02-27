import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState({ items: [], totalAmount: 0 });

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart({ items: [], totalAmount: 0 });
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            const { data } = await api.get('/cart');
            setCart(data);
        } catch (error) {
            console.error(error);
        }
    };

    const addToCart = async (foodId, quantity = 1) => {
        try {
            const { data } = await api.post('/cart/add', { foodId, quantity });
            setCart(data);
        } catch (error) {
            console.error(error);
        }
    };

    const removeFromCart = async (foodId) => {
        try {
            const { data } = await api.delete(`/cart/remove/${foodId}`);
            setCart(data);
        } catch (error) {
            console.error(error);
        }
    };

    const clearCart = () => {
        setCart({ items: [], totalAmount: 0 });
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, fetchCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
