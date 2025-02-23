import { useState } from "react";
import { useSendTransaction } from "thirdweb/react";
import { CONTRACT } from "../../lib/abi2";
import { prepareContractCall } from "thirdweb";
import GlobeComponent from "../globe/globe";
import Modal from "../modal/modal"; // Composant de pop-up

const GlobePage: React.FC = () => {
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [selectedX, setSelectedX] = useState<number | null>(null);
    const [selectedY, setSelectedY] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const { mutate: sendTx } = useSendTransaction();

    /** 🌍 Sélection d'un pays **/
    const handleCountrySelect = (polygon: any, x: number, y: number) => {
        const countryName = polygon?.properties?.name;
        console.log(`✅ Pays sélectionné : ${countryName} (X=${x}, Y=${y})`);

        setSelectedCountry(countryName);
        setSelectedX(x);
        setSelectedY(y);
        setIsModalOpen(true); // Ouvre directement la pop-up sans vérification
    };

    /** 🏗️ Fonction de Mint **/
    const handleMint = async () => {
        if (!selectedCountry || selectedX === null || selectedY === null) {
            alert("Veuillez sélectionner un pays avant de continuer.");
            return;
        }

        try {
            console.log("✅ Préparation de la transaction...");
            const transaction = prepareContractCall({
                contract: CONTRACT,
                method: "mint",
                params: [BigInt(selectedX), BigInt(selectedY)],
            });

            console.log("🚀 Envoi de la transaction...");
            sendTx(transaction, {
                gasless: {
                    openzeppelin: {
                        relayerUrl: "https://api.defender.openzeppelin.com/actions/XXXXX/runs/webhook/XXXXX",
                        relayerForwarderAddress: "0xea18b61584D778DDDb9EC529cC89928Ad1Ec319a",
                    }
                },
                onSuccess: (data) => {
                    console.log("✅ Transaction réussie :", data);
                    console.log("🔍 Vérifie sur Etherscan :", `https://sepolia.etherscan.io/tx/${data.transactionHash}`);
                    alert(`✅ Félicitations ! Vous avez acheté ${selectedCountry}.`);
                    setIsModalOpen(false); // Ferme la pop-up après achat
                },
                onError: (error) => {
                    console.error("❌ Erreur lors du mint :", error);
                    
                    // 🔥 Vérifie si la position est déjà mintée
                    const errorMessage = error?.message || "";
                    if (errorMessage.includes("POSITION_ALREADY_USED")) {
                        alert(`❌ Ce pays a déjà été acheté !`);
                    } else {
                        alert("❌ Une erreur est survenue lors du mint. Consulte la console.");
                    }
                },
            });
        } catch (error) {
            console.error("❌ Erreur lors du mint :", error);
            alert("Une erreur est survenue.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-6">
            {/* 🌍 Globe 3D */}
            <div style={{ width: "100%", height: "600px" }}>
                <GlobeComponent onSelect={handleCountrySelect} />
            </div>

            {/* 📌 Pop-up avec les détails */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 style={{ color: "#333", textAlign: "center" }}>Détails du pays</h2>
                {selectedCountry ? (
                    <p style={{ color: "#000", textAlign: "center", marginBottom: "1rem" }}>
                        <strong>{selectedCountry}</strong> <br />
                        📍 Coordonnées : X={selectedX}, Y={selectedY}
                    </p>
                ) : (
                    <p style={{ color: "#000", textAlign: "center" }}>Aucun pays sélectionné</p>
                )}

                {/* 🔘 Bouton Acheter placé ici */}
                <button
                    onClick={handleMint}
                    style={{
                        padding: "0.8rem 1.2rem",
                        backgroundColor: "#00cc66",
                        color: "#fff",
                        fontSize: "16px",
                        fontWeight: "bold",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "0.3s ease-in-out",
                        boxShadow: "0px 4px 12px rgba(0, 255, 100, 0.3)",
                        width: "100%",
                        marginTop: "10px",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#00994d")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#00cc66")}
                >
                    ✅ Acheter
                </button>
            </Modal>
        </div>
    );
};

export default GlobePage;
