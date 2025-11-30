import React from 'react';
import { Link } from 'react-router-dom'; 
import Navbar from "../../components/publico/Navbar.jsx"; 
import '../../styles/Public.css'; 

import { FaWhatsapp, FaInstagram, FaMapMarkerAlt } from 'react-icons/fa';

function Home() {
  return (
    <div className="public-page">
      <Navbar />

      {/* HERO SECTION */}
      <header className="hero-section">
        <h1 className="hero-title">Bem-vindo à <span style={{color: '#ff6600'}}>AGITA</span></h1>
        <p className="hero-subtitle">
          Formando campeãs e transformando vidas através da Ginástica Rítmica.
          Junte-se ao nosso time!
        </p>
      </header>

      {/* CONTEÚDO */}
      <div className="public-container">
        
        {/* CARD 1: NOSSA MISSÃO (MANTIDO) */}
        <div className="section-card card-spacing-bottom"> 
            <h2 className="content-header-blue">Nossa Missão</h2>
            <div className="card-content-body"> {/* CONTEÚDO */}
                <p>Proporcionar treinamento de alta qualidade, promovendo saúde, disciplina e o amor pelo esporte em um ambiente seguro e acolhedor.</p>
            </div>
        </div>

        {/* CARD 2 & 3: EVENTOS E GALERIA (GRID) */}
        <div className="grid-2-cols spaced-top"> 
            
            {/* CARD EVENTOS */}
            <Link to="/events" className="card-link-wrapper"> 
                <div className="section-card card-events">
                    <h3 className="content-header-blue">Próximos Eventos</h3>
                    <div className="card-content-body"> {/* NOVO WRAPPER */}
                        <p>Confira nosso calendário de competições e festivais.</p>
                    </div>
                </div>
            </Link>

            {/* CARD GALERIA */}
            <Link to="/gallery" className="card-link-wrapper">
                <div className="section-card card-gallery">
                    <h3 className="content-header-blue">Galeria de Fotos</h3>
                    <div className="card-content-body"> {/* NOVO WRAPPER */}
                        <p>Veja os melhores momentos das nossas ginastas.</p>
                    </div>
                </div>
            </Link>
        </div>

        {/* --- SEÇÃO DE CONTATO --- */}
        <div className="section-card contact-section spaced-top">
            <h2 className="content-header-blue">Onde nos encontrar</h2>
            
            <div className="contact-grid">
                
                {/* LADO ESQUERDO: GOOGLE MAPS */}
                <div className="map-container">
                    <iframe 
                        title="Mapa Agita"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.2123456789!2d-34.900000!3d-7.833333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwNTAnMDAuMCJTIDM0wrA1NCcwMC4wIlc!5e0!3m2!1spt-BR!2sbr!4v12345678903" 
                        width="100%" 
                        height="300" 
                        style={{border:0, borderRadius: '8px'}} 
                        allowFullScreen 
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>

                {/* LADO DIREITO: LINKS */}
                <div className="contact-info">
                    <p className="contact-desc">Estamos prontos para tirar suas dúvidas!</p>
                    
                    <ul className="contact-list">
                        <li>
                            <span className="icon icon-map"><FaMapMarkerAlt /></span> 
                            <strong>Endereço:</strong><br/> 
                            Rua da Ginástica, 123 - Centro, Igarassu / PE
                        </li>
                        
                        <li>
                            <a href="https://wa.me/5581987586644" target="_blank" rel="noreferrer" className="contact-link">
                                <span className="icon icon-whatsapp"><FaWhatsapp /></span> 
                                (81) 98758-6644 (WhatsApp)
                            </a>
                        </li>
                        
                        <li>
                            <a href="https://instagram.com/agitape_gr" target="_blank" rel="noreferrer" className="contact-link">
                                <span className="icon icon-instagram"><FaInstagram /></span> 
                                @agitape_gr
                            </a>
                        </li>
                    </ul>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
}

export default Home;