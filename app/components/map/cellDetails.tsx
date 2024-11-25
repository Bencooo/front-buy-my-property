interface CellDetailsProps {
    details: { row: number; col: number }[];
  }
  
  const CellDetails: React.FC<CellDetailsProps> = ({ details }) => {
    return (
      <div
        style={{
          backgroundColor: '#5f8c61',
          height: '636px',
          width: '333px',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ color: '#333' }}>Détails des cellules sélectionnées</h2>
        {details.length > 0 ? (
          <ul style={{ color: '#ffffff' }}>
            {details.map((cell, index) => (
              <li key={index}>
                Position - Ligne : {cell.row + 1}, Colonne : {cell.col + 1}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#555' }}>Aucune cellule sélectionnée</p>
        )}
      </div>
    );
  };
  
  export default CellDetails;
  