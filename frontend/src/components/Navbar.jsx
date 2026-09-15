import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("usuario");

    navigate("/login");
    window.location.reload();
  };

  const puedeAgregarProducto =
    user &&
    ["admin", "artesano", "emprendedor"].includes(user.role);

  return (
    <nav
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #ddd",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* LOGO */}
      <Link
        to="/inicio"
        style={{
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "24px",
          color: "#7a4b2a",
        }}
      >
        RAÍCES
      </Link>

      {/* MENÚ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
          flexWrap: "wrap",
        }}
      >
        <Link to="/inicio">Inicio</Link>

        <Link to="/productos">Productos</Link>

        {puedeAgregarProducto && (
          <Link
            to="/admin/productos"
            style={{
              background: "#7a4b2a",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            + Agregar producto
          </Link>
        )}

        <Link to="/pedidos">Pedidos</Link>

        <Link to="/favoritos">Favoritos</Link>

        <Link to="/carrito">🛒 Carrito</Link>

        <Link to="/perfil">Perfil</Link>

        <Link to="/videos">Videos</Link>

        {user?.role === "admin" && (
          <Link
            to="/admin"
            style={{
              fontWeight: "600",
              color: "#8b0000",
            }}
          >
            Administración
          </Link>
        )}

        {token && (
          <button
            onClick={cerrarSesion}
            style={{
              border: "none",
              background: "#eee",
              padding: "8px 14px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  );
}