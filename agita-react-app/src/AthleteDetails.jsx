import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload'; 
import './AthleteDetails.css'; 

function AthleteDetails(props) {
    const { userId, onBack } = props; // Recebe o ID do atleta e a função para voltar
    const [athleteData, setAthleteData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // NOTA: AS FUNÇÕES DE BUSCA DE DADOS VÃO AQUI (Pagamentos, Notas, etc.)
    // Vamos usar o userId para buscar TUDO sobre este atleta.

    const fetchAthleteData = async () => {
        // ROTA A SER CRIADA: Busca todos os dados consolidados do atleta
        try {
            const response = await fetch(`http://localhost:3001/athlete/details/${userId}`);
            const data = await response.json();
            // setAthleteData(data); // Simulação dos dados
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar dados do atleta:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchAthleteData();
        }
    }, [userId]);

    if (loading) {
        return <div>Carregando dados do atleta...</div>;
    }

    // SIMULAÇÃO DO NOME (Substituirá o nome real após a rota ser criada)
    const athleteName = "Detalhes do Atleta (ID: " + userId + ")";

    return (
        <div className="athlete-details-container">
            <button onClick={onBack} className="back-button">
                ← Voltar para a Lista de Atletas
            </button>
            <h1 className="athlete-title">Visualizando: {athleteName}</h1>
            <p>Este painel consolidará Pagamentos, Notas e Documentos de {athleteName}.</p>
            
            <hr />
            
            {/* --- 1. GERENCIAMENTO DE NOTAS (Mover o formulário para cá) --- */}
            <div className="data-section">
                <h2>Lançamento de Notas</h2>
                {/* O formulário de Lançamento de Notas virá para cá */}
            </div>

            {/* --- 2. GERENCIAMENTO DE PAGAMENTOS (Mover o formulário para cá) --- */}
            <div className="data-section">
                <h2>Gerenciar Pagamentos</h2>
                {/* O formulário de Pagamentos será movido para cá */}
            </div>
            
            <hr />

            {/* --- 3. DOCUMENTOS ENVIADOS --- */}
            <div className="data-section">
                <h2>Documentos Enviados</h2>
                {/* A lista e os botões de exclusão de documentos virão para cá */}
            </div>
        </div>
    );
}

export default AthleteDetails;