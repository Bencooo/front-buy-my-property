import Image from "next/image";
import React from "react";
import { ConnectButton } from "thirdweb/react";
import { client } from "../../client";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-black text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <span className="text-xl font-semibold">BUY MY PROPERTY</span>
        </div>

        {/* Menu */}
        <nav className="flex space-x-8">
          <a href="#home" className="hover:text-gray-400">Home</a>
          <a href="#about" className="hover:text-gray-400">About</a>
          <a href="#services" className="hover:text-gray-400">Services</a>
          <a href="#contact" className="hover:text-gray-400">Contact</a>
        </nav>

        {/* Login Button */}
        <ConnectButton client={client} />
      </div>
    </header>
  );
}

export default Header;

