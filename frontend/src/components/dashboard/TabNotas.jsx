import React, { useState, useEffect } from 'react';

function TabNotas({ athletes, events }) {

  const [selectedAthlete, setSelectedAthlete] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [category, setCategory] = useState('Mirim');
  const [apparatus, setApparatus] = useState('Mãos Livres');
  const [score, setScore] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [grades, setGrades] = useState([]);

  useEffect(() => {
      fetchGrades();
  }, []);

  const fetchGrades = async () => {
      try {
          const res = await fetch("http://localhost:3001/grades");
          if(res.ok) {
            const data = await res.json();
            setGrades(data);
          }
      } catch (err) { console.error(err); }
  };

  const handleCreateGrade = async (e) => {
      e.preventDefault();
      if(!selectedAthlete || !selectedEvent || !score) {
          alert("Preencha todos os campos!");
          return;
      }
      setMessage('Enviando...');
      const gradeData = { user_id: selectedAthlete, event_id: selectedEvent, category, apparatus, score, date_graded: date };

      try {
          const response = await fetch("http://localhost:3001/grades", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(gradeData)
          });
          if (response.ok) {
              setMessage("Nota lançada!");
              setScore(''); 
              fetchGrades(); 
              setTimeout(() => setMessage(''), 3000);
          } else { setMessage("Erro ao lançar."); }
      } catch (error) { console.error(error); }
  };

  const handleDeleteGrade = async (id) => {
      if(!window.confirm("Excluir nota?")) return;
      try {
          const response = await fetch(`http://localhost:3001/grades/${id}`, { method: "DELETE" });
          if(response.ok) fetchGrades();
      } catch (error) { console.error(error); }
  };

  return (
    <div className="tab-content">
      {/* REMOVI O TÍTULO DAQUI PARA NÃO DUPLICAR */}
      
      <div className="forms-container">
        
        {/* --- FORMULÁRIO --- */}
        <div className="form-card">
          <h3>Nova Avaliação</h3>
          <form onSubmit={handleCreateGrade}>
            <div className="form-group">
              <label>Atleta</label>
              <select value={selectedAthlete} onChange={(e) => setSelectedAthlete(e.target.value)} required>
                  <option value="">Selecione...</option>
                  {athletes && athletes.map(atl => (
                      <option key={atl.id} value={atl.id}>{atl.username} ({atl.category})</option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label>Evento</label>
              <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} required>
                  <option value="">Selecione...</option>
                  {events && events.map(ev => (
                      <option key={ev.id} value={ev.id}>
                          {ev.title || ev.name} - {new Date(ev.event_date || ev.date).toLocaleDateString()}
                      </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
                <label>Aparelho</label>
                <select value={apparatus} onChange={(e) => setApparatus(e.target.value)}>
                    <option>Mãos Livres</option><option>Corda</option><option>Arco</option>
                    <option>Bola</option><option>Maças</option><option>Fita</option>
                </select>
            </div>

            <div className="form-group">
              <label>Nota</label>
              <input type="number" step="0.01" value={score} onChange={(e) => setScore(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Data da Avaliação</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>

            <button type="submit" className="button-primary">Lançar Nota</button>
            {message && <p className="feedback-message">{message}</p>}
          </form>
        </div>

        {/* --- TABELA --- */}
        <div className="table-card">
            <h3>Histórico de Notas ({grades.length})</h3>
            <div className="event-list">
                {grades.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Atleta</th>
                                <th>Evento</th>
                                <th>Aparelho</th>
                                <th>Nota</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grades.map(grade => (
                                <tr key={grade.id}>
                                    <td>{grade.username || grade.user_id}</td>
                                    <td>{grade.event_name || grade.title}</td>
                                    <td>{grade.apparatus_id}</td>
                                    <td><strong>{grade.score}</strong></td>
                                    <td>
                                        <button onClick={() => handleDeleteGrade(grade.id)} className="button-danger">Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : ( <p>Nenhuma nota lançada.</p> )}
            </div>
        </div>

      </div>
    </div>
  );
}

export default TabNotas;