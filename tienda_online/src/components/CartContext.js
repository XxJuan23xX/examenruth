import React, { createContext, useState } from 'react';

const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    const addToCart = (product) => {
        setCart([...cart, { ...product, Cantidad: 1 }]);
        updateTotal([...cart, { ...product, Cantidad: 1 }]);
    };

    const removeFromCart = (index) => {
        const newCart = cart.filter((_, i) => i !== index);
        setCart(newCart);
        updateTotal(newCart);
    };

    const clearCart = () => {
        setCart([]);
        setTotal(0);
    };

    const updateQuantity = (index, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(index);
            return;
        }
        const newCart = cart.map((item, i) =>
            i === index ? { ...item, Cantidad: newQuantity } : item
        );
        setCart(newCart);
        updateTotal(newCart);
    };

    const updateTotal = (newCart) => {
        const newTotal = newCart.reduce((acc, item) => acc + item.Precio * item.Cantidad, 0);
        setTotal(newTotal);
    };

    return (
        <CartContext.Provider value={{ cart, total, addToCart, removeFromCart, clearCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export { CartProvider, CartContext };
