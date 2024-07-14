import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../protected/AuthContext';
import './NavBar.css';
import purchaseHistoryIcon from '../components/Historial.png'; 
import purchaseCarIcon from '../components/CAR-BUY.png'; 


const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="navbar-brand">
                    <Link to="/">| PetStore |</Link>
                </div>
            </div>
            <div className="navbar-center">
                <ul className="navbar-menu">
                    <li><Link to="/products">Productos |</Link></li>
                    {user && user.rolID === 2 && (
                        <>
                            <li><Link to="/admin">Admin Panel |</Link></li>
                            <li><Link to="/admin/orders">Order Management </Link></li>
                        </>
                    )}
                </ul>
            </div>
            <div className="navbar-right">
                {user && user.rolID !== 2 && (
                    <>
                        <Link to="/cart" className="navbar-icon">
                            <img src={purchaseCarIcon} alt="Carrito" className="car-icon" />
                        </Link>
                        <Link to="/order-history" className="navbar-icon">
                            <img src={purchaseHistoryIcon} alt="Historial de Compras" className="history-icon" />
                        </Link>
                    </>
                )}
                {user ? (
                    <button className="logout-button" onClick={logout}>Cerrar Sesión</button>
                ) : (
                    <Link to="/login" className="navbar-subscribe">INICIO DE SESIÓN</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
