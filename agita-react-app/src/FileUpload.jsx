import React, { useState } from 'react';

// O componente agora recebe 'props', que contém o userId
function FileUpload(props) { 
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('CPF');
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Por favor, selecione um arquivo.');
      return;
    }

    const formData = new FormData();
    formData.append('document', selectedFile);
    formData.append('document_type', documentType);
    
    // LINHA CRÍTICA: Envia o ID real da atleta logada
    formData.append('user_id', props.userId); 

    try {
      const response = await fetch('http://localhost:3001/documents/upload', {
        method: 'POST',
        // ATENÇÃO: Não usamos 'Content-Type': 'application/json' com FormData
        body: formData,
      });

      const data = await response.json();

      if (response.status === 200) {
        setMessage('Documento enviado com sucesso!');
        setSelectedFile(null);
        // Atualiza a lista na tela da atleta
        props.onUploadSuccess(); 
      } else {
        setMessage(data.message || 'Erro no upload.');
      }
    } catch (error) {
      setMessage('Erro ao conectar com o servidor.');
      console.error('Erro de conexão:', error);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Upload de Documentos</h2>
      <select
        value={documentType}
        onChange={(e) => setDocumentType(e.target.value)}
      >
        <option value="CPF">CPF</option>
        <option value="RG">RG</option>
        <option value="Comprovante de Residencia">Comprovante de Residência</option>
        <option value="Exame Medico">Exame Médico</option>
      </select>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Fazer Upload</button>
      <p>{message}</p>
    </div>
  );
}

export default FileUpload;