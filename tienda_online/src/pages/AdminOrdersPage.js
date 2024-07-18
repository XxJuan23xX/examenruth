import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AdminOrdersPage.css';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleViewProducts = (order) => {
        setSelectedOrder(order);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="admin-orders-page">
            <div className="orders-sidebar">
                <div className="orders-sidebar-header">
                    <h2><Link to="/">PetStore</Link></h2>
                </div>
                <ul className="orders-sidebar-menu">
                    <li><Link to="/products">Productos</Link></li>
                    <li><Link to="/admin">Admin Panel</Link></li>
                    <li><Link to="/admin/orders">Order Management</Link></li>
                    <li><Link to="/logout" className="orders-logout-button">Cerrar Sesión</Link></li>
                </ul>
            </div>
            <div className="orders-admin-content">
                <h2>Order Management</h2>
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>ID Pedido</th>
                            <th>ID Cliente</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.PedidoID}>
                                <td>{order.PedidoID}</td>
                                <td>{order.ClienteID}</td>
                                <td>{new Date(order.FechaPedido).toLocaleString()}</td>
                                <td>${order.Total}</td>
                                <td>
                                    <button onClick={() => handleViewProducts(order)}>Productos</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Productos del Pedido {selectedOrder.PedidoID}</h3>
                        <div className="products-container">
                            {selectedOrder.productos.map(product => (
                                <div key={product.ProductoID} className="product-card">
                                    <img src={product.Imagen} alt={product.Nombre} className="product-image" />
                                    <p>{product.Nombre}</p>
                                    <p>Precio: ${product.Precio}</p>
                                    <p>Cantidad: {product.Cantidad}</p>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleCloseModal}>Regresar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrdersPage;
