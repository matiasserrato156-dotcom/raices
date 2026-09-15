import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

function PerfilArtesano() {
  const { id } = useParams();
  const [artesano, setArtesano] = useState(null);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarPerfil = async () => {
      setCargando(true);
      setError("");
      try {
        const res = await api.get(`/artesanos/${id}`);
        setArtesano(res.data.artesano);
        setProductos(res.data.productos || []);
      } catch (err) {
        console.error("Error al cargar perfil de artesano:", err);
        setError("No se pudo cargar la información del maestro artesano.");
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, [id]);

  const formatoPrecio = (precio) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(Number(precio || 0));

  if (cargando) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark" role="status"></div>
        <p className="mt-3 text-muted">Cargando perfil ancestral...</p>
      </div>
    );
  }

  if (error || !artesano) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
          {error || "Maestro artesano no encontrado."}
        </div>
        <Link to="/productos" className="btn btn-dark btn-sm mt-3">
          ← Volver al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container-fluid px-lg-5 py-4">
      {/* TARJETA MAESTRA DE PERFIL */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5 bg-white">
        <div
          style={{
            height: "180px",
            background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
          }}
        ></div>

        <div className="card-body px-4 px-md-5 pb-4 position-relative">
          <div className="d-flex flex-column flex-md-row align-items-md-end gap-4 mt-n5 mb-4" style={{ marginTop: "-80px" }}>
            <img
              src={
                artesano.foto ||
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2"
              }
              alt={artesano.nombre}
              className="rounded-circle border border-4 border-white shadow"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />

            <div className="flex-grow-1">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                <h2 className="fw-bold mb-0 text-dark">{artesano.nombre}</h2>
                {artesano.verificado && (
                  <span className="badge bg-success text-white px-3 py-2 rounded-pill shadow-sm d-inline-flex align-items-center gap-1">
                    <i className="bi bi-patch-check-fill"></i>
                    Sello de Autenticidad Verificado
                  </span>
                )}
              </div>
              <p className="text-muted mb-0 fs-5">
                {artesano.oficio} • {artesano.comunidad} ({artesano.departamento})
              </p>
            </div>

            <div className="d-flex gap-2">
              {artesano.telefono && (
                <a
                  href={`https://wa.me/${artesano.telefono.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-success btn-sm rounded-pill px-3 py-2 d-flex align-items-center gap-1"
                >
                  <i className="bi bi-whatsapp"></i> Contactar Taller
                </a>
              )}
            </div>
          </div>

          <div className="row g-4 pt-3 border-top">
            <div className="col-12 col-md-7">
              <h5 className="fw-bold text-dark mb-2">Trayectoria y Oficio</h5>
              <p className="text-muted" style={{ lineHeight: "1.7" }}>
                {artesano.biografia}
              </p>

              {artesano.historia_cultural && (
                <div className="p-3 rounded-3 bg-light border-start border-4 border-warning mt-3">
                  <h6 className="fw-bold text-dark mb-1">Preservación de Tradición</h6>
                  <p className="small text-muted mb-0">{artesano.historia_cultural}</p>
                </div>
              )}
            </div>

            <div className="col-12 col-md-5">
              <div className="card border-0 bg-light p-4 rounded-3">
                <h6 className="fw-bold text-dark mb-3">Información del Saber Tradicional</h6>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small text-muted">
                  <li>
                    <strong className="text-dark">Años de maestría:</strong> {artesano.anios_experiencia} años
                  </li>
                  <li>
                    <strong className="text-dark">Territorio:</strong> {artesano.comunidad}
                  </li>
                  <li>
                    <strong className="text-dark">Especialidad:</strong> {artesano.oficio}
                  </li>
                  <li>
                    <strong className="text-dark">Validación Raíces:</strong> Identidad comunitaria acreditada
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OBRAS DEL ARTESANO */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="badge bg-warning text-dark text-uppercase fw-bold mb-1">Catálogo Exclusivo</span>
          <h3 className="fw-bold mb-0">Piezas Creadas por {artesano.nombre}</h3>
        </div>
        <Link to="/productos" className="btn btn-outline-dark btn-sm rounded-pill px-3">
          Ver todo el mercado →
        </Link>
      </div>

      {productos.length === 0 ? (
        <div className="card border-0 shadow-sm p-4 text-center bg-white rounded-3">
          <p className="text-muted small mb-0">
            Este artesano está elaborando nuevas piezas en su taller en este momento.
          </p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {productos.map((prod) => (
            <div key={prod.id} className="col">
              <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden d-flex flex-column">
                <div style={{ height: "200px" }}>
                  <img
                    src={prod.imagen || "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261"}
                    alt={prod.nombre}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="card-body d-flex flex-column p-3">
                  <h6 className="fw-bold mb-1 text-truncate">{prod.nombre}</h6>
                  <p className="text-muted small text-truncate-2 mb-2">{prod.descripcion}</p>
                  <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark">{formatoPrecio(prod.precio)}</span>
                    <Link to={`/productos/${prod.id}`} className="btn btn-dark btn-sm py-1 px-2">
                      Ver Pieza
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PerfilArtesano;