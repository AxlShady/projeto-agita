import React, { useState, useEffect } from 'react';

// Este componente é o formulário de notas
function GradeForm(props) {
    // Reutiliza os dados mestres que o AdminDashboard buscou
    const { athletes, ageCategories, apparatusList, selectedEvent, onGradeSubmit } = props;

    // Estados locais para os campos do formulário
    const [selectedAthlete, setSelectedAthlete] = useState('');
    const [selectedAgeCategory, setSelectedAgeCategory] = useState('');
    const [selectedApparatus, setSelectedApparatus] = useState('');
    const [score, setScore] = useState('');

    // Garante que o primeiro atleta seja selecionado ao carregar
    useEffect(() => {
        if (athletes.length > 0 && !selectedAthlete) {
            setSelectedAthlete(athletes[0].id);
        }
    }, [athletes, selectedAthlete]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!selectedAthlete || !selectedApparatus || !selectedAgeCategory || !score) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const gradeData = {
            user_id: parseInt(selectedAthlete),
            event_id: parseInt(selectedEvent.id), // Usa o ID do evento clicado
            age_category_id: parseInt(selectedAgeCategory),
            apparatus_id: parseInt(selectedApparatus),
            score: parseFloat(score),
            evaluation_date: new Date().toISOString().slice(0, 10)
        };

        // Chama a função principal de submissão do AdminDashboard
        onGradeSubmit(gradeData);
        setScore('');
    };

    return (
        <div className="form-card" style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '2px solid #ff6600' }}>
            <h2 style={{ color: '#002244', marginBottom: '15px' }}>Lançar Nota para: {selectedEvent.title}</h2>
            <form onSubmit={handleSubmit}>
                
                {/* Atleta */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="athlete">Atleta:</label>
                    <select value={selectedAthlete} onChange={(e) => setSelectedAthlete(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
                        <option value="">Selecione uma Atleta</option>
                        {athletes.map(a => (<option key={a.id} value={a.id}>{a.username}</option>))}
                    </select>
                </div>
                
                {/* Categoria (Idade) */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="ageCategory">Categoria (Idade):</label>
                    <select value={selectedAgeCategory} onChange={(e) => setSelectedAgeCategory(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
                        <option value="">Selecione a Categoria</option>
                        {ageCategories.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                    </select>
                </div>

                {/* Aparelho */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="apparatus">Aparelho:</label>
                    <select value={selectedApparatus} onChange={(e) => setSelectedApparatus(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
                        <option value="">Selecione o Aparelho</option>
                        {apparatusList.map(a => (<option key={a.id} value={a.id}>{a.name}</option>))}
                    </select>
                </div>
                
                {/* Nota */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="score">Nota (0.00 a 10.00):</label>
                    <input type="number" step="0.01" min="0" max="10" value={score} onChange={(e) => setScore(e.target.value)} required style={{ width: '100%', padding: '8px' }}/>
                </div>
                
                <button type="submit" style={{ padding: '10px', backgroundColor: '#ff6600', color: 'white', border: 'none', borderRadius: '4px' }}>Registrar Nota</button>
            </form>
            <button onClick={props.onBack} style={{ marginTop: '10px', padding: '8px', width: '100%', backgroundColor: '#ccc' }}>
                ← Voltar para Lista de Eventos
            </button>
        </div>
    );
}

export default GradeForm;