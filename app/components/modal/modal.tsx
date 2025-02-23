import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(10px)", // Effet de flou
        zIndex: 1000,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, rgba(0, 100, 200, 0.9), rgba(0, 50, 100, 0.9))",
          padding: "25px",
          borderRadius: "12px",
          width: "420px",
          textAlign: "center",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
          color: "#fff",
          fontFamily: "Arial, sans-serif",
          animation: "fadeIn 0.3s ease-in-out",
        }}
      >
        <h2 style={{ marginBottom: "10px", fontSize: "22px", fontWeight: "bold" }}>🌍 Détails du Pays</h2>

        <div style={{ marginBottom: "15px", fontSize: "16px", opacity: 0.9 }}>
          {children}
        </div>

        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          style={{
            marginTop: "10px",
            padding: "10px 18px",
            backgroundColor: "rgba(255, 50, 50, 0.8)",
            color: "#fff",
            fontSize: "14px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "0.3s ease-in-out",
            boxShadow: "0px 4px 12px rgba(255, 0, 0, 0.3)",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(200, 30, 30, 0.9)")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 50, 50, 0.8)")}
        >
          ❌ Fermer
        </button>
      </div>
    </div>
  );
};

export default Modal;
