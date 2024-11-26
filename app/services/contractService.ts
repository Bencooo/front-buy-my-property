import { ethers } from "ethers";
import { proxyAbi } from "../lib/abi"

const PROXY_ADDRESS = "0xFE9459FAc8aFAfff60d4B4606cd37799ef72CAE8";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const proxyContract = new ethers.Contract(PROXY_ADDRESS, proxyAbi, signer);

// Appeler une fonction logique via le Proxy
export const callFunctionViaProxy = async (functionName: string, args: any[], abi: any) => {
    try {
      const contractInterface = new ethers.utils.Interface(abi);
      const data = contractInterface.encodeFunctionData(functionName, args);
  
      const tx = await signer.sendTransaction({
        to: PROXY_ADDRESS,
        data,
      });
  
      console.log("Transaction envoyée :", tx.hash);
      await tx.wait();
      console.log(`Appel à ${functionName} effectué avec succès !`);
    } catch (error) {
      console.error(`Erreur lors de l'appel à ${functionName} via le Proxy :`, error);
    }
  };

  // Récupérer l'adresse de l'implémentation actuelle
export const getImplementationAddress = async () => {
    try {
      const implementation = await proxyContract.impl();
      console.log("Adresse de l'implémentation actuelle :", implementation);
      return implementation;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'implémentation :", error);
    }
  };
  