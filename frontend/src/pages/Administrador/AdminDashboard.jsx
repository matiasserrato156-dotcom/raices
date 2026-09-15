import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function AdminDashboard() {
  const [metricas, setMetricas] = useState({
    totalVentas: 0,
    pedidosTotales: 0,
    pedidosPendientes: 0,
    productosTotales: 0,
    productosBajoStock: 0,
  });

  const [ultimosPedidos, setUltimosPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatoPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(Number(precio || 0));
  };

  useEffect(() => {
    const cargarDatosDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        // Cargar productos y pedidos en paralelo
        const [resProductos, resPedidos] = await Promise.all([
          api.get("/productos"),
          api.get("/pedidos"),
        ]);

        const listaProductos = Array.isArray(resProductos.data)
          ? resProductos.data
          : [];

        // Asegurar la estructura devuelta por Laravel
        const dataPedidos = resPedidos.data.pedidos || resPedidos.data;
        const listaPedidos = Array.isArray(dataPedidos) ? dataPedidos : [];

        // Métricas calculadas
        const ventasCalculadas = listaPedidos
          .filter((p) => p.estado !== "cancelado")
          .reduce((acc, p) => acc + Number(p.total || 0), 0);

        const pendientes = listaPedidos.filter(
          (p) => p.estado === "pendiente" || p.estado === "confirmado"
        ).length;

        const bajoStock = listaProductos.filter(
          (p) => Number(p.stock) <= 3
        ).length;

        setMetricas({
          totalVentas: ventasCalculadas,
          pedidosTotales: listaPedidos.length,
          pedidosPendientes: pendientes,
          productosTotales: listaProductos.length,
          productosBajoStock: bajoStock,
        });

        setUltimosPedidos(listaPedidos.slice(0, 5));
      } catch (err) {
        console.error("Error al cargar dashboard admin:", err);
        setError("No se pudieron cargar las estadísticas del negocio.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatosDashboard();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Cargando métricas de administración...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <span className="badge bg-dark text-uppercase px-3 py-1 mb-2">
            Panel de Control
          </span>
          <h1 className="fw-bold mb-1">Métricas y Administración</h1>
          <p className="text-muted mb-0">
            Resumen global del estado operativo de Raíces.
          </p>
        </div>

        <div className="d-flex gap-2">
          <Link to="/admin/productos" className="btn btn-outline-dark">
            Gestionar Productos
          </Link>
          <Link to="/admin/pedidos" className="btn btn-dark">
            Gestionar Pedidos
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Tarjetas de Métricas */}
      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 p-3">
            <div className="text-muted small text-uppercase fw-semibold mb-1">
              Ingresos Totales
            </div>
            <h3 className="fw-bold mb-0 text-success">
              {formatoPrecio(metricas.totalVentas)}
            </h3>
            <small className="text-muted mt-2">Ventas activas no canceladas</small>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 p-3">
            <div className="text-muted small text-uppercase fw-semibold mb-1">
              Pedidos Recibidos
            </div>
            <h3 className="fw-bold mb-0">{metricas.pedidosTotales}</h3>
            <small className="text-muted mt-2">Histórico global de órdenes</small>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 p-3">
            <div className="text-muted small text-uppercase fw-semibold mb-1">
              Por Despachar
            </div>
            <h3 className="fw-bold mb-0 text-warning">
              {metricas.pedidosPendientes}
            </h3>
            <small className="text-muted mt-2">Pendientes o confirmados</small>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 p-3">
            <div className="text-muted small text-uppercase fw-semibold mb-1">
              Inventario Activo
            </div>
            <h3 className="fw-bold mb-0">{metricas.productosTotales}</h3>
            <small className="text-danger mt-2">
              {metricas.productosBajoStock} producto(s) con stock crítico (≤ 3)
            </small>
          </div>
        </div>
      </div>

      {/* Tabla de Órdenes Recientes */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0">Órdenes de Compra Recientes</h4>
            <Link to="/admin/pedidos" className="text-decoration-none text-dark small fw-semibold">
              Ver todos los pedidos →
            </Link>
          </div>

          {ultimosPedidos.length === 0 ? (
            <p className="text-muted my-3 text-center py-4">
              Aún no hay compras registradas en el sistema.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Ref</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Total</th>
                    <th className="text-end">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {ultimosPedidos.map((pedido) => (
                    <tr key={pedido.id}>
                      <td className="fw-bold">#{pedido.id}</td>
                      <td>{pedido.user?.name || "Cliente"}</td>
                      <td className="small text-muted">
                        {pedido.created_at
                          ? new Date(pedido.created_at).toLocaleDateString("es-CO")
                          : "-"}
                      </td>
                      <td>
                        <span
                          className={`badge text-uppercase ${
                            pedido.estado === "entregado"
                              ? "bg-success"
                              : pedido.estado === "cancelado"
                              ? "bg-danger"
                              : pedido.estado === "en_camino"
                              ? "bg-primary"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {pedido.estado?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="fw-semibold">
                        {formatoPrecio(pedido.total)}
                      </td>
                      <td className="text-end">
                        <Link
                          to={`/admin/pedidos/${pedido.id}`}
                          className="btn btn-sm btn-outline-dark"
                        >
                          Ver detalle
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;