import React, { useState, useEffect } from 'react';
import AthleteRegistrationForm from '../AthleteRegistrationForm';
import '../ReportTable.css'; // Usando o CSS de tabelas que já temos

function TabCadastro() {
    const [atletas, setAtletas] = useState([]);
    
    // Estados para edição
    const [editingId, setEditingId] = useState(null);
    const [editCategory, setEditCategory] = useState('');
    const [editDate, setEditDate] = useState('');

    // Carregar lista de atletas
    const loadAthletes = async () => {
        try {
            const response = await fetch('http://localhost:3001/users/athletes');
            const data = await response.json();
            setAtletas(data);
        } catch (error) {
            console.error("Erro ao buscar atletas", error);
        }
    };

    useEffect(() => {
        loadAthletes();
    }, []);

    // Função chamada quando um novo atleta é cadastrado com sucesso
    const handleSuccess = () => {
        loadAthletes(); // Recarrega a lista
        alert("Atleta cadastrado!");
    };

    // Iniciar edição
    const startEdit = (atleta) => {
        setEditingId(atleta.id);
        setEditCategory(atleta.category || 'Mirim');
        // Formata data para o input date (YYYY-MM-DD)
        const rawDate = atleta.admission_date ? new Date(atleta.admission_date).toISOString().split('T')[0] : '';
        setEditDate(rawDate);
    };

    // Salvar edição
    const saveEdit = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: editCategory,
                    admission_date: editDate
                })
            });

            if (response.ok) {
                setEditingId(null);
                loadAthletes(); // Atualiza a tabela
            } else {
                alert("Erro ao salvar.");
            }
        } catch (error) {
            console.error("Erro na atualização", error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    };

    return (
        <div className="tab-container">
            {/* PARTE 1: NOVO CADASTRO */}
            <div style={{ marginBottom: '40px' }}>
                <AthleteRegistrationForm onRegisterSuccess={handleSuccess} />
            </div>

            <hr style={{ border: '0', borderTop: '1px solid #ddd', margin: '30px 0' }} />

            {/* PARTE 2: GERENCIAR/EDITAR ATLETAS */}
            <h3 className="table-title">Gerenciar Categorias de Atletas ({atletas.length})</h3>
            
            <div className="table-responsive">
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Categoria Atual</th>
                            <th>Atleta Desde</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {atletas.map(atleta => (
                            <tr key={atleta.id}>
                                <td>{atleta.username}</td>
                                
                                {/* Lógica de Edição Inline */}
                                {editingId === atleta.id ? (
                                    <>
                                        <td>
                                            <select 
                                                value={editCategory} 
                                                onChange={(e) => setEditCategory(e.target.value)}
                                                className="status-select"
                                            >
                                                <option value="Mirim">Mirim</option>
                                                <option value="Pré-Infantil">Pré-Infantil</option>
                                                <option value="Infantil">Infantil</option>
                                                <option value="Juvenil">Juvenil</option>
                                                <option value="Adulto">Adulto</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input 
                                                type="date" 
                                                value={editDate} 
                                                onChange={(e) => setEditDate(e.target.value)}
                                                style={{ padding: '5px' }}
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => saveEdit(atleta.id)} className="btn-submit" style={{ padding: '5px 10px', fontSize: '0.9rem' }}>Salvar</button>
                                            <button onClick={() => setEditingId(null)} className="btn-delete" style={{ marginLeft: '5px' }}>Cancelar</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td><span className="status-badge paid" style={{backgroundColor: '#e6f7ff', color: '#0050b3', border: '1px solid #91d5ff'}}>{atleta.category || "Sem categoria"}</span></td>
                                        <td>{formatDate(atleta.admission_date)}</td>
                                        <td>
                                            <button onClick={() => startEdit(atleta)} className="btn-submit" style={{ backgroundColor: '#2c3e50', padding: '5px 10px' }}>Editar</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TabCadastro;