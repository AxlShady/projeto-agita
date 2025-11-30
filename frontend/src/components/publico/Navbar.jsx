// Arquivo: frontend/src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Public.css'; 
import logo from '../../assets/logo.png'; 

function Navbar() {
  return (
    <nav className="public-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Agita Logo" className="nav-logo-img" />
          AGITA <span>Ginástica</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Início</Link>
          <Link to="/about">Sobre</Link>
          <Link to="/events">Eventos</Link>
          <Link to="/gallery">Galeria</Link>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="btn-login-nav">Área do Atleta / Admin</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;