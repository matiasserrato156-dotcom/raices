import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

const CLASE_ESTADO = {
  pendiente: "warning",
  confirmado: "info",
  preparando: "primary",
  en_camino: "secondary",
  entregado: "success",
  cancelado: "danger",
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
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cambios, setCambios] = useState({});
  const [actualizandoId, setActualizandoId] = useState(null);

  const cargarPedidos = async () => {
    try {
      setCargando(true);
      setError("");

      const response = await api.get("/admin/pedidos");

      setPedidos(response.data?.pedidos || []);
    } catch (err) {
      console.error("Error cargando pedidos:", err);

      if (err.response?.status === 403) {
        setError("No tienes permisos para acceder al panel de administrador.");
      } else if (err.response?.status === 401) {
        setError("Tu sesión ha expirado. Inicia sesión nuevamente.");
      } else {
        setError(
          err.response?.data?.message ||
            "No se pudieron cargar los pedidos."
        );
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const estadisticas = useMemo(() => {
    return {
      total: pedidos.length,
      pendientes: pedidos.filter(
        (pedido) => pedido.estado === "pendiente"
      ).length,
      enCamino: pedidos.filter(
        (pedido) => pedido.estado === "en_camino"
      ).length,
      entregados: pedidos.filter(
        (pedido) => pedido.estado === "entregado"
      ).length,
      cancelados: pedidos.filter(
        (pedido) => pedido.estado === "cancelado"
      ).length,
    };
  }, [pedidos]);

  const obtenerEstadoSeleccionado = (pedido) => {
    return cambios[pedido.id] ?? pedido.estado;
  };

  const cambiarEstadoSeleccionado = (pedidoId, estado) => {
    setCambios((actuales) => ({
      ...actuales,
      [pedidoId]: estado,
    }));

    setMensaje("");
  };

  const actualizarEstado = async (pedido) => {
    const nuevoEstado = obtenerEstadoSeleccionado(pedido);

    if (nuevoEstado === pedido.estado) {
      return;
    }

    try {
      setActualizandoId(pedido.id);
      setError("");
      setMensaje("");

      const response = await api.put(
        `/admin/pedidos/${pedido.id}/estado`,
        {
          estado: nuevoEstado,
        }
      );

      const pedidoActualizado = response.data?.pedido;

      setPedidos((actuales) =>
        actuales.map((actual) =>
          actual.id === pedido.id
            ? pedidoActualizado || {
                ...actual,
                estado: nuevoEstado,
              }
            : actual
        )
      );

      setCambios((actuales) => {
        const copia = { ...actuales };
        delete copia[pedido.id];
        return copia;
      });

      setMensaje(
        `El pedido #${pedido.id} fue actualizado correctamente.`
      );
    } catch (err) {
      console.error("Error actualizando estado:", err);

      if (err.response?.status === 403) {
        setError("No tienes permisos para modificar pedidos.");
      } else if (err.response?.status === 401) {
        setError("Tu sesión ha expirado.");
      } else {
        setError(
          err.response?.data?.message ||
            "No se pudo actualizar el estado del pedido."
        );
      }
    } finally {
      setActualizandoId(null);
    }
  };

  if (cargando) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div
            className="spinner-border"
            role="status"
            aria-label="Cargando"
          ></div>

          <p className="mt-3 mb-0">
            Cargando pedidos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* ENCABEZADO */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <p className="text-muted mb-1">
            Administración
          </p>

          <h1 className="fw-bold mb-1">
            Panel de pedidos
          </h1>

          <p className="text-muted mb-0">
            Gestiona todos los pedidos realizados en RAÍCES.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-dark"
          onClick={cargarPedidos}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Actualizar
        </button>
      </div>

      {/* MENSAJES */}
      {mensaje && (
        <div
          className="alert alert-success d-flex align-items-center"
          role="alert"
        >
          <i className="bi bi-check-circle-fill me-2"></i>
          {mensaje}
        </div>
      )}

      {error && (
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* ESTADÍSTICAS */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">
                Total
              </p>

              <h2 className="fw-bold mb-0">
                {estadisticas.total}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">
                Pendientes
              </p>

              <h2 className="fw-bold mb-0 text-warning">
                {estadisticas.pendientes}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">
                En camino
              </p>

              <h2 className="fw-bold mb-0">
                {estadisticas.enCamino}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">
                Entregados
              </p>

              <h2 className="fw-bold mb-0 text-success">
                {estadisticas.entregados}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">
                Cancelados
              </p>

              <h2 className="fw-bold mb-0 text-danger">
                {estadisticas.cancelados}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* LISTA DE PEDIDOS */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {pedidos.length === 0 ? (
            <div className="text-center py-5 px-3">
              <i className="bi bi-bag-x fs-1 text-muted"></i>

              <h4 className="mt-3">
                No hay pedidos
              </h4>

              <p className="text-muted mb-0">
                Todavía no se han realizado pedidos.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-3 py-3">
                      Pedido
                    </th>

                    <th className="py-3">
                      Cliente
                    </th>

                    <th className="py-3">
                      Fecha
                    </th>

                    <th className="py-3">
                      Total
                    </th>

                    <th className="py-3">
                      Estado
                    </th>

                    <th className="py-3 text-end px-3">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {pedidos.map((pedido) => {
                    const estadoSeleccionado =
                      obtenerEstadoSeleccionado(pedido);

                    const estadoClase =
                      CLASE_ESTADO[estadoSeleccionado] || "secondary";

                    const actualizando =
                      actualizandoId === pedido.id;

                    return (
                      <tr key={pedido.id}>
                        <td className="px-3">
                          <strong>
                            #{pedido.id}
                          </strong>

                          <div className="small text-muted">
                            {pedido.detalles?.length || 0} producto(s)
                          </div>
                        </td>

                        <td>
                          <strong>
                            {pedido.user?.name || "Sin nombre"}
                          </strong>

                          <div className="small text-muted">
                            {pedido.user?.email || "Sin correo"}
                          </div>
                        </td>

                        <td>
                          <span className="small">
                            {formatearFecha(pedido.created_at)}
                          </span>
                        </td>

                        <td>
                          <strong>
                            {formatearPrecio(pedido.total)}
                          </strong>
                        </td>

                        <td>
                          <div className="d-flex flex-column gap-2">
                            <span
                              className={`badge text-bg-${estadoClase} align-self-start`}
                            >
                              {ETIQUETAS_ESTADO[estadoSeleccionado] ||
                                estadoSeleccionado}
                            </span>

                            <select
                              className="form-select form-select-sm"
                              value={estadoSeleccionado}
                              onChange={(e) =>
                                cambiarEstadoSeleccionado(
                                  pedido.id,
                                  e.target.value
                                )
                              }
                              disabled={actualizando}
                              style={{
                                minWidth: "145px",
                              }}
                            >
                              {ESTADOS.map((estado) => (
                                <option
                                  key={estado}
                                  value={estado}
                                >
                                  {ETIQUETAS_ESTADO[estado]}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        <td className="text-end px-3">
                          <div className="d-flex flex-column flex-lg-row justify-content-end gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-dark"
                              onClick={() =>
                                actualizarEstado(pedido)
                              }
                              disabled={
                                actualizando ||
                                estadoSeleccionado === pedido.estado
                              }
                            >
                              {actualizando ? (
                                <>
                                  <span
                                    className="spinner-border spinner-border-sm me-1"
                                    aria-hidden="true"
                                  ></span>
                                  Guardando
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-check-lg me-1"></i>
                                  Guardar
                                </>
                              )}
                            </button>

                            <Link
                              to={`/admin/pedidos/${pedido.id}`}
                              className="btn btn-sm btn-outline-dark"
                            >
                              <i className="bi bi-eye me-1"></i>
                              Ver detalle
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPedidos;