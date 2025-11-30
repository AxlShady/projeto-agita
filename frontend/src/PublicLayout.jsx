import React from 'react';
import { Outlet } from 'react-router-dom';

// Caminho de src/PublicLayout.jsx para src/components/publico/Navbar.jsx
import Navbar from './components/publico/Navbar'; 
// Caminho de src/PublicLayout.jsx para src/components/publico/Footer.jsx
import Footer from './components/publico/Footer'; 

// Este componente serve como "molde"
// Ele renderiza o Navbar, o Footer, e o <Outlet>
// O <Outlet> é onde o react-router vai renderizar a página da rota atual
// (ex: Home, About, Events, etc.)
function PublicLayout() {
  return (
    <>
      <Navbar />
      <div className="content-wrap"> {/* Você pode precisar de um wrapper para o CSS */}
        <Outlet /> {/* Aqui é onde o Home, About, etc. será renderizado */}
      </div>
      <Footer />
    </>
  );
}

export default PublicLayout;