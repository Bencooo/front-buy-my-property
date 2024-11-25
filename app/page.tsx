"use client";
import Image from "next/image";
import { client } from "./client";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import Map from "./components/map/map";
import Grid from "./components/map/map";
import CellDetails from "./components/map/cellDetails";

export default function Home() {
  const account = useActiveAccount();
  const chain = {
    rpc: process.env.NEXT_PUBLIC_RPC,
  };
  const { data: balance, isLoading } = useWalletBalance({
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
      <Grid />
    </div>
  );
}
