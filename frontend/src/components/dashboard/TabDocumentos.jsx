// frontend/src/components/dashboard/TabDocumentos.jsx
import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService.js';

// O estado inicial do formulário vive AQUI agora
const initialDocForm = {
  user_id: '',
  document_type: 'CPF', // Valor padrão
  upload_date: new Date().toISOString().split('T')[0]
};

// Recebe a lista de atletas como prop do AdminDashboard
function TabDocumentos({ athletes = [] }) {

  // --- Estados da Aba DOCUMENTOS ---
  const [documentsReport, setDocumentsReport] = useState([]); 
  const [docForm, setDocForm] = useState(initialDocForm);
  const [docFile, setDocFile] = useState(null); 
  const [docMessage, setDocMessage] = useState('');

  // --- Busca os dados necessários para esta aba ---
  useEffect(() => {
    console.log("TabDocumentos montado. Buscando dados...");
    // Não precisa buscar atletas, já recebemos como prop!
    api.fetchDocumentsReport().then(setDocumentsReport);
  }, []); // O [] garante que isso roda só uma vez

  // --- Funções de Ação de DOCUMENTOS ---
  const handleDocFormChange = (e) => {
    const { name, value } = e.target;
    setDocForm(prevForm => ({ ...prevForm, [name]: value }));
  };
  
  const handleDocFileChange = (e) => {
    setDocFile(e.target.files[0]);
  };

  const handleDocumentUpload = async (e) => {
    e.preventDefault();
    setDocMessage('Enviando arquivo...');
    if (!docFile) {
      setDocMessage('Erro: Por favor, selecione um arquivo.');
      return;
    }
    const formData = new FormData();
    formData.append('document', docFile); 
    formData.append('user_id', docForm.user_id);
    formData.append('document_type', docForm.document_type);
    formData.append('upload_date', docForm.upload_date);

    api.uploadDocument(formData)
        .then(data => {
            setDocMessage(data.message);
            setDocForm(initialDocForm);
            setDocFile(null);
            // Reseta o input de arquivo (target pode não ser o form)
            if (e.target.reset) {
                e.target.reset(); 
            } else if (document.querySelector('input[type="file"]')) {
                // Solução alternativa se e.target não for o form
                document.querySelector('input[type="file"]').value = '';
            }
            api.fetchDocumentsReport().then(setDocumentsReport); // Re-busca
        })
        .catch(err => {
            setDocMessage(`Erro: ${err.message || 'Falha no upload.'}`);
        });
  };

  const handleDeleteDocument = (docId) => {
    if (!window.confirm('Tem certeza que deseja excluir este documento? O arquivo será apagado permanentemente.')) return;
    
    api.deleteDocument(docId)
        .then(data => {
            alert(data.message || 'Documento excluído.');
            setDocumentsReport(documentsReport.filter(d => d.id !== docId));
        })
        .catch(err => {
            alert('Erro de conexão ao excluir documento.');
        });
  };

  // --- JSX de Renderização ---
  return (
    <div className="tab-content">
      <div className="form-card">
        <h2 className="section-title">Upload de Documento (Admin)</h2>
        {/* O JSX usa as funções LOCAIS (handleDocumentUpload, etc.) */}
        <form onSubmit={handleDocumentUpload} className="document-form">
          <div className="form-row">
            <div className="form-group">
              <label>Atleta (Para quem é o doc?)</label>
              {/* Usamos a prop 'athletes' vinda do AdminDashboard */}
              <select name="user_id" value={docForm.user_id} onChange={handleDocFormChange} required>
                <option value="">Selecione um atleta</option>
                {athletes.map(a => <option key={a.id} value={a.id}>{a.username}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Tipo de Documento</label>
              <select name="document_type" value={docForm.document_type} onChange={handleDocFormChange} required>
                <option value="CPF">CPF</option>
                <option value="RG">RG</option>
                <option value="Comprovante de Residencia">Comprovante de Residência</option>
                <option value="Exame Medico">Exame Médico</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Data do Upload</label>
              <input type="date" name="upload_date" value={docForm.upload_date} onChange={handleDocFormChange} required />
            </div>
            <div className="form-group">
              <label>Arquivo</label>
              <input type="file" name="document" onChange={handleDocFileChange} required />
            </div>
          </div>
          <button type="submit" className="button-primary">Enviar Documento</button>
          {docMessage && <p className="feedback-message">{docMessage}</p>}
        </form>
      </div>
      
      <hr className="separator" />
      
      <h2 className="section-title">Relatório Geral de Documentos ({documentsReport.length})</h2>
      <div className="list-container document-list">
        <div className="list-item header">
          <span className="col-username">Atleta</span>
          <span className="col-type">Tipo</span>
          <span className="col-date">Data</span>
          <span className="col-link">Arquivo</span>
          <span className="col-actions">Ações</span>
        </div>
        {documentsReport.length > 0 ? (
          documentsReport.map(doc => (
            <div key={doc.id} className="list-item">
              <span className="col-username">{doc.username}</span>
              <span className="col-type">{doc.document_type}</span>
              <span className="col-date">{new Date(doc.upload_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
              <span className="col-link">
                <a href={`http://https://projeto-agita.onrender.com/uploads/${doc.filename}`} target="_blank" rel="noopener noreferrer">Ver Arquivo</a>
              </span>
              <span className="col-actions">
                <button onClick={() => handleDeleteDocument(doc.id)} className="button-danger small">Excluir</button>
              </span>
            </div>
          ))
        ) : ( <p>Nenhum documento enviado.</p> )}
      </div>
    </div>
  );
}

export default TabDocumentos;