import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const ETIQUETAS_ESTADO = {
  pendiente: {
    label: "Pedido recibido",
    color: "bg-secondary",
  },
  confirmado: {
    label: "Confirmado",
    color: "bg-info text-dark",
  },
  preparando: {
    label: "En preparación",
    color: "bg-warning text-dark",
  },
  en_camino: {
    label: "En camino",
    color: "bg-primary",
  },
  entregado: {
    label: "Entregado",
    color: "bg-success",
  },
  cancelado: {
    label: "Cancelado",
    color: "bg-danger",
  },
};

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const [user] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const esAdmin = user?.role === "admin";

  const cargarPedidos = async () => {
    setCargando(true);
    setError("");

    try {
      /*
       * Para un comprador:
       * GET /api/pedidos
       *
       * Para administrador:
       * GET /api/admin/pedidos
       */
      const ruta = esAdmin
        ? "/admin/pedidos"
        : "/pedidos";

      const res = await api.get(ruta);

      const lista = Array.isArray(res.data)
        ? res.data
        : res.data?.pedidos || res.data?.data || [];

      setPedidos(lista);
    } catch (err) {
      console.error("ERROR COMPLETO AL CARGAR PEDIDOS:", err);

      console.error(
        "Respuesta del servidor:",
        err?.response?.data
      );

      console.error(
        "Código HTTP:",
        err?.response?.status
      );

      if (err?.response?.status === 401) {
        setError(
          "Tu sesión ha expirado. Inicia sesión nuevamente."
        );
      } else if (err?.response?.status === 403) {
        setError(
          "No tienes permisos para consultar estos pedidos."
        );
      } else if (err?.response?.status === 404) {
        setError(
          "No se encontró el servicio de pedidos."
        );
      } else {
        setError(
          "No fue posible cargar el historial de pedidos."
        );
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const formatoMoneda = (val) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(Number(val || 0));

  const pedidosFiltrados = pedidos.filter((p) => {
    const estadoMatch =
      filtroEstado === "todos" ||
      (p.estado || "").toLowerCase() ===
        filtroEstado.toLowerCase();

    const idTexto = String(p.id || "");

    const clienteTexto = String(
      p.user?.name ||
        p.nombre_comprador ||
        ""
    ).toLowerCase();

    const direccionTexto = String(
      p.direccion || ""
    ).toLowerCase();

    const busqTexto = busqueda
      .toLowerCase()
      .trim();

    const busquedaMatch =
      !busqTexto ||
      idTexto.includes(busqTexto) ||
      clienteTexto.includes(busqTexto) ||
      direccionTexto.includes(busqTexto);

    return estadoMatch && busquedaMatch;
  });

  return (
    <div
      className="container-fluid px-lg-5 py-4"
      style={{
        backgroundColor: "#fcfbf9",
        minHeight: "85vh",
      }}
    >
      {/* LOGO */}
      <div className="text-center mb-4">
        <img
          src="/logo-raices.png"
          alt="Raíces"
          style={{
            width: "60px",
            height: "60px",
            objectFit: "contain",
            marginBottom: "8px",
          }}
        />
      </div>

      {/* CABECERA */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <span
            className="text-muted small text-uppercase fw-bold"
            style={{ color: "#2d6a4f" }}
          >
            {esAdmin
              ? "Panel de Gestión Logística"
              : "Mi Cuenta"}
          </span>

          <h2
            className="fw-bold mb-1"
            style={{ color: "#1e4620" }}
          >
            {esAdmin
              ? "Gestión Global de Pedidos"
              : "Mis Pedidos"}
          </h2>

          <p className="text-muted small mb-0">
            {esAdmin
              ? "Revisa y actualiza los envíos de todos los compradores."
              : "Consulta el estado de despacho de tus compras artesanales."}
          </p>
        </div>

        <button
          onClick={cargarPedidos}
          className="btn btn-outline-dark btn-sm d-flex align-items-center gap-2 align-self-start align-self-md-auto"
        >
          <i className="bi bi-arrow-clockwise"></i>
          Actualizar lista
        </button>
      </div>

      {/* FILTROS */}
      <div
        className="card border-0 shadow-sm p-3 mb-4 bg-white"
        style={{ borderRadius: "12px" }}
      >
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-5">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>

              <input
                type="text"
                className="form-control"
                placeholder={
                  esAdmin
                    ? "Buscar por # orden, cliente o dirección..."
                    : "Buscar por # de orden..."
                }
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(e.target.value)
                }
              />

              {busqueda && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setBusqueda("")}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="col-12 col-md-7 d-flex gap-2 flex-wrap justify-content-md-end">
            {[
              ["todos", "Todos"],
              ["pendiente", "Recibidos"],
              ["confirmado", "Confirmados"],
              ["preparando", "En preparación"],
              ["en_camino", "En camino"],
              ["entregado", "Entregados"],
              ["cancelado", "Cancelados"],
            ].map(([clave, label]) => (
              <button
                key={clave}
                type="button"
                className={`btn btn-sm ${
                  filtroEstado === clave
                    ? "btn-dark fw-bold"
                    : "btn-light border text-muted"
                }`}
                style={
                  filtroEstado === clave
                    ? {
                        backgroundColor: "#2d6a4f",
                        borderColor: "#2d6a4f",
                      }
                    : {}
                }
                onClick={() =>
                  setFiltroEstado(clave)
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CARGANDO */}
      {cargando && (
        <div className="text-center py-5">
          <div
            className="spinner-border text-success"
            role="status"
          ></div>

          <p className="mt-3 text-muted">
            Cargando pedidos...
          </p>
        </div>
      )}

      {/* ERROR */}
      {!cargando && error && (
        <div
          className="alert alert-danger shadow-sm d-flex justify-content-between align-items-center"
          role="alert"
        >
          <div>
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>

          <button
            className="btn btn-sm btn-outline-danger"
            onClick={cargarPedidos}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* SIN PEDIDOS */}
      {!cargando &&
        !error &&
        pedidosFiltrados.length === 0 && (
          <div
            className="card border-0 shadow-sm p-5 text-center bg-white"
            style={{ borderRadius: "12px" }}
          >
            <i className="bi bi-inbox text-muted display-4 mb-3"></i>

            <h5>
              No se encontraron pedidos
            </h5>

            <p className="text-muted small">
              {busqueda ||
              filtroEstado !== "todos"
                ? "No hay órdenes que coincidan con los filtros."
                : "Aún no hay compras registradas."}
            </p>

            <Link
              to="/productos"
              className="btn btn-sm mx-auto mt-2 text-white"
              style={{
                backgroundColor: "#2d6a4f",
              }}
            >
              Explorar Artesanías
            </Link>
          </div>
        )}

      {/* TABLA */}
      {!cargando &&
        !error &&
        pedidosFiltrados.length > 0 && (
          <div
            className="card border-0 shadow-sm overflow-hidden bg-white"
            style={{ borderRadius: "12px" }}
          >
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr className="small text-muted text-uppercase">
                    <th className="ps-4">
                      Orden
                    </th>

                    <th>
                      Fecha
                    </th>

                    {esAdmin && (
                      <th>
                        Cliente
                      </th>
                    )}

                    <th>
                      Destino
                    </th>

                    <th>
                      Total
                    </th>

                    <th>
                      Estado
                    </th>

                    <th className="text-end pe-4">
                      Acción
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {pedidosFiltrados.map(
                    (item) => {
                      const estadoInfo =
                        ETIQUETAS_ESTADO[
                          item.estado
                        ] || {
                          label:
                            item.estado ||
                            "Sin estado",
                          color:
                            "bg-dark",
                        };

                      return (
                        <tr key={item.id}>
                          <td className="ps-4 fw-bold">
                            #{item.id}
                          </td>

                          <td className="small text-muted">
                            {new Date(
                              item.created_at ||
                                Date.now()
                            ).toLocaleDateString(
                              "es-CO",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </td>

                          {esAdmin && (
                            <td>
                              <div className="small fw-semibold">
                                {item.user?.name ||
                                  "Cliente registrado"}
                              </div>

                              <div
                                className="text-muted small"
                                style={{
                                  fontSize:
                                    "0.75rem",
                                }}
                              >
                                {item.user?.email ||
                                  "Sin correo"}
                              </div>
                            </td>
                          )}

                          <td
                            className="small text-truncate"
                            style={{
                              maxWidth: "220px",
                            }}
                          >
                            <i className="bi bi-geo-alt text-danger me-1"></i>

                            {item.direccion ||
                              "No especificada"}
                          </td>

                          <td className="fw-bold">
                            {formatoMoneda(
                              item.total
                            )}
                          </td>

                          <td>
                            <span
                              className={`badge ${estadoInfo.color} text-uppercase px-2 py-1`}
                              style={{
                                fontSize:
                                  "0.72rem",
                              }}
                            >
                              {
                                estadoInfo.label
                              }
                            </span>
                          </td>

                          <td className="text-end pe-4">
                            <Link
                              to={`/pedidos/${item.id}`}
                              className="btn btn-sm btn-outline-dark px-3 py-1"
                            >
                              Ver detalle →
                            </Link>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
}

export default Pedidos;