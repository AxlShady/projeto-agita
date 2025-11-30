// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/publico/Home";
import About from "./pages/publico/About";
import Events from "./pages/publico/Events";
import Gallery from "./pages/publico/Gallery";
import AdminDashboard from "./pages/AdminDashboard";
import AthleteDashboard from "./pages/AthleteDashboard";

function App() {
  const [user, setUser] = useState(undefined); 
  // ⬆️ IMPORTANTE: começa como undefined (para mostrar loading)

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    else setUser(null);
  }, []);

  const handleLoginSuccess = (loggedUser) => {
    setUser(loggedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  // 🔥 Enquanto o user não for carregado → não renderiza as rotas
  if (user === undefined) {
    return <div>Carregando...</div>;
  }

  return (
    <Router>
      <Routes>
        
        {/* ROTAS PÚBLICAS */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />

        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />

        {/* 🔐 ROTA ADMIN PROTEGIDA */}
        <Route
          path="/admindashboard"
          element={
            user?.user_type === "admin"
              ? <AdminDashboard user={user} onLogout={handleLogout} />
              : <Navigate to="/login" />
          }
        />

        {/* 🔐 ROTA ATLETA PROTEGIDA */}
        <Route
          path="/athletedashboard"
          element={
            user?.user_type === "atleta"
              ? <AthleteDashboard user={user} onLogout={handleLogout} />
              : <Navigate to="/login" />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
