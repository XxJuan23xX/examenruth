import React, { useContext, useState } from 'react';
import axios from 'axios';
import { CartContext } from '../components/CartContext';
import Navbar from '../components/Navbar';
import './CartPage.css';
import { FaTrashAlt } from 'react-icons/fa'; // Importa el ícono de tachar roja

const CartPage = () => {
    const { cart, total, clearCart, updateQuantity, removeFromCart } = useContext(CartContext);
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false); // Estado para el modal

    const handlePlaceOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/orders',
                { products: cart, total: total - discount, estado: 'Pendiente' },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log('Order placed:', response.data);
            clearCart();
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
            }, 2000); // Oculta el modal después de 2 segundos
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const handleApplyCoupon = () => {
        if (coupon === 'PROFAPASENOS' || coupon === 'MIGUELCALVO') {
            const discountAmount = total * 0.2;
            setDiscount(discountAmount);
            setError('');
        } else {
            setDiscount(0);
            setError('Cupón Inválido');
        }
    };

    return (
        <div>
           <Navbar />
            <h1 className="cart-title">Carrito de Compras</h1>
            <div className="cart-container">
                {showModal && <div className="confirmation-modal">Pedido realizado con éxito</div>}
                {cart.length > 0 ? (
                    <>
                        <table className="cart-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                                        <td>
                                            <FaTrashAlt 
                                                className="remove-icon" 
                                                onClick={() => removeFromCart(index)} 
                                            />
                                        </td>
                                        <td className="product-info">
                                            <img src={item.Imagen} alt={item.Nombre} className="product-image1" />
                                            <span>{item.Nombre}</span>
                                        </td>
                                        <td>${item.Precio}</td>
                                        <td className="quantity-control">
                                            <button onClick={() => updateQuantity(index, item.Cantidad - 1)} disabled={item.Cantidad <= 1}>-</button>
                                            <span>{item.Cantidad}</span>
                                            <button onClick={() => updateQuantity(index, item.Cantidad + 1)}>+</button>
                                        </td>
                                        <td>${item.Precio * item.Cantidad}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="cart-summary">
                            <div className="promo-code">
                                <input 
                                    type="text" 
                                    placeholder="Introducir Cupón" 
                                    value={coupon} 
                                    onChange={(e) => setCoupon(e.target.value)} 
                                />
                                <button className="apply-button" onClick={handleApplyCoupon}>Aplicar Cupón</button>
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <div className="totals">
                                <div className="subtotal">
                                    <span>Subtotal:</span>
                                    <span>${total}</span>
                                </div>
                                <div className="discount">
                                    <span>Descuento:</span>
                                    <span>${discount}</span>
                                </div>
                                <div className="total">
                                    <span>Total:</span>
                                    <span>${total - discount}</span>
                                </div>
                            </div>
                        </div>
                        <div className="cart-actions">
                            <button className="cart-button red-button" onClick={clearCart}>Vaciar Carrito</button>
                            <button className="cart-button green-button" onClick={handlePlaceOrder}>Comprar</button>
                        </div>
                    </>
                ) : (
                    <p className="Text-p">Tu carrito está vacío.</p>
                )}
            </div>
        </div>
    );
};

export default CartPage;
