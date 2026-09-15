import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const ESTADOS = [
  "pendiente",
  "confirmado",
  "preparando",
  "en_camino",
  "entregado",
  "cancelado",
];

const ETIQUETAS_ESTADO = {
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  preparando: "Preparando",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

function formatearPrecio(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(valor || 0));
}

function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";

  return new Date(fecha).toLocaleString("es-CO", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function obtenerImagen(producto) {
  if (!producto?.imagen) {
    return null;
  }

  if (
    producto.imagen.startsWith("http://") ||
    producto.imagen.startsWith("https://")
  ) {
    return producto.imagen;
  }

  if (producto.imagen.startsWith("/")) {
    return `http://127.0.0.1:8000${producto.imagen}`;
  }

  return `http://127.0.0.1:8000/storage/${producto.imagen}`;
}

function AdminPedidoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pedido, setPedido] = useState(null);
  const [estado, setEstado] = useState("");
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarPedido = async () => {
    try {
      setCargando(true);
      setError("");

      const response = await api.get(`/admin/pedidos/${id}`);

      const datos = response.data?.pedido || response.data;

      setPedido(datos);
      setEstado(datos?.estado || "");
    } catch (err) {
      console.error("Error cargando pedido:", err);

      if (err.response?.status === 403) {
        setError("No tienes permisos para ver este pedido.");
      } else if (err.response?.status === 404) {
        setError("El pedido no existe.");
      } else {
        setError(
          err.response?.data?.message ||
            "No se pudo cargar el pedido."
        );
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPedido();
  }, [id]);

  const actualizarEstado = async () => {
    if (!pedido || !estado || estado === pedido.estado) {
      return;
    }

    try {
      setActualizando(true);
      setError("");
      setMensaje("");

      const response = await api.put(
        `/admin/pedidos/${pedido.id}/estado`,
        {
          estado,
        }
      );

      const actualizado =
        response.data?.pedido || {
          ...pedido,
          estado,
        };

      setPedido(actualizado);
      setEstado(actualizado.estado);

      setMensaje(
        "Estado actualizado correctamente. Se ha enviado la notificación al cliente."
      );
    } catch (err) {
      console.error("Error actualizando estado:", err);

      setError(
        err.response?.data?.message ||
          "No se pudo actualizar el estado."
      );
    } finally {
      setActualizando(false);
    }
  };

  if (cargando) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div
            className="spinner-border"
            role="status"
          ></div>

          <p className="mt-3">
            Cargando pedido...
          </p>
        </div>
      </div>
    );
  }

  if (error && !pedido) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>

        <button
          type="button"
          className="btn btn-dark"
          onClick={() => navigate("/admin/pedidos")}
        >
          Volver al panel
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* CABECERA */}
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <div>
          <Link
            to="/admin/pedidos"
            className="text-decoration-none text-dark"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Volver al panel
          </Link>

          <h1 className="fw-bold mt-3 mb-1">
            Pedido #{pedido.id}
          </h1>

          <p className="text-muted mb-0">
            Realizado el {formatearFecha(pedido.created_at)}
          </p>
        </div>

        <div className="text-md-end">
          <span className="text-muted d-block">
            Total
          </span>

          <strong className="fs-3">
            {formatearPrecio(pedido.total)}
          </strong>
        </div>
      </div>

      {mensaje && (
        <div className="alert alert-success">
          <i className="bi bi-check-circle-fill me-2"></i>
          {mensaje}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      <div className="row g-4">
        {/* INFORMACIÓN DEL CLIENTE */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-4">
                <i className="bi bi-person me-2"></i>
                Cliente
              </h5>

              <p className="mb-1">
                <strong>Nombre</strong>
              </p>

              <p className="text-muted">
                {pedido.user?.name || "No disponible"}
              </p>

              <p className="mb-1">
                <strong>Correo</strong>
              </p>

              <p className="text-muted text-break">
                {pedido.user?.email || "No disponible"}
              </p>

              <hr />

              <p className="mb-1">
                <strong>Dirección de entrega</strong>
              </p>

              <p className="text-muted">
                {pedido.direccion || "No especificada"}
              </p>

              <p className="mb-1">
                <strong>Observaciones</strong>
              </p>

              <p className="text-muted mb-0">
                {pedido.observaciones || "Sin observaciones"}
              </p>
            </div>
          </div>
        </div>

        {/* ESTADO */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-truck me-2"></i>
                Estado del pedido
              </h5>

              <div className="row align-items-end g-3">
                <div className="col-12 col-md-8">
                  <label
                    htmlFor="estado"
                    className="form-label"
                  >
                    Estado
                  </label>

                  <select
                    id="estado"
                    className="form-select"
                    value={estado}
                    onChange={(e) =>
                      setEstado(e.target.value)
                    }
                    disabled={actualizando}
                  >
                    {ESTADOS.map((estadoDisponible) => (
                      <option
                        key={estadoDisponible}
                        value={estadoDisponible}
                      >
                        {ETIQUETAS_ESTADO[estadoDisponible]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-4">
                  <button
                    type="button"
                    className="btn btn-dark w-100"
                    onClick={actualizarEstado}
                    disabled={
                      actualizando ||
                      estado === pedido.estado
                    }
                  >
                    {actualizando ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        ></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Actualizar
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-muted">
                  Estado actual:
                </span>{" "}
                <strong>
                  {ETIQUETAS_ESTADO[pedido.estado] ||
                    pedido.estado}
                </strong>
              </div>
            </div>
          </div>

          {/* PRODUCTOS */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-4">
                <i className="bi bi-bag me-2"></i>
                Productos del pedido
              </h5>

              {pedido.detalles?.length ? (
                <div className="d-flex flex-column gap-3">
                  {pedido.detalles.map((detalle) => {
                    const imagen = obtenerImagen(
                      detalle.producto
                    );

                    return (
                      <div
                        key={detalle.id}
                        className="border rounded p-3"
                      >
                        <div className="row align-items-center g-3">
                          <div className="col-auto">
                            {imagen ? (
                              <img
                                src={imagen}
                                alt={
                                  detalle.producto?.nombre ||
                                  "Producto"
                                }
                                style={{
                                  width: "90px",
                                  height: "90px",
                                  objectFit: "cover",
                                  borderRadius: "10px",
                                }}
                                onError={(e) => {
                                  e.currentTarget.style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <div
                                className="d-flex align-items-center justify-content-center bg-light rounded"
                                style={{
                                  width: "90px",
                                  height: "90px",
                                }}
                              >
                                <i className="bi bi-image fs-3 text-muted"></i>
                              </div>
                            )}
                          </div>

                          <div className="col">
                            <h6 className="fw-bold mb-1">
                              {detalle.producto?.nombre ||
                                "Producto"}
                            </h6>

                            <p className="text-muted small mb-1">
                              Cantidad: {detalle.cantidad}
                            </p>

                            <p className="text-muted small mb-0">
                              Precio unitario:{" "}
                              {formatearPrecio(
                                detalle.precio_unitario
                              )}
                            </p>
                          </div>

                          <div className="col-auto">
                            <strong>
                              {formatearPrecio(
                                detalle.subtotal
                              )}
                            </strong>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted mb-0">
                  No hay productos asociados.
                </p>
              )}

              <hr />

              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">
                  Total del pedido
                </span>

                <span className="fs-4 fw-bold">
                  {formatearPrecio(pedido.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPedidoDetalle;