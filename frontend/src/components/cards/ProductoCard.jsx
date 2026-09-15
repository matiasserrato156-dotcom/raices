import { Link } from "react-router-dom";

function ProductoCard({ producto, onAgregarCarrito, onToggleFavorito, esFavorito }) {
  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(Number(valor || 0));
  };

  const artesanoId = producto?.artesano_id || 1;
  const nombreArtesano = producto?.artesano || "Maestro Artesano";
  const calificacion = Number(producto?.calificacion || 4.8);

  return (
    <div className="card h-100 border-0 shadow-sm overflow-hidden d-flex flex-column justify-content-between">
      <div className="position-relative">
        <img
          src={
            producto?.imagen ||
            "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261"
          }
          alt={producto?.nombre || "Pieza Artesanal"}
          className="card-img-top"
          style={{ height: "230px", objectFit: "cover" }}
        />

        {/* Botón Favorito */}
        <button
          type="button"
          onClick={() => onToggleFavorito && onToggleFavorito(producto)}
          className="btn btn-light rounded-circle position-absolute top-0 end-0 m-3 p-2 shadow-sm d-flex align-items-center justify-content-center"
          style={{ width: "38px", height: "38px" }}
          aria-label="Guardar en favoritos"
        >
          <i
            className={`bi bi-heart${esFavorito ? "-fill text-danger" : ""}`}
            style={{ fontSize: "1.1rem" }}
          ></i>
        </button>

        {producto?.categoria && (
          <span className="badge bg-dark position-absolute bottom-0 start-0 m-3 px-2 py-1">
            {producto.categoria}
          </span>
        )}
      </div>

      <div className="card-body p-3 d-flex flex-column justify-content-between">
        <div>
          {/* Enlace al Perfil del Artesano */}
          <div className="mb-1">
            <Link
              to={`/artesano/${artesanoId}`}
              className="text-decoration-none text-muted small fw-semibold d-inline-flex align-items-center gap-1"
            >
              <i className="bi bi-person-circle"></i>
              <span>Por: {nombreArtesano}</span>
            </Link>
          </div>

          <h5 className="card-title fw-bold fs-6 mb-2 text-dark">
            {producto?.nombre}
          </h5>

          {/* Calificación y Estrellas */}
          <div className="d-flex align-items-center gap-1 mb-2">
            <div className="text-warning small">
              {[1, 2, 3, 4, 5].map((estrella) => (
                <i
                  key={estrella}
                  className={`bi bi-star${
                    estrella <= Math.round(calificacion) ? "-fill" : ""
                  }`}
                ></i>
              ))}
            </div>
            <span className="small text-muted fw-bold ms-1">
              {calificacion.toFixed(1)}
            </span>
          </div>

          <p className="card-text text-secondary small line-clamp-2 mb-3">
            {producto?.descripcion ||
              "Pieza elaborada con técnicas ancestrales y materiales autóctonos."}
          </p>
        </div>

        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted small">Precio:</span>
            <span className="fs-5 fw-bold text-dark">
              {formatoMoneda(producto?.precio)}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-dark w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={() => onAgregarCarrito && onAgregarCarrito(producto)}
          >
            <i className="bi bi-bag-plus"></i>
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductoCard;