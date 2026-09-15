import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../services/api";

// Configuración de iconos Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const iconoDestino = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function ControladorCamara({ centro }) {
  const map = useMap();
  useEffect(() => {
    if (centro) {
      map.flyTo(centro, 15, { duration: 1.5 });
    }
  }, [centro, map]);
  return null;
}

const ETAPAS_ENVIO = [
  { clave: "pendiente", label: "Pedido recibido", icono: "bi-box-seam-fill" },
  { clave: "confirmado", label: "Confirmado", icono: "bi-check2-circle" },
  { clave: "preparando", label: "En preparación", icono: "bi-hammer" },
  { clave: "en_camino", label: "En camino", icono: "bi-truck" },
  { clave: "entregado", label: "Entregado", icono: "bi-house-check" },
];

const ETIQUETAS_ESTADO = {
  pendiente: "Pedido Recibido",
  confirmado: "Confirmado",
  preparando: "En preparación",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

function obtenerIndiceEtapa(estado) {
  const est = (estado || "").toLowerCase().trim();
  if (est === "entregado") return 4;
  if (est === "en_camino" || est === "enviado" || est === "despachado") return 3;
  if (est === "preparando" || est === "en_preparacion" || est === "preparacion") return 2;
  if (est === "confirmado" || est === "pagado") return 1;
  return 0;
}

function PedidoDetalle() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Estado del usuario autenticado para verificar permisos de Administrador
  const [esAdmin, setEsAdmin] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [actualizandoEstado, setActualizandoEstado] = useState(false);
  const [mensajeAdmin, setMensajeAdmin] = useState("");

  // Estados del Mapa
  const [coordenadas, setCoordenadas] = useState([10.9685, -74.7813]);
  const [direccionBuscador, setDireccionBuscador] = useState("");
  const [direccionGeocodificada, setDireccionGeocodificada] = useState("");
  const [buscandoMapa, setBuscandoMapa] = useState(false);
  const [errorMapa, setErrorMapa] = useState("");

  // Detección de rol de administrador (se activa directamente con tu usuario id: 1)
  useEffect(() => {
    try {
      const rawUsuario = localStorage.getItem("usuario") || localStorage.getItem("user");
      if (rawUsuario) {
        const u = JSON.parse(rawUsuario);
        if (
          u.id === 1 ||
          u.id_rol === 1 ||
          u.id_rol === 6 ||
          u.rol === "admin" ||
          u.role === "admin" ||
          u.is_admin
        ) {
          setEsAdmin(true);
        }
      }
    } catch (e) {
      console.error("Error al verificar rol de usuario:", e);
    }
  }, []);

  const geocodificarDireccion = async (direccionTexto) => {
    if (!direccionTexto) return;
    setBuscandoMapa(true);
    setErrorMapa("");

    try {
      const query = direccionTexto.trim();
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=1`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setCoordenadas([lat, lon]);
        setDireccionGeocodificada(data[0].display_name);
      } else {
        setErrorMapa("No se encontró esa dirección en el mapa.");
      }
    } catch {
      setErrorMapa("Servicio de geolocalización no disponible temporalmente.");
    } finally {
      setBuscandoMapa(false);
    }
  };

  const cargarPedido = async () => {
    try {
      setCargando(true);
      const res = await api.get(`/pedidos/${id}`);
      const data = res.data?.pedido || res.data;
      setPedido(data);
      setNuevoEstado(data?.estado || "pendiente");

      if (data?.direccion) {
        setDireccionBuscador(data.direccion);
        geocodificarDireccion(data.direccion);
      }
    } catch (err) {
      console.error("Error al cargar pedido:", err);
      setError("No fue posible consultar los detalles de este pedido.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPedido();
  }, [id]);

  // Actualización directa de estado para administradores
  const handleActualizarEstado = async () => {
    if (!nuevoEstado || nuevoEstado === pedido?.estado) return;
    setActualizandoEstado(true);
    setMensajeAdmin("");

    try {
      const res = await api.put(`/admin/pedidos/${pedido.id}/estado`, {
        estado: nuevoEstado,
      });

      const pedidoActualizado = res.data?.pedido || {
        ...pedido,
        estado: nuevoEstado,
      };

      setPedido(pedidoActualizado);
      setMensajeAdmin("¡Estado de despacho actualizado correctamente!");
      setTimeout(() => setMensajeAdmin(""), 4000);
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      alert("No se pudo actualizar el estado. Verifica permisos de administrador.");
    } finally {
      setActualizandoEstado(false);
    }
  };

  const handleBuscarNuevaDireccion = (e) => {
    e.preventDefault();
    if (!direccionBuscador.trim()) return;
    geocodificarDireccion(direccionBuscador);
  };

  const formatoPrecio = (precio) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(Number(precio || 0));

  const generarFacturaPDF = () => {
    if (!pedido) return;
    const doc = new jsPDF();
    const articulos = pedido.detalles || pedido.productos || pedido.items || [];

    doc.setFillColor(33, 37, 41);
    doc.rect(0, 0, 210, 32, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("RAÍCES", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Mercado de Arte & Tradición Ancestral", 14, 26);
    doc.text("COMPROBANTE OFICIAL DE COMPRA", 196, 20, { align: "right" });

    doc.setTextColor(33, 37, 41);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Orden de Pedido: #${pedido.id}`, 14, 42);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const fecha = new Date(pedido.created_at || Date.now()).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    doc.text(`Fecha de emisión: ${fecha}`, 14, 48);
    doc.text(
      `Estado del envío: ${(ETIQUETAS_ESTADO[pedido.estado] || pedido.estado || "Confirmado").toUpperCase()}`,
      14,
      54
    );

    doc.setFillColor(248, 249, 250);
    doc.roundedRect(14, 60, 182, 30, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.text("Datos de Entrega y Facturación:", 18, 67);
    doc.setFont("helvetica", "normal");
    doc.text(`Cliente: ${pedido.user?.name || "Cliente Registrado"}`, 18, 73);
    doc.text(`Destino: ${pedido.direccion || "No especificada"}`, 18, 79);
    doc.text(`Notas/Contacto: ${pedido.observaciones || "Sin observaciones adicionales"}`, 18, 85);

    const filasTabla = articulos.map((art) => {
      const prod = art.producto || art;
      const cant = Number(art.cantidad || art.pivot?.cantidad || 1);
      const precioUnit = Number(
        art.precio_unitario ||
        art.subtotal / (cant || 1) ||
        art.pivot?.precio ||
        art.precio ||
        prod.precio ||
        0
      );
      const subtotal = Number(art.subtotal || precioUnit * cant);
      return [
        prod.nombre || "Artesanía Tradicional",
        cant.toString(),
        formatoPrecio(precioUnit),
        formatoPrecio(subtotal),
      ];
    });

    autoTable(doc, {
      startY: 96,
      head: [["Descripción de la Creación", "Cant.", "Precio Unitario", "Subtotal"]],
      body: filasTabla,
      theme: "striped",
      headStyles: { fillColor: [33, 37, 41], textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { halign: "center", cellWidth: 20 },
        2: { halign: "right", cellWidth: 32 },
        3: { halign: "right", cellWidth: 30 },
      },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Total Cancelado:", 140, finalY);
    doc.text(formatoPrecio(pedido.total || 0), 196, finalY, { align: "right" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(108, 117, 125);
    doc.text(
      "Este documento certifica la adquisición y despacho de piezas elaboradas por comunidades artesanales colombianas.",
      105,
      275,
      { align: "center" }
    );
    doc.text("Plataforma Raíces - Transparencia y Trazabilidad de Patrimonio Cultural", 105, 280, { align: "center" });

    doc.save(`Comprobante-Pedido-${pedido.id}-Raices.pdf`);
  };

  if (cargando) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark" role="status"></div>
        <p className="mt-3 text-muted">Cargando detalles de tu orden...</p>
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger shadow-sm rounded-3 d-inline-block px-5 py-4">
          <i className="bi bi-exclamation-triangle display-4 d-block mb-2"></i>
          <h5>{error || "Orden no encontrada."}</h5>
          <Link to="/productos" className="btn btn-dark btn-sm mt-3">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const articulos = pedido.detalles || pedido.productos || pedido.items || [];
  const etapaActivaIndex = obtenerIndiceEtapa(pedido.estado);
  const esCancelado = (pedido.estado || "").toLowerCase() === "cancelado";

  return (
    <div className="container-fluid px-lg-5 py-4">
      {/* NAVEGACIÓN Y ACCIONES */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/pedidos" className="text-decoration-none text-muted small">
          ← Volver a pedidos
        </Link>
        <div className="d-flex gap-2 align-items-center">
          <button
            type="button"
            className="btn btn-danger btn-sm d-flex align-items-center gap-2 shadow-sm"
            onClick={generarFacturaPDF}
          >
            <i className="bi bi-file-earmark-pdf-fill"></i>
            <span>Descargar Comprobante (PDF)</span>
          </button>
          <span
            className={`badge px-3 py-2 text-uppercase ${
              esCancelado ? "bg-danger" : "bg-dark"
            }`}
          >
            {ETIQUETAS_ESTADO[pedido.estado] || pedido.estado}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <span className="text-muted small text-uppercase fw-bold">
          ORDEN DE COMPRA
        </span>
        <h2 className="fw-bold mb-1">Pedido #{pedido.id}</h2>
        <p className="text-muted small mb-0">
          Registrado el{" "}
          {new Date(pedido.created_at || Date.now()).toLocaleDateString("es-CO", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* PANEL EXCLUSIVO DEL ADMINISTRADOR PARA CONTROL DIRECTO */}
      {esAdmin && (
        <div className="card border-0 shadow-sm p-4 mb-4 bg-light border-start border-4 border-dark">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h6 className="fw-bold mb-1 text-dark">
                <i className="bi bi-shield-lock-fill me-2"></i>
                Control de Administrador / Logística
              </h6>
              <p className="text-muted small mb-0">
                Cambia el estado del despacho aquí. El comprador verá el avance en tiempo real en su seguimiento.
              </p>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <select
                className="form-select form-select-sm"
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value)}
                style={{ width: "190px" }}
              >
                <option value="pendiente">Pedido Recibido</option>
                <option value="confirmado">Confirmado</option>
                <option value="preparando">En preparación</option>
                <option value="en_camino">En camino</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelar Pedido</option>
              </select>
              <button
                className="btn btn-dark btn-sm text-nowrap"
                onClick={handleActualizarEstado}
                disabled={actualizandoEstado || nuevoEstado === pedido.estado}
              >
                {actualizandoEstado ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  <span>Actualizar Estado</span>
                )}
              </button>
            </div>
          </div>
          {mensajeAdmin && (
            <div className="alert alert-success py-2 px-3 mt-3 mb-0 small">
              <i className="bi bi-check-circle-fill me-2"></i> {mensajeAdmin}
            </div>
          )}
        </div>
      )}

      {/* SEGUIMIENTO DE ENVÍO DINÁMICO */}
      {esCancelado ? (
        <div className="alert alert-danger shadow-sm p-4 mb-4">
          <i className="bi bi-x-circle-fill me-2 fs-5"></i>
          Este pedido ha sido cancelado.
        </div>
      ) : (
        <div className="card border-0 shadow-sm p-4 mb-4 bg-white">
          <h5 className="fw-bold mb-3">Seguimiento de envío</h5>
          <div className="d-flex justify-content-between text-center position-relative my-2 overflow-x-auto pb-2 flex-nowrap">
            {ETAPAS_ENVIO.map((etapa, idx) => {
              const completadaOActual = idx <= etapaActivaIndex;
              return (
                <div key={etapa.clave} className="flex-fill px-2" style={{ minWidth: "90px" }}>
                  <div
                    className={`rounded-circle mx-auto d-flex align-items-center justify-content-center fw-bold shadow-sm ${
                      completadaOActual
                        ? "bg-dark text-white"
                        : "bg-light text-muted border"
                    }`}
                    style={{ width: "44px", height: "44px" }}
                  >
                    <i className={`bi ${etapa.icono}`}></i>
                  </div>
                  <div
                    className={`small mt-2 ${
                      completadaOActual ? "fw-bold text-dark" : "text-muted"
                    }`}
                  >
                    {etapa.label}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-3">
            <p className="text-muted small mb-0">
              Estado actual:{" "}
              <strong className="text-dark text-uppercase">
                {ETIQUETAS_ESTADO[pedido.estado] || pedido.estado}
              </strong>
            </p>
          </div>
        </div>
      )}

      {/* PRODUCTOS Y MAPA */}
      <div className="row g-4">
        {/* LADO IZQUIERDO */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-4 mb-4">
            <h5 className="fw-bold mb-3">Productos en este pedido</h5>
            <div className="d-flex flex-column gap-3">
              {articulos.map((art) => {
                const prod = art.producto || art;
                const cantidad = Number(art.cantidad || art.pivot?.cantidad || 1);
                const precio = Number(
                  art.precio_unitario ||
                  art.subtotal / (cantidad || 1) ||
                  art.pivot?.precio ||
                  art.precio ||
                  prod.precio ||
                  0
                );
                const subtotal = Number(art.subtotal || precio * cantidad);

                return (
                  <div
                    key={art.id || prod.id || Math.random()}
                    className="d-flex align-items-center justify-content-between border-bottom pb-3"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={
                          prod.imagen ||
                          prod.imagen_url ||
                          "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261"
                        }
                        alt={prod.nombre}
                        className="rounded-3"
                        style={{ width: "65px", height: "65px", objectFit: "cover" }}
                      />
                      <div>
                        <strong className="d-block text-dark">{prod.nombre}</strong>
                        <small className="text-muted">
                          Cantidad: {cantidad} × {formatoPrecio(precio)}
                        </small>
                      </div>
                    </div>
                    <span className="fw-bold text-dark">
                      {formatoPrecio(subtotal)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3 pt-2">
              <span className="fs-6 fw-bold">Total cancelado:</span>
              <span className="fs-5 fw-bold text-dark">
                {formatoPrecio(pedido.total || 0)}
              </span>
            </div>
          </div>

          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Datos del comprador y entrega</h5>
            {pedido.user && (
              <p className="mb-2 small">
                <i className="bi bi-person-fill text-dark me-2"></i>
                <strong>Cliente:</strong> {pedido.user.name} ({pedido.user.email})
              </p>
            )}
            <p className="mb-2 small">
              <i className="bi bi-geo-alt-fill text-danger me-2"></i>
              <strong>Destino del paquete:</strong> {pedido.direccion || "No especificada"}
            </p>
            <p className="mb-0 small text-muted">
              <i className="bi bi-info-circle me-2"></i>
              <strong>Detalles de entrega:</strong>{" "}
              {pedido.observaciones || "Sin instrucciones adicionales"}
            </p>
          </div>
        </div>

        {/* LADO DERECHO */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-4 h-100 d-flex flex-column">
            <div className="mb-3">
              <h5 className="fw-bold mb-1">Mapa de Destino de Entrega</h5>
              <small className="text-muted">
                Ubicación mundial según la dirección del comprador.
              </small>
            </div>

            <form onSubmit={handleBuscarNuevaDireccion} className="mb-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingresa cualquier dirección, barrio o país..."
                  value={direccionBuscador}
                  onChange={(e) => setDireccionBuscador(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-dark fw-semibold"
                  disabled={buscandoMapa}
                >
                  {buscandoMapa ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <span>
                      <i className="bi bi-geo-alt me-1"></i> Centrar Mapa
                    </span>
                  )}
                </button>
              </div>
              {errorMapa && (
                <div className="text-danger small mt-1 fw-semibold">
                  <i className="bi bi-exclamation-circle me-1"></i> {errorMapa}
                </div>
              )}
            </form>

            <div
              className="rounded-3 overflow-hidden border shadow-sm flex-grow-1"
              style={{ minHeight: "380px" }}
            >
              <MapContainer
                center={coordenadas}
                zoom={15}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <ControladorCamara centro={coordenadas} />

                <Marker position={coordenadas} icon={iconoDestino}>
                  <Popup>
                    <div>
                      <strong className="text-danger d-block">
                        📍 Destino del Pedido #{pedido.id}
                      </strong>
                      <span className="small text-muted">
                        {direccionGeocodificada || pedido.direccion}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            <div className="text-muted small mt-2">
              <i className="bi bi-globe-americas text-primary me-1"></i>
              Geolocalización satelital global integrada para logística internacional.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PedidoDetalle;