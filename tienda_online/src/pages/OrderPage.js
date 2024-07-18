import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id;
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/user/${userId}`);
                setOrders(res.data);
            } catch (error) {
                console.error('Error fetching orders', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <Navbar />
            <h2>My Orders</h2>
            <div>
                {orders.map((order) => (
                    <div key={order.PedidoID}>
                        <h3>Order ID: {order.PedidoID}</h3>
                        <p>Total: ${order.Total}</p>
                        <p>Status: {order.Estado}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderPage;
