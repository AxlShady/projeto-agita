// frontend/src/components/dashboard/TabNotas.jsx
import React, { useState, useEffect } from 'react';
import ReportTable from '../ReportTable.jsx';
import * as api from '../../services/apiService.js';

// O estado inicial do formulário vive AQUI agora
const initialGradeForm = {
  user_id: '',
  age_category_id: '',
  apparatus_id: '',
  event_id: '',
  score: '',
  evaluation_date: new Date().toISOString().split('T')[0]
};

function TabNotas({ athletes = [] }) {
  // --- Estados da Aba NOTAS ---
  const [ageCategories, setAgeCategories] = useState([]); 
  const [apparatusList, setApparatusList] = useState([]); 
  const [eventsList, setEventsList] = useState([]);
  const [gradeMessage, setGradeMessage] = useState(''); 
  const [gradeForm, setGradeForm] = useState(initialGradeForm);
  const [gradesReport, setGradesReport] = useState([]);

  // --- Busca os dados necessários para esta aba ---
  useEffect(() => {
    console.log("TabNotas montado. Buscando dados para formulários...");
    
    // Busca os dados que os dropdowns precisam
    api.fetchAgeCategories().then(setAgeCategories);
    api.fetchApparatusList().then(setApparatusList);
    api.fetchEventsList().then(setEventsList);
    
    // Busca o relatório inicial
    api.fetchGradesReport().then(setGradesReport);
    
  }, []); // O [] garante que isso roda só uma vez

  // --- Funções de Ação de NOTAS ---
  const handleGradeFormChange = (e) => {
    const { name, value } = e.target;
    setGradeForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleCreateGrade = async (e) => {
    e.preventDefault();
    setGradeMessage('Salvando nota...');
    
    api.createGrade(gradeForm)
        .then(data => {
            setGradeMessage(data.message);
            setGradeForm(initialGradeForm); 
            api.fetchGradesReport().then(setGradesReport); // Re-busca os dados
        })
        .catch(err => {
            setGradeMessage(`Erro: ${err.message || 'Falha ao salvar.'}`);
        });
  };

  const handleDeleteGrade = (gradeId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta nota?')) return;
    
    api.deleteGrade(gradeId)
        .then(data => {
            alert(data.message || 'Nota excluída com sucesso!');
            setGradesReport(gradesReport.filter(grade => grade.id !== gradeId));
        })
        .catch(err => {
            alert(`Erro: ${err.message}`);
        });
  };
  
  // --- JSX de Renderização ---
  return (
    <div className="tab-content">
      <div className="form-card">
        <h2 className="section-title">Lançamento de Notas</h2>
        {/* O JSX usa as funções LOCAIS (handleCreateGrade, etc.) */}
        <form onSubmit={handleCreateGrade} className="grades-form">
          <div className="form-row">
            <div className="form-group">
              <label>Atleta</label>
              <select name="user_id" value={gradeForm.user_id} onChange={handleGradeFormChange} required>
                <option value="">Selecione um atleta</option>
                {athletes.map(a => <option key={a.id} value={a.id}>{a.username}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Evento</label>
              <select name="event_id" value={gradeForm.event_id} onChange={handleGradeFormChange} required>
                <option value="">Selecione um evento</option>
                {eventsList.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Categoria (Idade)</label>
              <select name="age_category_id" value={gradeForm.age_category_id} onChange={handleGradeFormChange} required>
                <option value="">Selecione a categoria</option>
                {ageCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Aparelho</label>
              <select name="apparatus_id" value={gradeForm.apparatus_id} onChange={handleGradeFormChange} required>
                <option value="">Selecione o aparelho</option>
                {apparatusList.map(ap => <option key={ap.id} value={ap.id}>{ap.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Nota (Ex: 8.50)</label>
              <input type="number" step="0.01" name="score" value={gradeForm.score} onChange={handleGradeFormChange} required />
            </div>
            <div className="form-group">
              <label>Data da Avaliação</label>
              <input type="date" name="evaluation_date" value={gradeForm.evaluation_date} onChange={handleGradeFormChange} required />
            </div>
          </div>
          <button type="submit" className="button-primary">Lançar Nota</button>
          {gradeMessage && <p className="feedback-message">{gradeMessage}</p>}
        </form>
      </div>
      
      <hr className="separator" />
      
      <h2 className="section-title">Histórico de Notas ({gradesReport.length})</h2>
      <ReportTable reportType="grades" data={gradesReport} onDelete={handleDeleteGrade} />
    </div>
  );
}

export default TabNotas;