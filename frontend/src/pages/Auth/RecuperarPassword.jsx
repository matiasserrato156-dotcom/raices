import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function RecuperarPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  // Si existe token estamos en:
  // /reset-password/:token
  //
  // Si NO existe token estamos en:
  // /recuperar-password
  const esRestablecimiento = Boolean(token);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] =
    useState("");

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);

  // =====================================================
  // ENVIAR ENLACE DE RECUPERACIÓN
  // =====================================================

  const solicitarRecuperacion = async (e) => {
    e.preventDefault();

    setError("");
    setMensaje("");
    setLoading(true);

    try {
      const response = await api.post("/forgot-password", {
        email: email,
      });

      setMensaje(
        response.data.message ||
          "Hemos enviado un enlace de recuperación a tu correo."
      );
    } catch (error) {
      console.error(
        "Error al solicitar recuperación:",
        error
      );

      if (error.response?.status === 422) {
        const errores = error.response.data.errors;

        if (errores) {
          const primerError = Object.values(errores)[0];

          if (Array.isArray(primerError)) {
            setError(primerError[0]);
          } else {
            setError(
              "El correo electrónico no es válido."
            );
          }
        } else {
          setError(
            error.response.data.message ||
              "No pudimos enviar el enlace de recuperación."
          );
        }
      } else {
        setError(
          "No se pudo conectar con el servidor."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CAMBIAR CONTRASEÑA
  // =====================================================

  const restablecerPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    if (password.length < 8) {
      setError(
        "La contraseña debe tener mínimo 8 caracteres."
      );
      return;
    }

    if (password !== passwordConfirmation) {
      setError(
        "Las contraseñas no coinciden."
      );
      return;
    }

    if (!email) {
      setError(
        "Debes ingresar el correo de tu cuenta."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/reset-password",
        {
          token: token,
          email: email,
          password: password,
          password_confirmation:
            passwordConfirmation,
        }
      );

      setMensaje(
        response.data.message ||
          "Tu contraseña fue restablecida correctamente."
      );

      setExito(true);

      setPassword("");
      setPasswordConfirmation("");
    } catch (error) {
      console.error(
        "Error al restablecer contraseña:",
        error
      );

      if (error.response?.status === 422) {
        const errores = error.response.data.errors;

        if (errores) {
          const primerError =
            Object.values(errores)[0];

          if (Array.isArray(primerError)) {
            setError(primerError[0]);
          } else {
            setError(
              "Los datos ingresados no son válidos."
            );
          }
        } else {
          setError(
            error.response.data.message ||
              "El enlace no es válido o ha expirado."
          );
        }
      } else {
        setError(
          "No se pudo conectar con el servidor."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PANTALLA
  // =====================================================

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">

              {/* ENCABEZADO */}

              <div className="text-center mb-4">

                <h1 className="fw-bold">
                  RAÍCES
                </h1>

                <p className="text-muted">
                  {esRestablecimiento
                    ? "Crear nueva contraseña"
                    : "Recuperar contraseña"}
                </p>

              </div>

              {/* ERROR */}

              {error && (
                <div
                  className="alert alert-danger"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {/* MENSAJE */}

              {mensaje && (
                <div
                  className="alert alert-success"
                  role="alert"
                >
                  {mensaje}
                </div>
              )}

              {/* ================================================= */}
              {/* PASO 1: SOLICITAR ENLACE                         */}
              {/* ================================================= */}

              {!esRestablecimiento && (
                <>
                  <p className="text-muted mb-4">
                    Ingresa el correo electrónico asociado
                    a tu cuenta y te enviaremos un enlace
                    para restablecer tu contraseña.
                  </p>

                  <form onSubmit={solicitarRecuperacion}>

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
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        autoComplete="email"
                        required
                      />

                    </div>

                    <button
                      type="submit"
                      className="btn btn-dark w-100"
                      disabled={loading}
                    >
                      {loading
                        ? "Enviando enlace..."
                        : "Enviar enlace de recuperación"}
                    </button>

                  </form>
                </>
              )}

              {/* ================================================= */}
              {/* PASO 2: CAMBIAR CONTRASEÑA                       */}
              {/* ================================================= */}

              {esRestablecimiento && !exito && (
                <>
                  <p className="text-muted mb-4">
                    Escribe tu correo y crea una nueva
                    contraseña para tu cuenta.
                  </p>

                  <form onSubmit={restablecerPassword}>

                    {/* CORREO */}

                    <div className="mb-3">

                      <label
                        htmlFor="reset-email"
                        className="form-label fw-semibold"
                      >
                        Correo electrónico
                      </label>

                      <input
                        type="email"
                        id="reset-email"
                        name="email"
                        className="form-control"
                        placeholder="correo@ejemplo.com"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        autoComplete="email"
                        required
                      />

                    </div>

                    {/* NUEVA CONTRASEÑA */}

                    <div className="mb-3">

                      <label
                        htmlFor="password"
                        className="form-label fw-semibold"
                      >
                        Nueva contraseña
                      </label>

                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        placeholder="Mínimo 8 caracteres"
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        autoComplete="new-password"
                        minLength={8}
                        required
                      />

                    </div>

                    {/* CONFIRMAR */}

                    <div className="mb-4">

                      <label
                        htmlFor="password_confirmation"
                        className="form-label fw-semibold"
                      >
                        Confirmar nueva contraseña
                      </label>

                      <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        className="form-control"
                        placeholder="Repite tu contraseña"
                        value={passwordConfirmation}
                        onChange={(e) =>
                          setPasswordConfirmation(
                            e.target.value
                          )
                        }
                        autoComplete="new-password"
                        minLength={8}
                        required
                      />

                    </div>

                    <button
                      type="submit"
                      className="btn btn-dark w-100"
                      disabled={loading}
                    >
                      {loading
                        ? "Restableciendo..."
                        : "Cambiar contraseña"}
                    </button>

                  </form>
                </>
              )}

              {/* ================================================= */}
              {/* CONTRASEÑA CAMBIADA                              */}
              {/* ================================================= */}

              {esRestablecimiento && exito && (
                <div className="text-center">

                  <div
                    className="alert alert-success"
                    role="alert"
                  >
                    Tu contraseña fue cambiada
                    correctamente.
                  </div>

                  <p className="text-muted mb-4">
                    Ahora puedes volver al inicio de
                    sesión y utilizar tu nueva contraseña.
                  </p>

                  <button
                    type="button"
                    className="btn btn-dark w-100"
                    onClick={() =>
                      navigate("/login", {
                        replace: true,
                      })
                    }
                  >
                    Ir al inicio de sesión
                  </button>

                </div>
              )}

              {/* VOLVER */}

              <hr className="my-4" />

              <p className="text-center mb-0">

                <Link
                  to="/login"
                  className="fw-bold text-decoration-none"
                >
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

export default RecuperarPassword;