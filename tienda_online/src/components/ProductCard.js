// src/components/ProductCard.js
import React, { useState } from 'react';
import axios from 'axios';

const ProductCard = ({ product }) => {
    const [isBuying, setIsBuying] = useState(false);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const handleBuy = async () => {
        setIsBuying(true);
        try {
            await axios.post(`${backendUrl}/api/orders`, {
                productId: product.ProductoID,
                quantity: 1 // o cualquier lógica de cantidad que tengas
            });
            alert('Purchase successful!');
        } catch (error) {
            console.error('There was an error making the purchase!', error);
            alert('Purchase failed!');
        } finally {
            setIsBuying(false);
        }
    };

    return (
        <div>
            <img src={product.Imagen} alt={product.Nombre} />
            <h3>{product.Nombre}</h3>
            <p>{product.Descripcion}</p>
            <p>${product.Precio}</p>
            <p>Stock: {product.Stock}</p>
            <button onClick={handleBuy} disabled={isBuying}>
                {isBuying ? 'Buying...' : 'Buy'}
            </button>
        </div>
    );
};

export default ProductCard;
