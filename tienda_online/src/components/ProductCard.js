import React from 'react';

const ProductCard = ({ product }) => {
    return (
        <div>
            <img src={product.Imagen} alt={product.Nombre} />
            <h3>{product.Nombre}</h3>
            <p>{product.Descripcion}</p>
            <p>${product.Precio}</p>
            <p>Stock: {product.Stock}</p>
            <button>Buy</button>
        </div>
    );
};

export default ProductCard;
