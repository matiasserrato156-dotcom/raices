import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const validarCorreo = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

function Registro() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    name: "",
    email: "",
    telephone: "",
    document: "",
    password: "",
    password_confirmation: "",
    role: "comprador",
  });

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setError("");
    setMensaje("");
  };

  const manejarRegistro = async (e) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    if (!formulario.name.trim()) {
      setError("Ingresa tu nombre completo.");
      return;
    }

    if (!validarCorreo(formulario.email)) {
      setError("El formato del correo electrónico no es válido.");
      return;
    }

    if (!formulario.telephone.trim()) {
      setError("Ingresa tu número de teléfono.");
      return;
    }

    if (!formulario.document.trim()) {
      setError("Ingresa tu número de documento.");
      return;
    }

    if (!formulario.role) {
      setError("Selecciona un tipo de usuario.");
      return;
    }

    if (formulario.password.length < 8) {
      setError("La contraseña debe tener mínimo 8 caracteres.");
      return;
    }

    if (formulario.password !== formulario.password_confirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);

    try {
      await api.post("/register", formulario);

      setMensaje(
        "¡Cuenta creada correctamente! Ahora puedes iniciar sesión."
      );

      setFormulario({
        name: "",
        email: "",
        telephone: "",
        document: "",
        password: "",
        password_confirmation: "",
        role: "comprador",
      });

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err) {
      console.error("Error registrando usuario:", err);

      if (err.response?.status === 422) {
        const errores = err.response.data?.errors;

        if (errores) {
          const primerError = Object.values(errores)
            .flat()
            .find((mensaje) => mensaje);

          setError(
            primerError ||
              "Revisa los datos ingresados e intenta nuevamente."
          );
        } else {
          setError(
            err.response.data?.message ||
              "Los datos enviados no son válidos."
          );
        }
      } else if (err.response?.status === 500) {
        setError(
          "Ocurrió un error en el servidor. Intenta nuevamente."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "No fue posible crear la cuenta. Intenta nuevamente."
        );
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center py-5"
      style={{
        minHeight: "100vh",
        backgroundColor: "#fcfbf9",
      }}
    >
      <div
        className="card p-4 shadow-sm border-0"
        style={{
          width: "100%",
          maxWidth: "480px",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
        }}
      >
        <div className="text-center mb-4">
          <img
            src="/logo-raices.png"
            alt="Raíces Logo"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "contain",
              marginBottom: "10px",
            }}
          />

          <h2
            className="fw-bold"
            style={{
              color: "#1e4620",
              letterSpacing: "0.5px",
            }}
          >
            RAÍCES
          </h2>

          <p className="text-muted small mb-0">
            Crea tu cuenta y conecta con nuestra cultura
          </p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="alert alert-success py-2 small">
            {mensaje}
          </div>
        )}

        <form onSubmit={manejarRegistro}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary small">
              Nombre completo
            </label>

            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Tu nombre completo"
              value={formulario.name}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary small">
              Correo electrónico
            </label>

            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="correo@ejemplo.com"
              value={formulario.email}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold text-secondary small">
                Teléfono
              </label>

              <input
                type="tel"
                name="telephone"
                className="form-control"
                placeholder="3001234567"
                value={formulario.telephone}
                onChange={manejarCambio}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold text-secondary small">
                Documento
              </label>

              <input
                type="text"
                name="document"
                className="form-control"
                placeholder="Número de documento"
                value={formulario.document}
                onChange={manejarCambio}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary small">
              Tipo de usuario
            </label>

            <select
              name="role"
              className="form-select"
              value={formulario.role}
              onChange={manejarCambio}
              required
            >
              <option value="comprador">Comprador</option>
              <option value="artesano">Artesano</option>
              <option value="emprendedor">Emprendedor</option>
              <option value="aprendiz">Aprendiz</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary small">
              Contraseña
            </label>

            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Mínimo 8 caracteres"
              value={formulario.password}
              onChange={manejarCambio}
              required
              minLength={8}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary small">
              Confirmar contraseña
            </label>

            <input
              type="password"
              name="password_confirmation"
              className="form-control"
              placeholder="Repite tu contraseña"
              value={formulario.password_confirmation}
              onChange={manejarCambio}
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="btn w-100 text-white fw-bold py-2 mt-2"
            style={{
              backgroundColor: "#2d6a4f",
              borderColor: "#2d6a4f",
            }}
            disabled={cargando}
          >
            {cargando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="small text-muted mb-0">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="text-decoration-none fw-semibold"
              style={{ color: "#2d6a4f" }}
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Registro;