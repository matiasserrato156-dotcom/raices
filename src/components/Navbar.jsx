import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm px-4">
      <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
        <img src="https://i.imgur.com/3Z66p93.png" alt="Raíces Logo" style={{ width: "40px", height: "40px", objectFit: "contain" }} />
        <span className="fw-bold" style={{ color: "#1e4620", letterSpacing: "1px" }}>RAÍCES</span>
      </Link>
      <div className="ms-auto d-flex gap-3 align-items-center">
        <Link className="text-dark text-decoration-none" to="/">Inicio</Link>
        <Link className="text-dark text-decoration-none" to="/artesanias">Artesanías</Link>
        <Link className="text-dark text-decoration-none" to="/experiencias">Experiencias</Link>
        <Link className="text-dark text-decoration-none" to="/mapa">Mapa Cultural</Link>
        <Link className="btn btn-outline-success btn-sm ms-2" to="/login">Iniciar sesión</Link>
      </div>
    </nav>
  );
}
