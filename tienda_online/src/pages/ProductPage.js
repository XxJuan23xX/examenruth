import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { CartContext } from '../components/CartContext';
import './ProductPage.css';

import GatoImage from '../components/Gato2.png'; // Importa la imagen

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showModal, setShowModal] = useState(false); // Estado para el modal
    const [filter, setFilter] = useState('Todos'); // Estado para el filtro
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
                console.log('Products:', response.data);
                setProducts(response.data);
                setFilteredProducts(response.data); // Inicialmente mostrar todos los productos
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (filter === 'Gatitos') {
            setFilteredProducts(products.filter(product => product.Nombre.toLowerCase().includes('whiskas')));
        } else if (filter === 'Perritos') {
            setFilteredProducts(products.filter(product => product.Nombre.toLowerCase().includes('pedigree')));
        } else {
            setFilteredProducts(products);
        }
    }, [filter, products]);

    const handleAddToCart = (product) => {
        addToCart(product);
        setShowModal(true);
        setTimeout(() => {
            setShowModal(false);
        }, 3000); // Oculta el modal después de 3 segundos
    };

    return (
        <div>
            <Navbar />
            <div className="product-page">
                <div className="banner">
                    <div className="banner-content">
                        <div className="banner-text">
                            <h1>Nuevo producto que está a tu disposición</h1>
                            <p>Tu lo sabes, tu gato lo quiere.</p>
                            <p>¿Qué esperas?</p>
                            
                        </div>
                        <div className="banner-image">
                            <img src={GatoImage} alt="Producto destacado" />
                        </div>
                    </div>
                </div>
                <div className="filters">
                    <button onClick={() => setFilter('Todos')}>Todos</button>
                    <button onClick={() => setFilter('Gatitos')}>Gatitos</button>
                    <button onClick={() => setFilter('Perritos')}>Perritos</button>
                </div>
                <div className="productos-container">
                    <h2>Los mejores productos para tus animales!</h2>
                    {showModal && <div className="confirmation-modal">El producto se ha agregado correctamente al carrito</div>}
                    <div className="productos-grid">
                        {filteredProducts.map((product) => (
                            <div className="product-card1" key={product.ProductoID}>
                                <img src={product.Imagen} alt={product.Nombre} />
                                <div className="product-info">
                                    <div className="product-header">
                                        <h3>{product.Nombre}</h3>
                                        <p className="product-price">${product.Precio}</p>
                                    </div>
                                    <p className="product-description">{product.Descripcion}</p>
                                    <p className="product-stock">Existencias: {product.Stock}</p>
                                    <button className="add-to-cart" onClick={() => handleAddToCart(product)}>Agregar al carrito</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
