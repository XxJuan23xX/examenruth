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
    const [productToDelete, setProductToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
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
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/products`, {
                Nombre: newProduct.name,
                Precio: newProduct.price,
                Stock: newProduct.stock,
                Descripcion: newProduct.description,
                Imagen: newProduct.image
            });
            setProducts([...products, res.data]);
            setNewProduct({ name: '', price: '', stock: '', description: '', image: '' });
            setShowProductList(true); // Show product list after adding a new product
        } catch (error) {
            console.error('Error adding product', error);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${productToDelete}`);
            setProducts(products.filter(product => product.ProductoID !== productToDelete));
            setShowDeleteModal(false); // Hide delete confirmation modal
        } catch (error) {
            console.error('Error deleting product', error);
        }
    };

    const handleEditProduct = async () => {
        try {
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/products/${productToEdit.ProductoID}`, {
                Nombre: productToEdit.Nombre,
                Precio: productToEdit.Precio,
                Stock: productToEdit.Stock,
                Descripcion: productToEdit.Descripcion,
                Imagen: productToEdit.Imagen
            });
            setProducts(products.map(product => product.ProductoID === productToEdit.ProductoID ? res.data : product));
            setShowEditModal(false); // Hide edit modal
        } catch (error) {
            console.error('Error updating product', error);
        }
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
                <div className="header-container">
                    <h2>Admin Panel</h2>
                    <button className="create-product-button" onClick={() => setShowProductList(false)}>CREAR PRODUCTO</button>
                </div>
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
                                            <button 
                                                className="delete-button"
                                                onClick={() => {
                                                    setProductToDelete(product.ProductoID);
                                                    setShowDeleteModal(true);
                                                }}
                                            >
                                                Eliminar
                                            </button>
                                            <button 
                                                className="edit-button"
                                                onClick={() => {
                                                    setProductToEdit(product);
                                                    setShowEditModal(true);
                                                }}
                                            >
                                                Editar
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
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

                {showDeleteModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>¿Estás seguro de que quieres eliminar este producto?</h3>
                            <button className="delete-button" onClick={handleDeleteProduct}>Eliminar</button>
                            <button className="cancel-button" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                        </div>
                    </div>
                )}

                {showEditModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Editar Producto</h3>
                            <form>
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={productToEdit.Nombre}
                                    onChange={(e) => setProductToEdit({ ...productToEdit, Nombre: e.target.value })}
                                />
                                <input
                                    type="number"
                                    placeholder="Precio"
                                    value={productToEdit.Precio}
                                    onChange={(e) => setProductToEdit({ ...productToEdit, Precio: e.target.value })}
                                />
                                <input
                                    type="number"
                                    placeholder="Stock"
                                    value={productToEdit.Stock}
                                    onChange={(e) => setProductToEdit({ ...productToEdit, Stock: e.target.value })}
                                />
                                <textarea
                                    placeholder="Descripción"
                                    value={productToEdit.Descripcion}
                                    onChange={(e) => setProductToEdit({ ...productToEdit, Descripcion: e.target.value })}
                                ></textarea>
                                <input
                                    type="text"
                                    placeholder="URL de la Imagen"
                                    value={productToEdit.Imagen}
                                    onChange={(e) => setProductToEdit({ ...productToEdit, Imagen: e.target.value })}
                                />
                                <button type="button" className="edit-button" onClick={handleEditProduct}>Confirmar</button>
                                <button type="button" className="cancel-button" onClick={() => setShowEditModal(false)}>Cancelar</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
