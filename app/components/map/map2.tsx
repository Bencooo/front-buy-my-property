import { useState } from "react";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { CONTRACT } from "../../lib/abi2";

const rows = 10;
const cols = 10;

const Grid: React.FC = () => {
  const [checkedCells, setCheckedCells] = useState<boolean[][]>(
    Array.from({ length: rows }, () => Array(cols).fill(false))
  );

  // État pour suivre les coordonnées sélectionnées
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedCol, setSelectedCol] = useState<number | null>(null);

  // Vérifie la disponibilité de la position
  const { data: availability, isLoading } = useReadContract({
    contract: CONTRACT,
    method: "isPositionAvailable",
    params: selectedRow !== null && selectedCol !== null ? [selectedRow, selectedCol] : undefined, // Vérifie uniquement si les coordonnées sont valides
  });

  const { mutate: sendTx } = useSendTransaction();

  const handleCellClick = (row: number, col: number) => {
    setCheckedCells((prev) => {
      const updated = prev.map((row) => [...row]);
      updated[row][col] = !updated[row][col];
      return updated;
    });

    // Met à jour les coordonnées sélectionnées
    setSelectedRow(row);
    setSelectedCol(col);
  };

  const handleMint = async () => {
    if (selectedRow === null || selectedCol === null) {
      alert("Veuillez sélectionner une cellule avant de continuer.");
      return;
    }

    if (availability === false) {
      alert("Cette position est déjà vendue.");
      return;
    }

    try {
      const transaction = {
        contract: CONTRACT,
        method: "mint",
        params: [BigInt(selectedRow), BigInt(selectedCol)],
      };

      sendTx(transaction, {
        onSuccess: (data) => {
          console.log("Transaction réussie :", data);
        },
        onError: (error) => {
          console.error("Erreur lors de la transaction :", error);
        },
      });

      alert("Position mintée avec succès !");
    } catch (error) {
      console.error("Erreur lors du mint :", error);
      alert("Une erreur est survenue. Consultez la console pour plus de détails.");
    }
  };

  return (
    <div className="flex">
      <div
        style={{
          width: "666px",
          height: "636px",
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
            width: "100%",
            height: "100%",
          }}
        >
          {Array.from({ length: rows }).map((_, rowIndex) =>
            Array.from({ length: cols }).map((_, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                style={{
                  backgroundColor: checkedCells[rowIndex][colIndex]
                    ? availability === false
                      ? "rgba(255, 0, 0, 0.5)" // Rouge si non disponible
                      : "rgba(0, 128, 0, 0.5)" // Vert si sélectionné
                    : "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "66.6px",
                  height: "63.6px",
                }}
              >
                {checkedCells[rowIndex][colIndex] ? "✓" : ""}
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <button
          onClick={handleMint}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Acheter
        </button>
      </div>

      {/* Affichage de l'état de la position sélectionnée */}
      <div style={{ marginTop: "1rem", color: "#fff" }}>
        {selectedRow !== null && selectedCol !== null && (
          <p>
            Position ({selectedRow}, {selectedCol}):{" "}
            {isLoading
              ? "Chargement..."
              : availability === false
              ? "Vendu"
              : "Disponible"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Grid;
