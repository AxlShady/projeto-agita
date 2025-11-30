import React, { useState, useEffect } from 'react';
// Caminho do Navbar: Sobe duas pastas (a partir de publico) e entra em components/publico
import Navbar from "../../components/publico/Navbar.jsx"; 
import '../../styles/Public.css'; // Sobe duas pastas para achar styles/Public.css

function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Busca todos os eventos (para visualização pública)
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Rota pública que busca todos os eventos
                const response = await fetch("https://projeto-agita.onrender.com/events");
                const data = await response.json();
                setEvents(data);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao buscar eventos públicos:", error);
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="public-page">
            <Navbar />

            {/* CABEÇALHO DA PÁGINA */}
            <div className="page-header">
                <h1 className="header-title-public">Agenda de Eventos</h1>
                <p className="header-subtitle-public">
                    Confira a agenda completa de competições e festivais da academia.
                </p>
            </div>

            <div className="public-container">
                <div className="events-section">
                    
                    {/* Mensagem de Carregamento */}
                    {loading && <div className="loading-message">Carregando agenda...</div>}
                    
                    {/* Exibe se a lista estiver vazia */}
                    {!loading && events.length === 0 && (
                        <div className="empty-message-public">
                            <p>Nenhum evento agendado no momento.</p>
                        </div>
                    )}

                    {/* GRID DE CARDS DE EVENTOS */}
                    <div className="events-grid-public">
                        {events.map(event => (
                            <div key={event.id} className="event-card-public">
                                <h3 className="event-title-public">{event.name || event.title}</h3>
                                
                                <div className="event-details-public">
                                    <p>
                                        <strong>Data:</strong> {new Date(event.event_date || event.date).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <strong>Local:</strong> {event.location}
                                    </p>
                                    {event.description && <p className="event-description-public">{event.description}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Events;