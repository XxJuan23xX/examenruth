import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders/history`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching order history:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="order-history-container">
                <h2 className="order-history-title">Historial de Compras</h2>
                <div className="order-history">
                    {orders.map(order => {
                        
                        return (
                            <div key={order.PedidoID} className="order-card">
                                <h3>Order ID: <span>{order.PedidoID}</span></h3>
                                <p>Fecha: <span>{order.FechaPedido}</span></p>
                                <p>Total: <span>${order.Total}</span></p>
                                
                                <h4>Products:</h4>
                                <ul className="product-lista">
                                    {order.detalles.map(detail => (
                                        <li key={detail.ProductoID} className="product-item">
                                            <img src={detail.Imagen} alt={detail.NombreProducto} />
                                            <span>{detail.NombreProducto}</span>
                                            <span>${detail.PrecioUnitario}</span>
                                            <span>x {detail.Cantidad}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryPage;
