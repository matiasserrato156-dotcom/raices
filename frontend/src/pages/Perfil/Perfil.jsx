import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

function Perfil() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editando, setEditando] = useState(false);
  const [mostrarPass, setMostrarPass] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    telefono: "",
    direccion: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const response = await api.get("/user");
        const userData = response.data.user || response.data;
        setUser(userData);

        setForm({
          name: userData.name || "",
          email: userData.email || "",
          telefono: userData.telefono || "",
          direccion: userData.direccion || "",
          password: "",
          password_confirmation: "",
        });

        localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
        console.error("Error al obtener perfil:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }

        setError("No se pudo cargar la información del perfil.");
      } finally {
        setLoading(false);
      }
    };

    obtenerUsuario();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const comenzarEdicion = () => {
    setError("");
    setSuccess("");
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      telefono: user?.telefono || "",
      direccion: user?.direccion || "",
      password: "",
      password_confirmation: "",
    });
    setEditando(true);
  };

  const cancelarEdicion = () => {
    setError("");
    setSuccess("");
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      telefono: user?.telefono || "",
      direccion: user?.direccion || "",
      password: "",
      password_confirmation: "",
    });
    setEditando(false);
  };

  const guardarPerfil = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    if (!form.email.trim()) {
      setError("El correo electrónico es obligatorio.");
      return;
    }

    if (form.password) {
      if (form.password.length < 8) {
        setError("La nueva contraseña debe tener al menos 8 caracteres.");
        return;
      }
      if (form.password !== form.password_confirmation) {
        setError("Las contraseñas no coinciden.");
        return;
      }
    }

    setSaving(true);

    try {
      const datos = {
        name: form.name.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim(),
        direccion: form.direccion.trim(),
      };

      if (form.password) {
        datos.password = form.password;
        datos.password_confirmation = form.password_confirmation;
      }

      const response = await api.put("/profile", datos);
      const usuarioActualizado = response.data.user || response.data;

      setUser(usuarioActualizado);
      localStorage.setItem("user", JSON.stringify(usuarioActualizado));

      setForm({
        name: usuarioActualizado.name || "",
        email: usuarioActualizado.email || "",
        telefono: usuarioActualizado.telefono || "",
        direccion: usuarioActualizado.direccion || "",
        password: "",
        password_confirmation: "",
      });

      setSuccess(response.data.message || "Perfil actualizado exitosamente.");
      setEditando(false);
    } catch (err) {
      console.error("Error al actualizar perfil:", err);

      if (err.response?.status === 422) {
        const errores = err.response.data.errors;
        if (errores) {
          const primerError = Object.values(errores).flat().find(Boolean);
          setError(primerError || "Los datos ingresados no son válidos.");
        } else {
          setError(err.response.data.message || "Los datos ingresados no son válidos.");
        }
      } else if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      } else {
        setError("No se pudo actualizar el perfil en el servidor.");
      }
    } finally {
      setSaving(false);
    }
  };

  const cerrarSesion = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Cargando perfil de usuario...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          No se encontró la información de la sesión.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              {/* Encabezado */}
              <div className="text-center mb-4">
                <div
                  className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{
                    width: "85px",
                    height: "85px",
                    fontSize: "34px",
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <h2 className="fw-bold mb-1">{user.name}</h2>
                <span className="badge bg-secondary text-uppercase px-3 py-1">
                  {user.role || "Comprador"}
                </span>
              </div>

              {/* Mensajes */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              {!editando ? (
                <>
                  <div className="list-group list-group-flush mb-4">
                    <div className="list-group-item px-0 py-3 d-flex justify-content-between">
                      <span className="text-muted">Correo electrónico</span>
                      <strong className="text-dark">{user.email}</strong>
                    </div>

                    <div className="list-group-item px-0 py-3 d-flex justify-content-between">
                      <span className="text-muted">Teléfono</span>
                      <strong className="text-dark">
                        {user.telefono || "No especificado"}
                      </strong>
                    </div>

                    <div className="list-group-item px-0 py-3 d-flex justify-content-between">
                      <span className="text-muted">Dirección de despacho</span>
                      <strong className="text-dark text-end">
                        {user.direccion || "Sin dirección fija"}
                      </strong>
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="button"
                      className="btn btn-dark py-2"
                      onClick={comenzarEdicion}
                    >
                      Editar datos personales
                    </button>

                    <Link to="/pedidos" className="btn btn-outline-dark py-2">
                      Ver historial de compras
                    </Link>

                    <button
                      type="button"
                      className="btn btn-outline-danger py-2 mt-2"
                      onClick={cerrarSesion}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={guardarPerfil}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">
                      Nombre completo <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Correo electrónico <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label htmlFor="telefono" className="form-label fw-semibold">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        className="form-control"
                        placeholder="Ej. 3001234567"
                        value={form.telefono}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="direccion" className="form-label fw-semibold">
                        Dirección predeterminada
                      </label>
                      <input
                        type="text"
                        id="direccion"
                        name="direccion"
                        className="form-control"
                        placeholder="Calle / Carrera / Apto"
                        value={form.direccion}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <hr className="my-4" />

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold mb-0">Seguridad / Contraseña</h5>
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-decoration-none text-muted p-0"
                      onClick={() => setMostrarPass(!mostrarPass)}
                    >
                      {mostrarPass ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                  <p className="text-muted small mb-3">
                    Solo diligencia estos campos si deseas modificar tu clave actual.
                  </p>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">
                      Nueva contraseña
                    </label>
                    <input
                      type={mostrarPass ? "text" : "password"}
                      id="password"
                      name="password"
                      className="form-control"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Mínimo 8 caracteres"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="password_confirmation"
                      className="form-label fw-semibold"
                    >
                      Confirmar nueva contraseña
                    </label>
                    <input
                      type={mostrarPass ? "text" : "password"}
                      id="password_confirmation"
                      name="password_confirmation"
                      className="form-control"
                      value={form.password_confirmation}
                      onChange={handleChange}
                      placeholder="Repite la nueva contraseña"
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-50"
                      onClick={cancelarEdicion}
                      disabled={saving}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="btn btn-dark w-50"
                      disabled={saving}
                    >
                      {saving ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;