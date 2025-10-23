import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';

function AthleteDashboard(props) {
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState('');

  // Função para buscar SOMENTE os documentos do atleta logado
  const fetchAthleteDocuments = async () => {
    try {
      // Rota que busca documentos filtrando pelo ID da atleta que o App.jsx passou
      const response = await fetch(`http://localhost:3001/documents/${props.userId}`);
      
      if (response.status === 200) {
        const data = await response.json();
        setDocuments(data);
      } else {
        setMessage('Erro ao buscar documentos.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      setMessage('Erro ao conectar com o servidor.');
    }
  };

  // Carrega documentos quando a página é aberta
  useEffect(() => {
    // Só busca se o ID do usuário for válido (ou seja, se o login deu certo)
    if (props.userId) {
      fetchAthleteDocuments();
    }
  }, [props.userId]);

  return (
    <div className="athlete-dashboard">
      <h1>Bem-vindo, Atleta!</h1>
      <p>Gerencie seus documentos aqui.</p>

      <hr style={{ margin: '40px 0' }} />

      {/* Upload de Documentos - usa fetchAthleteDocuments para atualizar a lista */}
      <h2>Upload de Documentos</h2>
      <FileUpload onUploadSuccess={fetchAthleteDocuments} userId={props.userId} />

      <hr style={{ margin: '40px 0' }} />
      
      <h2>Meus Documentos Enviados</h2>
      <div className="documents-list">
        {documents.length > 0 ? (
          documents.map(doc => (
            <div key={doc.id} className="document-item">
              <h3>{doc.filename}</h3>
              <p><strong>Tipo:</strong> {doc.document_type}</p>
              <p><strong>Data:</strong> {doc.upload_date}</p>
            </div>
          ))
        ) : (
          <p>Nenhum documento enviado ainda.</p>
        )}
      </div>
      <p>{message}</p>
    </div>
  );
}

export default AthleteDashboard;