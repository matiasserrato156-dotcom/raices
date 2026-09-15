import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaPlusCircle,
  FaUserPlus,
} from "react-icons/fa";
import { useCarrito } from "../../context/CarritoContext";

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { cantidadTotal } = useCarrito();

  useEffect(() => {
    const cargarUsuario = () => {
      try {
        const usuarioGuardado = localStorage.getItem("usuario");

        if (usuarioGuardado) {
          setUsuario(JSON.parse(usuarioGuardado));
        } else {
          setUsuario(null);
        }
      } catch (error) {
        console.error("Error leyendo usuario:", error);
        setUsuario(null);
      }
    };

    cargarUsuario();

    window.addEventListener("storage", cargarUsuario);

    return () => {
      window.removeEventListener("storage", cargarUsuario);
    };
  }, [location]);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");

    setUsuario(null);
    setMenuAbierto(false);

    navigate("/login");
  };

  const esRutaActiva = (ruta) => {
    return location.pathname === ruta;
  };

  const puedeCrearProducto =
    usuario &&
    ["artesano", "emprendedor", "admin"].includes(usuario.role);

  const esAdmin = usuario?.role === "admin";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">

        {/* LOGO */}
        <Link
          to="/"
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          onClick={() => setMenuAbierto(false)}
        >
          <span style={{ fontSize: "1.5rem" }}>🌿</span>
          <span>RAÍCES</span>
        </Link>

        {/* BOTÓN MENÚ MÓVIL */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
        >
          {menuAbierto ? <FaTimes /> : <FaBars />}
        </button>

        <div
          className={`collapse navbar-collapse ${
            menuAbierto ? "show" : ""
          }`}
        >
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">

            {/* PRODUCTOS */}
            <li className="nav-item">
              <Link
                to="/productos"
                className={`nav-link ${
                  esRutaActiva("/productos") ? "active" : ""
                }`}
                onClick={() => setMenuAbierto(false)}
              >
                Productos
              </Link>
            </li>

            {/* EXPERIENCIAS */}
            <li className="nav-item">
              <Link
                to="/experiencias"
                className={`nav-link ${
                  esRutaActiva("/experiencias") ? "active" : ""
                }`}
                onClick={() => setMenuAbierto(false)}
              >
                Experiencias
              </Link>
            </li>

            {/* MAPA CULTURAL */}
            <li className="nav-item">
              <Link
                to="/mapa-cultural"
                className={`nav-link ${
                  esRutaActiva("/mapa-cultural") ? "active" : ""
                }`}
                onClick={() => setMenuAbierto(false)}
              >
                Mapa Cultural
              </Link>
            </li>

            {/* VIDEOS */}
            <li className="nav-item">
              <Link
                to="/videos"
                className={`nav-link ${
                  esRutaActiva("/videos") ? "active" : ""
                }`}
                onClick={() => setMenuAbierto(false)}
              >
                Videos
              </Link>
            </li>

            {/* CREAR PRODUCTO */}
            {puedeCrearProducto && (
              <li className="nav-item">
                <Link
                  to="/crear-producto"
                  className={`nav-link d-flex align-items-center gap-1 ${
                    esRutaActiva("/crear-producto")
                      ? "active"
                      : ""
                  }`}
                  onClick={() => setMenuAbierto(false)}
                >
                  <FaPlusCircle />
                  Crear producto
                </Link>
              </li>
            )}

            {/* ADMINISTRACIÓN */}
            {esAdmin && (
              <li className="nav-item">
                <Link
                  to="/admin/pedidos"
                  className={`nav-link ${
                    location.pathname.startsWith("/admin")
                      ? "active"
                      : ""
                  }`}
                  onClick={() => setMenuAbierto(false)}
                >
                  Administración
                </Link>
              </li>
            )}

            {/* CARRITO */}
            <li className="nav-item ms-lg-2">
              <Link
                to="/carrito"
                className="nav-link position-relative d-flex align-items-center gap-1"
                onClick={() => setMenuAbierto(false)}
                title="Carrito"
              >
                <FaShoppingCart />
                <span>Carrito</span>

                {cantidadTotal > 0 && (
                  <span
                    className="badge bg-danger rounded-pill"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {cantidadTotal}
                  </span>
                )}
              </Link>
            </li>

            {/* USUARIO LOGUEADO */}
            {usuario ? (
              <li className="nav-item d-flex flex-column flex-lg-row align-items-lg-center">

                <button
                  className="btn btn-outline-light btn-sm ms-lg-2 d-flex align-items-center gap-2"
                  onClick={() => {
                    setMenuAbierto(false);
                    navigate("/perfil");
                  }}
                >
                  <FaUser />
                  <span>{usuario.name || "Mi cuenta"}</span>
                </button>

                <button
                  className="btn btn-link nav-link text-danger d-flex align-items-center gap-1 mt-2 mt-lg-0"
                  onClick={cerrarSesion}
                >
                  <FaSignOutAlt />
                  Salir
                </button>

              </li>
            ) : (
              <>
                {/* INICIAR SESIÓN */}
                <li className="nav-item ms-lg-2">
                  <Link
                    to="/login"
                    className="btn btn-outline-light btn-sm"
                    onClick={() => setMenuAbierto(false)}
                  >
                    <FaUser className="me-1" />
                    Iniciar sesión
                  </Link>
                </li>

                {/* REGISTRARSE */}
                <li className="nav-item ms-lg-2">
                  <Link
                    to="/registro"
                    className="btn btn-success btn-sm d-flex align-items-center gap-1"
                    onClick={() => setMenuAbierto(false)}
                  >
                    <FaUserPlus />
                    Registrarse
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}
