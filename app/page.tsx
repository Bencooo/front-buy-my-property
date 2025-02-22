"use client";

import dynamic from "next/dynamic";

// Charger WorldInteraction dynamiquement sans SSR
/*const WorldInteraction = dynamic(
  () => import("./services/worldInterraction").then((mod) => mod.WorldInteraction),
  { ssr: false }
);*/

import { client } from "./client";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import Grid from "./components/map/map";
import WorldInteraction from "./services/worldInterraction";
import Grid2 from "./components/map/map2";

export default function Home() {
  const account = useActiveAccount();
  const chain = {
    id: 1,
    rpc: process.env.NEXT_PUBLIC_RPC || "https://eth-sepolia.g.alchemy.com/v2/53FvNL1iPPzJwpB7P_2I1f1Fk_NpUI0f",
  };
  const { /*data: balance, isLoading*/ } = useWalletBalance({
    client,
    chain,
    address: account?.address,
  });
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundColor: "#2c2c2c", // Fond gris foncé pour toute la page
      }}
    >
      {account ? (
        <div>
          <Grid2 />
          <WorldInteraction />
        </div>
      ) : (
        <p style={{ color: "#fff" }}>
          Veuillez connecter votre wallet pour accéder au contenu
        </p>
      )}
    </div>
  );
}
