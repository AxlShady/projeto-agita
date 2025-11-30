import React, { useState } from "react";
// IMPORTANTE: Importamos o 'Link' para o botão de voltar
import { useNavigate, Link } from "react-router-dom"; 
import './Login.css'; 
import logo from '../assets/logo.png'; 

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            username: username.trim(), 
            password: password.trim() 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        if (onLoginSuccess) onLoginSuccess(data.user);

        // Redirecionamento e garantia de que o usuário não volte para a tela de login ao clicar em voltar
        if (data.user.user_type === "admin") {
          // Usa 'replace: true' para garantir que o usuário não volte para a tela de login
          navigate("/admindashboard", { replace: true }); 
        } else if (data.user.user_type === "atleta") {
          navigate("/athletedashboard", { replace: true });
        } else {
          setError("Tipo de usuário desconhecido.");
        }
      } else {
        setError(data.message || "Usuário ou senha incorretos.");
      }
    } catch (err) {
      console.error("Erro de conexão:", err);
      setError("Não foi possível conectar ao servidor.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        <div className="login-brand">
          <img src={logo} alt="Logo Agita" className="login-logo" />
          <h2>AGITA <span className="brand-highlight">Login</span></h2>
          <p>Bem-vindo de volta</p>
        </div>

        <form className="login-form-content" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Usuário</label>
            <input
              type="text"
              className="styled-input"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              className="styled-input"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-alert">{error}</div>}
          
          {/* BOTÃO PRINCIPAL */}
          <button type="submit" className="btn-login">ENTRAR</button>

          {/* NOVO LINK: VOLTAR PARA O INÍCIO */}
          <Link to="/" className="link-voltar">Voltar à Página Inicial</Link>
        
        </form>
      </div>
    </div>
  );
}

export default Login; 