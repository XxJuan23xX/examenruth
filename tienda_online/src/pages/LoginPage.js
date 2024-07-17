// src/pages/LoginPage.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../protected/AuthContext';
import Navbar from '../components/Navbar';
import './Login.css';
import LoginImage from '../components/Paisaje.jpg'; // Asegúrate de tener la ruta correcta para la imagen

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, { email, password });
            const token = response.data.token;
            const userData = JSON.parse(atob(token.split('.')[1]));
            login(token, userData);
            if (userData.rolID === 2) {
                navigate('/admin');
            } else {
                navigate('/products');
            }
        } catch (error) {
            setError('Invalid email or password');
        }
    };

    return (
        <>
            <Navbar />
            <div className="login-page">
                <div className="login-container">
                    <div className="login-card">
                        <div className="login-form">
                            <h1>PetStore</h1>
                            <h2>Login</h2>
                            <p>Introduce tus datos a continuación</p>
                            <form onSubmit={handleLogin}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    required
                                    className="login-input"
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                    className="login-input"
                                />
                                <button type="submit" className="login-button">Login</button>
                            </form>
                            {error && <p className="error-message">{error}</p>}
                            <p className="register-prompt">
                                ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
                            </p>
                        </div>
                        <div className="login-image">
                            <img src={LoginImage} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
