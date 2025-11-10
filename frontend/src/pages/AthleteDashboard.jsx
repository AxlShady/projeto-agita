import React, { useState, useEffect } from "react";
import "./AthleteDashboard.css";

function AthleteDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("dados");
  const [notas, setNotas] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [documentos, setDocumentos] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchNotas = async () => {
      const res = await fetch(`http://localhost:3001/grades/${user.id}`);
      setNotas(await res.json());
    };

    const fetchPagamentos = async () => {
      const res = await fetch(`http://localhost:3001/payments/${user.id}`);
      setPagamentos(await res.json());
    };

    const fetchEventos = async () => {
      const res = await fetch("http://localhost:3001/events");
      setEventos(await res.json());
    };

    const fetchDocumentos = async () => {
      const res = await fetch(`http://localhost:3001/documents/${user.id}`);
      setDocumentos(await res.json());
    };

    fetchNotas();
    fetchPagamentos();
    fetchEventos();
    fetchDocumentos();
  }, [user]);

  const renderContent = () => {
    switch (activeTab) {
      case "dados":
        return <div>Informações pessoais do atleta</div>;
      case "notas":
        return <pre>{JSON.stringify(notas, null, 2)}</pre>;
      case "pagamentos":
        return <pre>{JSON.stringify(pagamentos, null, 2)}</pre>;
      case "documentos":
        return <pre>{JSON.stringify(documentos, null, 2)}</pre>;
      case "eventos":
        return <pre>{JSON.stringify(eventos, null, 2)}</pre>;
      default:
        return <div>Selecione uma aba</div>;
    }
  };

  return (
    <div className="athlete-dashboard">
      <div className="sidebar">
        <h3>AGITA - Atleta</h3>
        <nav>
          <button onClick={() => setActiveTab("dados")} className={activeTab === "dados" ? "active" : ""}>Meus Dados</button>
          <button onClick={() => setActiveTab("notas")} className={activeTab === "notas" ? "active" : ""}>Notas</button>
          <button onClick={() => setActiveTab("pagamentos")} className={activeTab === "pagamentos" ? "active" : ""}>Pagamentos</button>
          <button onClick={() => setActiveTab("documentos")} className={activeTab === "documentos" ? "active" : ""}>Documentos</button>
          <button onClick={() => setActiveTab("eventos")} className={activeTab === "eventos" ? "active" : ""}>Eventos</button>
        </nav>
        <div className="sidebar-footer">
          {user && <p>Logado como: <strong>{user.username}</strong></p>}
          <button onClick={onLogout} className="logout-button">Sair</button>
        </div>
      </div>
      <main className="main-content">{renderContent()}</main>
    </div>
  );
}

export default AthleteDashboard;
