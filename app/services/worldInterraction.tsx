/*"use client";

import { useContract, useContractWrite, useAddress } from "@thirdweb-dev/react";
import { useState } from "react";
import { worldAbi } from "../lib/world_abi";

const PROXY_ADDRESS = "0xF222BcA8d89c3fB5f4788c9b7602dd367A8C2B3C"; // Adresse du contrat Proxy

export const WorldInteraction: React.FC = () => {
    const [x, setX] = useState<number>(0);
    const [y, setY] = useState<number>(0);
    const address = useAddress();

    console.log("Adresse du contrat Proxy :", PROXY_ADDRESS);
    console.log("ABI utilisée :", worldAbi);


    const { contract } = useContract(PROXY_ADDRESS, worldAbi);
    console.log("Contrat récupéré :", contract);
    const { mutateAsync: mint, isLoading } = useContractWrite(contract, "mint");

    const handleMint = async () => {
        if (!contract) {
            return <div>Chargement du contrat...</div>;
        }

        if (!address) {
            console.error("Connectez votre wallet pour effectuer un mint.");
            return;
        }
        try {
            await mint({ args: [x, y] });
            console.log("Mint réussi !");
        } catch (error) {
            console.error("Erreur lors du mint :", error);
        }
    };

    return (
        <div>
            <h2>Mint une Position</h2>
            <input type="number" placeholder="x" value={x} onChange={(e) => setX(Number(e.target.value))} />
            <input type="number" placeholder="y" value={y} onChange={(e) => setY(Number(e.target.value))} />
            <button onClick={handleMint} disabled={isLoading}>
                {isLoading ? "Mint en cours..." : "Mint"}
            </button>
        </div>
    );
};*/


/*"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ethers } from "ethers";
import { useState } from "react";
import { worldAbi } from "../lib/world_abi"; // Importez l'ABI de votre contrat

const WORLD_CONTRACT_ADDRESS = "0xF222BcA8d89c3fB5f4788c9b7602dd367A8C2B3C"; // Adresse du contrat Proxy

export default function WorldInteraction() {
    // Wagmi récupère l'info de connexion
    const { address, isConnected } = useAccount();
  
    // Gérer X/Y dynamiquement via des inputs
    const [x, setX] = useState<number>(0);
    const [y, setY] = useState<number>(0);
  
    // Lire une fonction "getNumberOfProperties" via useReadContract
    const { data: numberOfProperties, refetch } = useReadContract({
      address: WORLD_CONTRACT_ADDRESS,
      abi: worldAbi,
      functionName: "getNumberOfProperties",
      // watch: true // si tu veux mettre à jour constamment à chaque bloc
    });
  
    // Écrire via "useWriteContract" -> on récupère la fonction `writeContract`
    const { writeContract } = useWriteContract();
  
    // Handler pour le mint
    const handleMint = async () => {
      if (!isConnected) {
        alert("Veuillez connecter votre wallet (wagmi) pour signer la transaction.");
        return;
      }
      try {
        // On appelle writeContract(...) avec le détail de la fonction "mint(x, y)"
        const tx = await writeContract({
          abi: worldAbi,
          address: WORLD_CONTRACT_ADDRESS,
          functionName: "mint",
          args: [x, y], // arguments pour la fonction mint
        });
  
        console.log("Transaction envoyée :", tx);
        alert(`Propriété mintée en (${x}, ${y}) !`);
  
        // Actualiser le nombre de propriétés après le mint
        refetch();
      } catch (error) {
        console.error("Erreur lors du mint :", error);
        alert("Erreur lors du mint. Consulte la console pour plus de détails.");
      }
    };
  
    return (
      <div style={{ color: "#fff", marginTop: "2rem" }}>
        <h3>Interaction avec le contrat World</h3>
        <p>
          Adresse connectée : {address || "Aucune"}<br />
          Nombre de propriétés : {numberOfProperties?.toString() || "Chargement..."}
        </p>
  
        <div style={{ marginTop: "1rem" }}>
          <label style={{ marginRight: "0.5rem" }}>
            X:
            <input
              type="number"
              value={x}
              onChange={(e) => setX(Number(e.target.value))}
              style={{ marginLeft: "0.25rem" }}
            />
          </label>
  
          <label style={{ marginRight: "0.5rem" }}>
            Y:
            <input
              type="number"
              value={y}
              onChange={(e) => setY(Number(e.target.value))}
              style={{ marginLeft: "0.25rem" }}
            />
          </label>
  
          <button onClick={handleMint}>
            Mint
          </button>
        </div>
      </div>
    );
  }*/

import { TransactionButton, useReadContract } from "thirdweb/react";
import { CONTRACT } from "../lib/abi2";
import { prepareContractCall } from "thirdweb";
import React, { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { useSendTransaction } from "thirdweb/react";


const WorldInteraction: React.FC = () => {
    const activeAccount = useActiveAccount();
    console.log("address", activeAccount?.address);

    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [x, setX] = useState<number>(0);
    const [y, setY] = useState<number>(0);
    const xBigInt = BigInt(x);
    const yBigInt = BigInt(y);

    const { data: world, isLoading: loadindWorld, refetch } = useReadContract({
        contract: CONTRACT,
        method: "getNumberOfProperties",
    })

    const { data: availability, isLoading } = useReadContract({
        contract: CONTRACT,
        method: "isPositionAvailable",
        params: [x, y],
    });

    const handleCheck = () => {
        setIsAvailable(availability);
    };

    const { mutate: sendTx, data: transactionResult } =
        useSendTransaction();

    const handleMint = async () => {
        try {
            // Convertir les paramètres en bigint
            const xBigInt = BigInt(x);
            const yBigInt = BigInt(y);

            // Préparer l'appel à la fonction mint
            const transaction = prepareContractCall({
                contract: CONTRACT,
                method: "mint",
                params: [xBigInt, yBigInt],
            });

            // Envoyer la transaction
            sendTx(transaction, {
                onSuccess: (data) => {
                    console.log("Transaction réussie :", data);
                    alert(`Propriété mintée avec succès : (${x}, ${y})`);
                },
                onError: (err) => {
                    console.error("Erreur lors du mint :", err);
                    alert("Erreur lors du mint.");
                },
            });
        } catch (err) {
            console.error("Erreur lors de la préparation de la transaction :", err);
            alert("Erreur lors de la préparation de la transaction.");
        }
    };




    return (
        <div>
            <h1>World</h1>
            <div>
                <h3>Adresse connectée :</h3>
                <p>{activeAccount?.address || "Aucune adresse connectée"}</p>
            </div>
            {loadindWorld ? (
                <h2>...</h2>
            ) : (
                <h2>{world?.toString()}</h2>
            )}
            <div>
                <div style={{ color: "#fff", padding: "2rem" }}>
                    <h2>Mint une Propriété</h2>

                    <div style={{ marginBottom: "1rem" }}>
                        <label>
                            X:
                            <input
                                type="number"
                                value={x}
                                onChange={(e) => setX(Number(e.target.value))}
                                style={{ marginLeft: "0.5rem", marginRight: "1rem" }}
                            />
                        </label>
                        <label>
                            Y:
                            <input
                                type="number"
                                value={y}
                                onChange={(e) => setY(Number(e.target.value))}
                                style={{ marginLeft: "0.5rem" }}
                            />
                        </label>
                    </div>

                    <button
                        onClick={handleMint}
                        style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#555",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                        }}
                    >
                    </button>
                </div>
                <div style={{ color: "#fff", padding: "2rem" }}>
                    <h2>Vérifier la Disponibilité d'une Position</h2>

                    <div style={{ marginBottom: "1rem" }}>
                        <label>
                            X:
                            <input
                                type="number"
                                value={x}
                                onChange={(e) => setX(Number(e.target.value))}
                                style={{ marginLeft: "0.5rem", marginRight: "1rem" }}
                            />
                        </label>
                        <label>
                            Y:
                            <input
                                type="number"
                                value={y}
                                onChange={(e) => setY(Number(e.target.value))}
                                style={{ marginLeft: "0.5rem" }}
                            />
                        </label>
                    </div>

                    <button
                        onClick={handleCheck}
                        style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Vérifier
                    </button>

                    {isLoading ? (
                        <p>Chargement...</p>
                    ) : (
                        isAvailable !== null && (
                            <p>
                                La position ({x}, {y}) est{" "}
                                {isAvailable ? "DISPONIBLE ✅" : "OCCUPÉE ❌"}.
                            </p>
                        )
                    )}
                </div>
            </div>
        </div>
    )
};

export default WorldInteraction;
