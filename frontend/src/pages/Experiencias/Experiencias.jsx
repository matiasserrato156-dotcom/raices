import { useEffect, useState } from "react";
import api from "../../services/api";

function Experiencias() {
  const [experiencias, setExperiencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Estados para el Modal de Reserva
  const [experienciaSeleccionada, setExperienciaSeleccionada] = useState(null);
  const [fechaReserva, setFechaReserva] = useState("");
  const [cupos, setCupos] = useState(1);
  const [notas, setNotas] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  // Cargar catálogo de talleres desde Laravel
  const cargarExperiencias = async () => {
    setCargando(true);
    setError("");
    try {
      const res = await api.get("/experiencias");
      const lista = res.data?.experiencias || (Array.isArray(res.data) ? res.data : []);
      setExperiencias(lista);
    } catch (err) {
      console.error("Error al cargar experiencias:", err);
      setError("No fue posible cargar las experiencias culturales en este momento.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarExperiencias();
  }, []);

  // Formateador de moneda oficial en Pesos Colombianos
  const formatoPrecio = (valor) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(Number(valor || 0));

  // Fecha mínima seleccionable (hoy)
  const hoyStr = new Date().toISOString().split("T")[0];

  const abrirModalReserva = (exp) => {
    setExperienciaSeleccionada(exp);
    setFechaReserva("");
    setCupos(1);
    setNotas("");
    setMensajeError("");
  };

  const cerrarModal = () => {
    setExperienciaSeleccionada(null);
    setMensajeError("");
  };

  // Confirmar reserva mediante la API
  const handleConfirmarReserva = async (e) => {
    e.preventDefault();
    if (!fechaReserva) {
      setMensajeError("Por favor selecciona una fecha válida para el taller.");
      return;
    }

    setEnviando(true);
    setMensajeError("");

    try {
      const res = await api.post(`/experiencias/${experienciaSeleccionada.id}/reservar`, {
        fecha_reserva: fechaReserva,
        cupos: Number(cupos),
        notas: notas.trim() || null,
      });

      setMensajeExito(
        res.data?.message || `¡Reserva confirmada para ${experienciaSeleccionada.titulo}!`
      );
      cerrarModal();

      setTimeout(() => {
        setMensajeExito("");
      }, 5000);
    } catch (err) {
      console.error("Error al procesar reserva:", err);
      const msg =
        err.response?.data?.message ||
        "No se pudo completar la reserva. Verifica la disponibilidad de cupos.";
      setMensajeError(msg);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container-fluid px-lg-5 py-4">
      {/* BANNER EXPERIENCIAL ANCESTRAL */}
      <div className="card border-0 bg-dark text-white p-4 p-md-5 mb-4 rounded-4 shadow-sm position-relative overflow-hidden">
        <div className="col-lg-8 position-relative" style={{ zIndex: 2 }}>
          <span className="badge bg-warning text-dark text-uppercase fw-bold mb-2 px-3 py-2">
            Talleres Vivos en Territorio
          </span>
          <h1 className="fw-bold display-5 mb-2">Experiencias con Maestros Artesanos</h1>
          <p className="text-white-50 lead mb-0">
            Aprende directamente en las rancherías, veredas y talleres coloniales. Vive la tradición
            desde las manos de quienes custodian nuestro patrimonio.
          </p>
        </div>
      </div>

      {/* ALERTA FLOTANTE DE ÉXITO */}
      {mensajeExito && (
        <div
          className="alert alert-success shadow-lg position-fixed bottom-0 end-0 m-4 py-3 px-4 rounded-4 d-flex align-items-center gap-3 border border-success"
          style={{ zIndex: 1060 }}
        >
          <i className="bi bi-calendar-check-fill text-success fs-3"></i>
          <div>
            <div className="fw-bold">{mensajeExito}</div>
            <small className="text-muted">Te esperamos para vivir este saber ancestral.</small>
          </div>
          <button
            type="button"
            className="btn-close ms-2"
            onClick={() => setMensajeExito("")}
          ></button>
        </div>
      )}

      {/* ESTADO DE CARGA Y ERRORES */}
      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status"></div>
          <p className="mt-3 text-muted">Cargando talleres y experiencias en territorio...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger shadow-sm text-center py-4">{error}</div>
      ) : experiencias.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center bg-white rounded-3">
          <i className="bi bi-calendar-x text-muted display-4 mb-3"></i>
          <h4 className="fw-bold">No hay talleres disponibles por el momento</h4>
          <p className="text-muted small">
            Los maestros están preparando nuevas fechas para la temporada.
          </p>
        </div>
      ) : (
        /* GRILLA DE EXPERIENCIAS */
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {experiencias.map((exp) => (
            <div key={exp.id} className="col">
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column bg-white">
                {/* FOTOGRAFÍA + INSIGNIAS */}
                <div className="position-relative" style={{ height: "230px" }}>
                  <img
                    src={
                      exp.imagen ||
                      "https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb"
                    }
                    alt={exp.titulo}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="position-absolute top-0 start-0 m-3">
                    <span className="badge bg-warning text-dark fw-bold px-3 py-2 shadow-sm">
                      {exp.modalidad || "Presencial"}
                    </span>
                  </div>
                  <div className="position-absolute top-0 end-0 m-3">
                    <span className="badge bg-dark bg-opacity-75 text-white shadow-sm">
                      <i className="bi bi-clock me-1"></i>
                      {exp.duracion}
                    </span>
                  </div>
                  <div className="position-absolute bottom-0 start-0 m-3">
                    <span className="badge bg-light text-dark shadow-sm">
                      <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                      {exp.ubicacion}
                    </span>
                  </div>
                </div>

                {/* CONTENIDO DEL TALLER */}
                <div className="card-body d-flex flex-column p-4">
                  <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: "0.75rem" }}>
                    Taller impartido por: <strong className="text-dark">{exp.artesano_nombre}</strong>
                  </small>
                  <h5 className="fw-bold mt-1 mb-2 text-dark">{exp.titulo}</h5>
                  <p
                    className="text-muted small mb-3"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: "1.6",
                    }}
                  >
                    {exp.descripcion}
                  </p>

                  <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>
                        Inversión por persona
                      </small>
                      <span className="fw-bold text-dark fs-5">
                        {formatoPrecio(exp.precio)}
                      </span>
                    </div>

                    <button
                      className="btn btn-dark btn-sm rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-1 shadow-sm"
                      onClick={() => abrirModalReserva(exp)}
                    >
                      <i className="bi bi-calendar-plus"></i>
                      Reservar Cupo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE RESERVA EN VIVO */}
      {experienciaSeleccionada && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.75)", zIndex: 1070 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-dark text-white border-0 py-3">
                <div>
                  <small className="text-warning fw-bold text-uppercase d-block" style={{ fontSize: "0.7rem" }}>
                    Reserva de Experiencia Tradicional
                  </small>
                  <h6 className="modal-title fw-bold text-white mb-0">
                    {experienciaSeleccionada.titulo}
                  </h6>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={cerrarModal}
                ></button>
              </div>

              <form onSubmit={handleConfirmarReserva}>
                <div className="modal-body p-4 bg-light">
                  {mensajeError && (
                    <div className="alert alert-danger py-2 small mb-3">
                      {mensajeError}
                    </div>
                  )}

                  <div className="card border-0 bg-white p-3 rounded-3 shadow-sm mb-3 small text-muted">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Maestro artesano:</span>
                      <strong className="text-dark">{experienciaSeleccionada.artesano_nombre}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span>Ubicación:</span>
                      <strong className="text-dark">{experienciaSeleccionada.ubicacion}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Precio unitario:</span>
                      <strong className="text-dark">{formatoPrecio(experienciaSeleccionada.precio)}</strong>
                    </div>
                  </div>

                  {/* SELECCIÓN DE FECHA */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark mb-1">
                      Fecha de visita al taller *
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      min={hoyStr}
                      value={fechaReserva}
                      onChange={(e) => setFechaReserva(e.target.value)}
                      required
                    />
                    <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                      Sujeto a disponibilidad del maestro.
                    </small>
                  </div>

                  {/* CANTIDAD DE CUPOS */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark mb-1">
                      Número de personas (Cupos) *
                    </label>
                    <select
                      className="form-select"
                      value={cupos}
                      onChange={(e) => setCupos(Number(e.target.value))}
                    >
                      {[...Array(experienciaSeleccionada.cupos_maximos || 6)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? "persona" : "personas"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* NOTAS O REQUERIMIENTOS ESPECIALES */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-dark mb-1">
                      Observaciones o requerimientos (Opcional)
                    </label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Ej. Transporte, alergias a materiales, horario de llegada..."
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                    ></textarea>
                  </div>

                  {/* TOTAL A PAGAR */}
                  <div className="d-flex justify-content-between align-items-center p-3 rounded-3 bg-white border">
                    <span className="fw-bold text-muted">Total a reservar:</span>
                    <span className="fs-5 fw-bold text-dark">
                      {formatoPrecio(experienciaSeleccionada.precio * cupos)}
                    </span>
                  </div>
                </div>

                <div className="modal-footer bg-white border-top py-3">
                  <button
                    type="button"
                    className="btn btn-light btn-sm px-3"
                    onClick={cerrarModal}
                    disabled={enviando}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-dark btn-sm px-4 fw-bold shadow-sm"
                    disabled={enviando}
                  >
                    {enviando ? "Confirmando..." : "Confirmar Reserva"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Experiencias;