import React from "react";

export default function Home() {
  return (
    <div className="container py-5">
      <div className="text-center p-5 mb-5 bg-white rounded shadow-sm border">
        <img src="https://i.imgur.com/3Z66p93.png" alt="Raíces Logotipo" style={{ width: "150px", height: "auto", marginBottom: "15px" }} />
        <h1 className="fw-bold text-success display-5">Raíces</h1>
        <p className="text-muted fs-5">Conecta • Descubre • Aprende</p>
        <hr className="w-25 mx-auto my-3" />
        <div className="d-flex justify-content-center gap-4 text-secondary fw-bold my-3">
          <span>🛍️ COMPRA</span>
          <span>📍 EXPLORA</span>
          <span>📖 APRENDE</span>
          <span>⭐ APOYA</span>
        </div>
        <p className="text-muted fst-italic small">Preservamos cultura, impulsamos tradiciones</p>
      </div>
    </div>
  );
}
