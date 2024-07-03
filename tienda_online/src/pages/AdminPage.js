import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ 
        name: '',
        price: '',
        stock: '',
        description: '',
        image: ''
    });
    const [showProductList, setShowProductList] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                setProducts(res.data);
            } catch (error) {
                console.error('Error fetching products', error);
            }
        };

        fetchProducts();
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/products', {
                Nombre: newProduct.name,
                Precio: newProduct.price,
                Stock: newProduct.stock,
                Descripcion: newProduct.description,
                Imagen: newProduct.image
            });
            setProducts([...products, res.data]);
            setNewProduct({ name: '', price: '', stock: '', description: '', image: '' });
            setShowProductList(true); // Show product list after adding a new product
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 2000);
        } catch (error) {
            console.error('Error adding product', error);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${productToDelete}`);
            setProducts(products.filter(product => product.ProductoID !== productToDelete));
            setShowDeleteModal(false);
            setProductToDelete(null);
        } catch (error) {
            console.error('Error deleting product', error);
        }
    };

    const confirmDeleteProduct = (productId) => {
        setProductToDelete(productId);
        setShowDeleteModal(true);
    };

    const closeModal = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
    };

    return (
        <div className="admin-page">
            <div className="sidebar">
                <div className="sidebar-header">
                <h2><Link to="/">PetStore</Link></h2>
                </div>
                <ul className="sidebar-menu">
                    <li><Link to="/products">Productos</Link></li>
                    <li><Link to="/admin">Admin Panel</Link></li>
                    <li><Link to="/admin/orders">Order Management</Link></li>
                    <li><Link to="/logout" className="logout-button">Cerrar Sesión</Link></li>
                </ul>
            </div>
            <div className="admin-content">
                <h2>Admin Panel</h2>
                {showProductList ? (
                    <div className="product-list-container">
                        <div className="product-list">
                            <h3>Lista de Productos</h3>
                            <ul>
                                {products.map((product) => (
                                    <li key={product.ProductoID}>
                                        <img src={product.Imagen} alt={product.Nombre} className="product-imagen" />
                                        <div className="product-info">
                                        <h4 className="admin-product-title">{product.Nombre}</h4>
                                            <p className="admin-product-price">Precio: ${product.Precio}</p>
                                            <p className="admin-product-stock">Stock: {product.Stock}</p>
                                            <p className="admin-product-description">Descripción: {product.Descripcion}</p>
                                        </div>
                                        <div className="product-actions">
                                            <button onClick={() => confirmDeleteProduct(product.ProductoID)}>Eliminar</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button className="create-product-button" onClick={() => setShowProductList(false)}>CREAR PRODUCTO</button>
                    </div>
                ) : (
                    <div className="add-product-container">
                        <h3>Añadir Producto</h3>
                        <form onSubmit={handleAddProduct}>
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Precio"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Stock"
                                value={newProduct.stock}
                                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                            />
                            <textarea
                                placeholder="Descripción"
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            ></textarea>
                            <input
                                type="text"
                                placeholder="URL de la Imagen"
                                value={newProduct.image}
                                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                            />
                            <button type="submit">Añadir Producto</button>
                        </form>
                        <button className="view-products-button" onClick={() => setShowProductList(true)}>VER LISTADO DE PRODUCTOS</button>
                    </div>
                )}
            </div>

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirmar Eliminación</h3>
                        <p>¿Estás seguro de que quieres eliminar este producto?</p>
                        <button className="delete-button" onClick={handleDeleteProduct}>Eliminar</button>
                        <button className="cancel-button" onClick={closeModal}>Cancelar</button>
                    </div>
                </div>
            )}

            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Producto creado exitosamente</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
