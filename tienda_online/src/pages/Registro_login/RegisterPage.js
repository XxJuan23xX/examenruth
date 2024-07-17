import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './RegisterPage.css';

import RegisterImage from '../../components/Perrito.jpg'; // Asegúrate de tener la ruta correcta para la imagen

const RegisterPage = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('${process.env.REACT_APP_API_URL}/users/register', {
                nombre,
                email,
                password,
            });
            setNombre('');
            setEmail('');
            setPassword('');
            setError('');
            setSuccess('Usuario registrado exitosamente');
            setTimeout(() => {
                navigate('/login'); // Redirigir a la página de inicio de sesión
            }, 2000);
        } catch (err) {
            setError('Error al registrar usuario');
            setSuccess('');
        }
    };

    return (
        <>
            <Navbar />
            <div className="register-page">
                <div className="register-container">
                    <div className="register-card">
                        <div className="register-form">
                            <h1>PetStore</h1>
                            <h2>Registro</h2>
                            <p>Crea tu cuenta ahora mismo</p>
                            {error && <p className="error-message">{error}</p>}
                            {success && <p className="success-message">{success}</p>}
                            <form onSubmit={handleRegister}>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Nombre"
                                    required
                                    className="register-input"
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    required
                                    className="register-input"
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                    className="register-input"
                                />
                                <button type="submit" className="register-button">Register</button>
                            </form>
                            <p className="login-prompt">
                                ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
                            </p>
                        </div>
                        <div className="register-image">
                            <img src={RegisterImage} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
