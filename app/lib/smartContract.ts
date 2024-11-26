import { useContract } from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";

/**
 * Hook pour initialiser un contrat avec une adresse spécifique
 * @param contractAddress Adresse du contrat
 * @returns Instance du contrat Thirdweb
 */

export const useSmartContract = (contractAddress: string): { contract: SmartContract | undefined } => {
  const { contract } = useContract(contractAddress);
  return { contract };
};
