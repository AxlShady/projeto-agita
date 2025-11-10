// frontend/src/components/dashboard/TabCadastro.jsx

import React from 'react';
// Importamos o formulário, mas agora de um caminho "irmão"
import AthleteRegistrationForm from '../AthleteRegistrationForm.jsx';

// Este componente recebe os dados e as funções que ele precisa via "props"
function TabCadastro({ athletes, onRegistrationSuccess, onSelectAthlete }) {
  return (
    <div className="tab-content">
      <AthleteRegistrationForm onRegistrationSuccess={onRegistrationSuccess} />

      <hr className="separator" />

      <h2 className="section-title">Atletas Cadastrados ({athletes.length})</h2>
      <div className="athletes-list">
        {athletes.length > 0 ? (
          athletes.map((athlete) => (
            <div 
              key={athlete.id} 
              className="athlete-item" 
              onClick={() => onSelectAthlete(athlete.id)} // Usa a prop
            >
              <strong>Matrícula {athlete.id}:</strong> {athlete.username} 
              <span className="details-link">Visualizar Detalhes →</span>
            </div>
          ))
        ) : ( <p>Nenhum atleta cadastrado ainda.</p> )}
      </div>
    </div>
  );
}

export default TabCadastro;