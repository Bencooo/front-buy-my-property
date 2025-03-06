import { useState } from "react";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { CONTRACT } from "../../lib/abi2";
import { prepareContractCall } from "thirdweb";

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
            console.warn("Aucune cellule sélectionnée.");
            alert("Veuillez sélectionner une cellule avant de continuer.");
            return;
        }

        if (availability === false) {
            console.warn(`Position (${selectedRow}, ${selectedCol}) déjà vendue.`);
            alert("Cette position est déjà vendue.");
            return;
        }

        try {
            console.log("Préparation de l'appel au contrat...");
            const transaction = prepareContractCall({
                contract: CONTRACT,
                method: "mint",
                params: [BigInt(selectedRow), BigInt(selectedCol)],
            });

            console.log("✅ Transaction préparée :", transaction);

            console.log("🚀 Envoi de la transaction au relayer avec gasless...");

            sendTx(transaction, {
                gasless: {
                    openzeppelin: {
                        relayerUrl: "https://api.defender.openzeppelin.com/actions/1e8d2e3c-f10a-4f30-8ed5-55686911e6b2/runs/webhook/b6568a46-0cc5-47d0-b65f-d620af5cbc18/54XL1Lxjy4imK5fNVe4Pv8",
                        relayerForwarderAddress: "0xea18b61584D778DDDb9EC529cC89928Ad1Ec319a",
                    }
                },
                onSuccess: (data) => {
                    console.log("Transaction réussie :", data);
                    console.log("✅ Transaction réussie :", data);
                    console.log("🔍 Vérifie l'adresse sur Etherscan :", `https://sepolia.etherscan.io/tx/${data.transactionHash}`);
                },
                onError: (error) => {
                    console.error("Erreur lors de l'envoi de la transaction :", error);

                alert("Erreur lors de l'envoi de la transaction. Consulte la console.");
                },
            });

            console.log("Transaction envoyée au relayer.");

            alert("Position mintée avec succès !");
        } catch (error) {
            console.error("Erreur lors du mint :", error);
            alert("Une erreur est survenue. Consultez la console pour plus de détails.");
        }
    };


    return (
        <div className="flex" style={{ display: "flex", gap: "20px", justifyContent: "center", alignItems: "center" }}>
            {/* Grille avec l'image de fond */}
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

            {/* Boîte de détails et bouton */}
            <div
                style={{
                    backgroundColor: "#5f8c61",
                    height: "636px",
                    width: "333px",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h2 style={{ color: "#ffffff", textAlign: "center" }}>Détails des cellules sélectionnées</h2>
                {selectedRow !== null && selectedCol !== null ? (
                    <p style={{ color: "#ffffff", textAlign: "center" }}>
                        Position : Ligne {selectedRow}, Colonne {selectedCol} <br />
                        Statut : {isLoading ? "Chargement..." : availability === false ? "Vendu" : "Disponible"}
                    </p>
                ) : (
                    <p style={{ color: "#555", textAlign: "center" }}>Aucune cellule sélectionnée</p>
                )}

                <button
                    onClick={handleMint}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        width: "100%",
                        fontSize: "16px",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginTop: "auto",
                    }}
                >
                    Acheter
                </button>
            </div>
        </div>
    );
};

export default Grid;

