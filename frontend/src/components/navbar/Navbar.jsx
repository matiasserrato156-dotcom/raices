
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useCarrito } from "../../context/CarritoContext";
import Reloj from "../Reloj";

function Navbar() {
  const navigate = useNavigate();
  const { cantidadTotal } = useCarrito();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [cantidadFavoritos, setCantidadFavoritos] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const calcularFavoritos = () => {
      try {
        const favs = JSON.parse(
          localStorage.getItem("favoritos_raices") || "[]"
        );

        setCantidadFavoritos(favs.length);
      } catch {
        setCantidadFavoritos(0);
      }
    };

    calcularFavoritos();

    window.addEventListener(
      "favoritosActualizados",
      calcularFavoritos
    );

    return () => {
      window.removeEventListener(
        "favoritosActualizados",
        calcularFavoritos
      );
    };
  }, []);

  useEffect(() => {
    const actualizarUsuario = () => {
      try {
        const savedUser = localStorage.getItem("user");

        setUser(
          savedUser
            ? JSON.parse(savedUser)
            : null
        );
      } catch {
        setUser(null);
      }
    };

    window.addEventListener(
      "usuarioActualizado",
      actualizarUsuario
    );

    window.addEventListener(
      "storage",
      actualizarUsuario
    );

    return () => {
      window.removeEventListener(
        "usuarioActualizado",
        actualizarUsuario
      );

      window.removeEventListener(
        "storage",
        actualizarUsuario
      );
    };
  }, []);

  const handleLogout = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);
      setLoading(false);

      navigate("/login", {
        replace: true,
      });
    }
  };

  const handleChangeAccount = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login", {
      replace: true,
    });
  };

  /*
   * ROLES QUE PUEDEN AGREGAR PRODUCTOS
   */
  const puedeAgregarProducto =
    user &&
    ["admin", "artesano", "emprendedor"].includes(
      String(user.role || "").toLowerCase()
    );

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top shadow-sm">
      <div className="container">

        {/* LOGO */}
        <Link
          to={user ? "/inicio" : "/"}
          className="navbar-brand d-flex align-items-center gap-2 text-decoration-none"
        >
          <img
            src="/logo-raices.png"
            alt="Raíces"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "contain",
            }}
          />

          <span
            className="fw-bold fs-3"
            style={{
              color: "#1e4620",
              letterSpacing: "0.5px",
            }}
          >
            RAÍCES
          </span>
        </Link>

        {/* BOTÓN MOBILE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarRaices"
          aria-controls="navbarRaices"
          aria-expanded="false"
          aria-label="Abrir navegación"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarRaices"
        >

          {/* NAVEGACIÓN PRINCIPAL */}
          <ul className="navbar-nav mx-auto align-items-lg-center">

            <li className="nav-item">
              <Link
                className="nav-link fw-semibold"
                to={user ? "/inicio" : "/"}
              >
                <i className="bi bi-house-door me-1"></i>
                Inicio
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link fw-semibold"
                to="/productos"
              >
                <i className="bi bi-shop me-1"></i>
                Artesanías
              </Link>
            </li>

            {user && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link fw-semibold"
                    to="/experiencias"
                  >
                    <i className="bi bi-stars me-1"></i>
                    Experiencias
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link fw-semibold"
                    to="/mapa"
                  >
                    <i className="bi bi-geo-alt me-1"></i>
                    Mapa Cultural
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link fw-semibold"
                    to="/videos"
                  >
                    <i className="bi bi-play-btn me-1"></i>
                    Videos
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* ACCIONES */}
          <div className="d-flex gap-2 align-items-center mt-3 mt-lg-0 flex-wrap justify-content-end">

            <div className="me-1">
              <Reloj />
            </div>

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-dark"
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Iniciar sesión
                </Link>

                <Link
                  to="/registro"
                  className="btn btn-dark"
                >
                  <i className="bi bi-person-plus me-1"></i>
                  Registrarse
                </Link>
              </>
            ) : (
              <>
                {/* FAVORITOS */}
                <Link
                  to="/favoritos"
                  className="btn btn-outline-dark position-relative"
                  title="Mis favoritos"
                >
                  <i className="bi bi-heart me-1"></i>
                  Favoritos

                  {cantidadFavoritos > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cantidadFavoritos}
                    </span>
                  )}
                </Link>

                {/* CARRITO / CANASTA */}
                <Link
                  to="/carrito"
                  className="btn btn-outline-dark position-relative"
                  title="Mi canasta"
                >
                  <i className="bi bi-bag me-1"></i>
                  Canasta

                  {cantidadTotal > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cantidadTotal}
                    </span>
                  )}
                </Link>

                {/* AGREGAR PRODUCTO */}
                {puedeAgregarProducto && (
                  <Link
                    to="/admin/productos"
                    className="btn btn-success fw-semibold"
                    title="Agregar un nuevo producto"
                  >
                    <i className="bi bi-plus-circle me-1"></i>
                    Agregar producto
                  </Link>
                )}

                {/* PEDIDOS */}
                <Link
                  to="/pedidos"
                  className="btn btn-outline-dark"
                  title="Mis pedidos"
                >
                  <i className="bi bi-receipt me-1"></i>
                  Pedidos
                </Link>

                {/* PERFIL */}
                <Link
                  to="/perfil"
                  className="btn btn-outline-dark"
                  title="Mi perfil"
                >
                  <i className="bi bi-person-circle me-1"></i>
                  Perfil
                </Link>

                {/* ADMINISTRADOR */}
                {user.role === "admin" && (
                  <Link
                    to="/admin/pedidos"
                    className="btn btn-dark"
                    title="Panel de administrador"
                  >
                    <i className="bi bi-speedometer2 me-1"></i>
                    Administrador
                  </Link>
                )}

                {/* CAMBIAR CUENTA */}
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleChangeAccount}
                  title="Cambiar de cuenta"
                >
                  <i className="bi bi-person-switch me-1"></i>
                </button>

                {/* CERRAR SESIÓN */}
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleLogout}
                  disabled={loading}
                  title="Cerrar sesión"
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  {loading ? "Saliendo..." : "Salir"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

