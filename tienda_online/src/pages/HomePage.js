import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './HomePage.css'; // Importa el archivo CSS
import hgato_comiendo from '../components/hgato_comiendo.jpg'; // Importa la imagen

const HomePage = () => {
    return (
        <div>
            <Navbar />
            <div className="home-container">
                <img src={hgato_comiendo} alt="Nuevo Lanzamiento" className="background-image" />
                <div className="home-content">
                    <p className="home-subtitle">Conócenos</p>
                    <h1 className="home-title">Somos los mejores</h1>
                    <p className="home-description">Aquí encontrarás los mejores productos de alimentos para tus perritos y gatitos, disfruta de nuestra página y haz felices a tus perritos y gatitos.</p>
                    <Link to="/products">
                        <button className="home-button">Comprar</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
