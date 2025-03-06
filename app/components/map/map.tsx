import { useState } from 'react';
import CellDetails from './cellDetails';

const rows = 10;
const cols = 10;

const Grid: React.FC = () => {
  const [checkedCells, setCheckedCells] = useState<boolean[][]>(
    Array.from({ length: rows }, () => Array(cols).fill(false))
  );

  // État pour stocker les positions des cellules sélectionnées
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);

  const handleCellClick = (row: number, col: number) => {
    setCheckedCells((prev) => {
      const updated = prev.map(row => [...row]);
      updated[row][col] = !updated[row][col];
      return updated;
    });

    // Ajouter ou supprimer la position de la cellule sélectionnée
    setSelectedCells((prevSelectedCells) => {
      const cellIndex = prevSelectedCells.findIndex(cell => cell.row === row && cell.col === col);

      // Si la cellule est déjà sélectionnée, on la supprime
      if (cellIndex !== -1) {
        return prevSelectedCells.filter((_, index) => index !== cellIndex);
      }

      // Sinon, on l'ajoute
      return [...prevSelectedCells, { row, col }];
    });
  };

  return (
    <div className="flex">
      {/* Grille avec l'image de fond */}
      <div
        style={{
          width: '666px',
          height: '636px',
          backgroundImage: "url('/terrain-background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="grid"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 66.6px)`,
            gridTemplateRows: `repeat(${rows}, 63.6px)`,
            width: '100%',
            height: '100%',
          }}
        >
          {Array.from({ length: rows }).map((_, rowIndex) =>
            Array.from({ length: cols }).map((_, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                style={{
                  backgroundColor: checkedCells[rowIndex][colIndex] ? 'rgba(0, 128, 0, 0.5)' : 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '66.6px',
                  height: '63.6px',
                }}
              >
                {checkedCells[rowIndex][colIndex] ? '✓' : ''}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Affichage des détails des cellules sélectionnées */}
      <CellDetails details={selectedCells} />

    </div>
  );
};

export default Grid;
