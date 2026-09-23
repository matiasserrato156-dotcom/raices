import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/forgot-password",
        { email: email },
        {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }
      );

      setMensaje(
        response.data.message ||
          "Si el correo está registrado, recibirás un enlace para recuperar tu contraseña."
      );

      setEmail("");
    } catch (error) {
      console.error("Error al solicitar recuperación:", error);

      if (error.response?.status === 422) {
        setError(
          error.response.data.message ||
            "No pudimos procesar la solicitud."
        );
      } else {
        setError(
          error.response.data.message ||
            error.message ||
            "No se pudo conectar con el servidor."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h1 className="fw-bold">RAÍCES</h1>
                <p className="text-muted">Recuperar contraseña</p>
              </div>

              <p className="text-muted">
                Escribe el correo electrónico de tu cuenta y te enviaremos un
                enlace para restablecer tu contraseña.
              </p>

              {mensaje && (
                <div className="alert alert-success">{mensaje}</div>
              )}

              {error && (
                <div className="alert alert-danger">{error}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="form-label fw-semibold"
                  >
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100"
                  disabled={loading}
                >
                  {loading
                    ? "Enviando..."
                    : "Enviar enlace de recuperación"}
                </button>
              </form>

              <hr className="my-4" />

              <p className="text-center mb-0">
                <Link to="/login" className="fw-bold">
                  Volver al inicio de sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;