import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService.js';

// Este componente é "controlado" pelo AdminDashboard.
// Ele recebe os valores (states) e as funções (handlers) via props.
function TabEventos({
 
}) 

{

  // --- Estados de Eventos ---
  const [events, setEvents] = useState([]); 
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventMessage, setEventMessage] = useState('');

  const handleCreateEvent = async (e) => {
      e.preventDefault();
      setEventMessage('Criando evento...');
      const eventData = { title: eventTitle, event_date: eventDate, location: eventLocation, description: eventDescription };
    
    api.createEvent(eventData)
        .then(data => {
            setEventMessage(data.message);
            setEventTitle(''); setEventDate(''); setEventLocation(''); setEventDescription('');
            setEvents([data.newEvt, ...events]); // Atualiza o estado local
        })
        .catch(err => {
            setEventMessage(`Erro: ${err.message || 'Falha ao criar evento.'}`);
        });
};

    const handleDeleteEvent = (eventId) => {
        if (!window.confirm('Tem certeza que deseja excluir este evento?')) return;
    
    api.deleteEvent(eventId)
        .then(data => {
            setEvents(events.filter(event => event.id !== eventId));
            alert(data.message || 'Evento excluído com sucesso!');
        })
        .catch(err => {
            alert(`Erro: ${err.message}`);
        });
};

// --- Busca os eventos quando o componente é montado ---
     useEffect(() => {
       console.log("TabEventos montado. Buscando eventos...");
       api.fetchEvents()
         .then(setEvents)
         .catch(err => console.error("Erro ao buscar eventos:", err));
     }, []); // O [] garante que isso roda só uma vez

   return (
    <div className="tab-content">
      <h2 className="section-title">Gerenciamento de Eventos</h2>
      <div className="forms-container">

        <div className="form-card">
          <h2>Criar Novo Evento</h2>
          {/* MUDANÇA AQUI: 
            'onSubmit={onCreateEvent}' virou 'onSubmit={handleCreateEvent}' 
          */}
          <form onSubmit={handleCreateEvent}>
            <div className="form-group">
              <label>Título do Evento</label>
              {/* MUDANÇA AQUI: 
                  'onSetEventTitle' virou 'setEventTitle'
                */}
              <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Data do Evento</label>
              {/* ... e aqui 'setEventDate' */}
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Local</label>
              {/* ... e aqui 'setEventLocation' */}
              <input type="text" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Descrição (Opcional)</label>
              {/* ... e aqui 'setEventDescription' */}
              <textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
            </div>
            <button type="submit" className="button-primary">Criar Evento</button>
            {eventMessage && <p className="feedback-message">{eventMessage}</p>}
          </form>
        </div>

        <div className="form-card">
          <h2>Eventos Cadastrados ({events.length})</h2>
          <div className="event-list">
            {events.length > 0 ? (
              events.map(event => (
                <div key={event.id} className="event-item">
                  <div className="event-details">
                    <strong>{event.title}</strong>
                    <span>Data: {new Date(event.event_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                    <span>Local: {event.location}</span>
                  </div>
                  {/* MUDANÇA AQUI: 
                      'onDeleteEvent' virou 'handleDeleteEvent'
                    */}
                  <button onClick={() => handleDeleteEvent(event.id)} className="button-danger">Excluir</button>
                </div>
              ))
            ) : ( <p>Nenhum evento cadastrado.</p> )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default TabEventos;