import React from 'react';
import './ReportTable.css'; 

function ReportTable({ reportType, data, onDelete }) {
  
  // Define as colunas a serem exibidas na tabela
  const getColumns = () => {
    if (reportType === 'grades') {
      return [
        { header: 'Atleta', key: 'atleta_nome' },
        { header: 'Evento', key: 'evento_nome' },
        { header: 'Categoria', key: 'categoria_idade' },
        { header: 'Aparelho', key: 'aparelho_nome' },
        { header: 'Nota', key: 'score' },
        { header: 'Data', key: 'evaluation_date' },
      ];
    }
    if (reportType === 'payments') {
      return [
        { header: 'Atleta', key: 'atleta_nome' },
        { header: 'Mês Ref.', key: 'payment_month' },
        { header: 'Status', key: 'status' },
        { header: 'Data Venc.', key: 'due_date' },
        { header: 'Comprovante', key: 'proof_filename' },
      ];
    }
    return [];
  };

  const columns = getColumns();
  const reportTitle = reportType === 'grades' ? 'Histórico de Notas' : 'Histórico de Pagamentos';

  // Se não houver dados, mostre uma mensagem
  if (data.length === 0) {
      return <p style={{ textAlign: 'center', marginTop: '20px' }}>Nenhum registro encontrado.</p>;
  }


  return (
    <div className="report-table-container">
      <h3 style={{ color: '#002244', marginBottom: '15px' }}>{reportTitle} ({data.length})</h3>
      <table className="report-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.header}</th>
            ))}
            {/* Coluna para ações (ex: Excluir) */}
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map(col => (
                <td key={col.key}>
                  {/* Formata a data (remove o fuso horário Z e o T) */}
                  {col.key.includes('date') ? String(item[col.key]).split('T')[0] : item[col.key]}
                </td>
              ))}
              <td>
                <button 
                  onClick={() => onDelete(item.id)} 
                  className="report-delete-button"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportTable;