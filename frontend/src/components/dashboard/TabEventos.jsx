import React, { useState, useEffect } from 'react';

function TabEventos({ athletes }) {

  // --- Estados de Eventos ---
  const [events, setEvents] = useState([]); 
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventMessage, setEventMessage] = useState('');

  // --- Estados de Inscrição ---
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedAthleteId, setSelectedAthleteId] = useState("");
  const [subscribeMessage, setSubscribeMessage] = useState("");

  // --- BUSCA INICIAL ---
  const fetchEvents = async () => {
      try {
          const res = await fetch("https://projeto-agita.onrender.com/events");
          if(!res.ok) throw new Error("Erro ao buscar eventos");
          const data = await res.json();
          setEvents(data);
      } catch (err) {
          console.error("Erro:", err);
      }
  };

  useEffect(() => {
     fetchEvents();
  }, []);

  // --- 1. CRIAR EVENTO ---
  const handleCreateEvent = async (e) => {
      e.preventDefault();
      setEventMessage('Criando...');
      
      try {
        const response = await fetch("https://projeto-agita.onrender.com/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: eventName, // Enviando como title para garantir
                date: eventDate, 
                location: eventLocation, 
                description: eventDescription 
            })
        });

        const data = await response.json();

        if (response.ok) {
            setEventMessage("Evento criado com sucesso!");
            setEventName(''); setEventDate(''); setEventLocation(''); setEventDescription('');
            fetchEvents(); 
        } else {
            setEventMessage(`Erro: ${data.message}`);
        }
      } catch (err) {
        setEventMessage("Erro de conexão.");
        console.error(err);
      }
  };

  // --- 2. INSCREVER ATLETA ---
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!selectedEventId || !selectedAthleteId) {
        alert("Selecione um evento e um atleta.");
        return;
    }

    try {
        const response = await fetch("https://projeto-agita.onrender.com/events/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: selectedAthleteId, eventId: selectedEventId }),
        });

        const data = await response.json();

        if (response.ok) {
            setSubscribeMessage("Inscrição realizada!");
            setSelectedAthleteId(""); 
            setTimeout(() => setSubscribeMessage(""), 3000);
        } else {
            alert(data.message || "Erro ao inscrever.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro de conexão.");
    }
  };

  // --- 3. DELETAR (Simulação) ---
  const handleDeleteEvent = (id) => {
      if(!window.confirm("Deseja excluir?")) return;
      alert("Funcionalidade de excluir em breve.");
  };

  return (
    <div className="tab-content">
      {/* REMOVI O TÍTULO DUPLICADO DAQUI */}
      
      <div className="forms-container">

        {/* --- CARD 1: CRIAR EVENTO --- */}
        <div className="form-card">
          <h3>Criar Novo Evento</h3>
          <form onSubmit={handleCreateEvent}>
            <div className="form-group">
              <label>Nome do Evento</label>
              <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Data</label>
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Local</label>
              <input type="text" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
            </div>
            <button type="submit" className="button-primary">Criar Evento</button>
            {eventMessage && <p className="feedback-message">{eventMessage}</p>}
          </form>
        </div>

        {/* --- CARD 2: INSCREVER ATLETA --- */}
        <div className="form-card"> 
            <h3>Inscrever Atleta</h3>
            <form onSubmit={handleSubscribe}>
                <div className="form-group">
                    <label>Selecione o Evento</label>
                    <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
                        <option value="">-- Selecione --</option>
                        {events.map(ev => (
                            <option key={ev.id} value={ev.id}>
                                {ev.title || ev.name} - {new Date(ev.event_date || ev.date).toLocaleDateString()}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Selecione o Atleta</label>
                    <select value={selectedAthleteId} onChange={(e) => setSelectedAthleteId(e.target.value)}>
                        <option value="">-- Selecione --</option>
                        {athletes && athletes.map(atl => (
                            <option key={atl.id} value={atl.id}>{atl.username} ({atl.category})</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="button-primary">Confirmar Inscrição</button>
                {subscribeMessage && <p className="feedback-message">{subscribeMessage}</p>}
            </form>
        </div>

        {/* --- CARD 3: LISTA --- */}
        <div className="table-card">
          <h3>Eventos Cadastrados ({events.length})</h3>
          <div className="event-list">
            {events.length > 0 ? (
              events.map(ev => (
                <div key={ev.id} className="event-item">
                  <div className="event-details">
                    <strong>{ev.name || ev.title}</strong>
                    <span>Data: {new Date(ev.event_date || ev.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                    <span>Local: {ev.location}</span>
                  </div>
                  <button onClick={() => handleDeleteEvent(ev.id)} className="button-danger" style={{opacity: 0.5}}>Excluir</button>
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