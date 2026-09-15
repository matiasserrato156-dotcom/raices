import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const validarCorreo = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    const correo = email.trim();

    if (!correo) {
      setError("Ingresa tu correo electrónico.");
      return;
    }

    if (!validarCorreo(correo)) {
      setError("El formato del correo electrónico no es válido.");
      return;
    }

    if (!password) {
      setError("Ingresa tu contraseña.");
      return;
    }

    setCargando(true);

    try {
      const response = await api.post("/login", {
        email: correo,
        password,
      });

      const token = response.data?.token;
      const user = response.data?.user;

      if (!token) {
        setError("El servidor no devolvió un token de acceso.");
        return;
      }

      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      // Después del login vamos directamente a la aplicación.
      navigate("/inicio", { replace: true });
    } catch (err) {
      console.error("Error de login:", err);

      if (err.response?.status === 401) {
        setError("El correo o la contraseña son incorrectos.");
      } else if (err.response?.status === 422) {
        setError(
          err.response?.data?.message ||
            "Revisa los datos ingresados."
        );
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          "No se pudo conectar con el servidor. Verifica que Laravel esté funcionando."
        );
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center px-3 py-5"
      style={{
        background:
          "linear-gradient(135deg, #f5f1e8 0%, #fcfbf9 45%, #e8f3eb 100%)",
      }}
    >
      <div
        className="card border-0 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "430px",
          borderRadius: "24px",
          overflow: "hidden",
        }}
      >
        {/* Encabezado */}
        <div
          className="text-center px-4 pt-5 pb-4"
          style={{
            background:
              "linear-gradient(145deg, #1e4620 0%, #2d6a4f 100%)",
          }}
        >
          <div
            className="mx-auto d-flex align-items-center justify-content-center mb-3"
            style={{
              width: "105px",
              height: "105px",
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              boxShadow: "0 8px 25px rgba(0,0,0,0.18)",
            }}
          >
            <img
              src="/logo-raices.png"
              alt="Logo oficial RAÍCES"
              style={{
                width: "82px",
                height: "82px",
                objectFit: "contain",
              }}
            />
          </div>

          <h1
            className="fw-bold mb-1"
            style={{
              color: "#fcfbf9",
              letterSpacing: "2px",
            }}
          >
            RAÍCES
          </h1>

          <p
            className="mb-0"
            style={{
              color: "#d8f3dc",
              fontSize: "0.95rem",
            }}
          >
            Conecta • Descubre • Aprende
          </p>
        </div>

        {/* Formulario */}
        <div className="p-4 p-md-5">
          <div className="text-center mb-4">
            <h2
              className="fw-bold mb-1"
              style={{ color: "#1e4620" }}
            >
              Bienvenido
            </h2>

            <p className="text-muted small mb-0">
              Ingresa a tu cuenta para continuar
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="alert alert-danger d-flex align-items-start gap-2 small"
              role="alert"
            >
              <i className="bi bi-exclamation-circle-fill mt-1"></i>

              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Correo */}
            <div className="mb-3">
              <label
                htmlFor="email"
                className="form-label fw-semibold"
                style={{ color: "#344e41" }}
              >
                <i className="bi bi-envelope me-2"></i>
                Correo electrónico
              </label>

              <input
                id="email"
                type="email"
                className="form-control form-control-lg"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={cargando}
                required
                style={{
                  borderRadius: "12px",
                  borderColor: "#d8e2dc",
                }}
              />
            </div>

            {/* Contraseña */}
            <div className="mb-2">
              <label
                htmlFor="password"
                className="form-label fw-semibold"
                style={{ color: "#344e41" }}
              >
                <i className="bi bi-lock me-2"></i>
                Contraseña
              </label>

              <div className="input-group">
                <input
                  id="password"
                  type={mostrarPassword ? "text" : "password"}
                  className="form-control form-control-lg"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={cargando}
                  required
                  style={{
                    borderRadius: "12px 0 0 12px",
                    borderColor: "#d8e2dc",
                  }}
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setMostrarPassword(!mostrarPassword)
                  }
                  disabled={cargando}
                  title={
                    mostrarPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  style={{
                    borderRadius: "0 12px 12px 0",
                    borderColor: "#d8e2dc",
                  }}
                >
                  <i
                    className={
                      mostrarPassword
                        ? "bi bi-eye-slash"
                        : "bi bi-eye"
                    }
                  ></i>
                </button>
              </div>
            </div>

            {/* Recuperar contraseña */}
            <div className="text-end mb-4 mt-2">
              <Link
                to="/recuperar-password"
                className="small text-decoration-none fw-semibold"
                style={{ color: "#2d6a4f" }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="btn w-100 text-white fw-bold py-3"
              disabled={cargando}
              style={{
                background:
                  "linear-gradient(135deg, #2d6a4f, #1e4620)",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 6px 15px rgba(45,106,79,0.25)",
              }}
            >
              {cargando ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>

                  Iniciando sesión...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Iniciar sesión
                </>
              )}
            </button>
          </form>

          {/* Registro */}
          <div className="text-center mt-4">
            <p className="small text-muted mb-0">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/registro"
                className="text-decoration-none fw-bold"
                style={{ color: "#2d6a4f" }}
              >
                Regístrate
              </Link>
            </p>
          </div>

          {/* Pie */}
          <div className="text-center mt-4 pt-3 border-top">
            <small className="text-muted">
              Plataforma Artesanal • Proyecto SENA ADSO
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}