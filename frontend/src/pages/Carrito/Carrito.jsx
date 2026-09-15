import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../../context/CarritoContext";

function Carrito() {
  const {
    carrito,
    quitarDelCarrito,
    aumentarCantidad,
    disminuirCantidad,
    vaciarCarrito,
    totalCarrito,
  } = useCarrito();

  const navigate = useNavigate();

  const formatoMoneda = (val) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(Number(val || 0));

  if (!carrito || carrito.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="py-5">
          <i className="bi bi-cart-x display-1 text-muted"></i>
          <h2 className="fw-bold mt-4">Tu canasta está vacía</h2>
          <p className="text-muted mb-4">
            Explora nuestras piezas artesanales para iniciar tu compra.
          </p>
          <Link to="/productos" className="btn btn-dark px-4 py-2">
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Canasta de Compras</h2>
        <button onClick={vaciarCarrito} className="btn btn-outline-danger btn-sm">
          <i className="bi bi-trash3 me-1"></i> Vaciar canasta
        </button>
      </div>

      <div className="row g-4">
        {/* LISTADO DE ITEMS */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-3">
            {carrito.map((item) => (
              <div
                key={item.id}
                className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between py-3 border-bottom gap-3"
              >
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={
                      item.imagen ||
                      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261"
                    }
                    alt={item.nombre}
                    className="rounded-3"
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />
                  <div>
                    <h6 className="fw-bold mb-1">{item.nombre}</h6>
                    <small className="text-muted d-block mb-1">
                      {item.artesano ? `Por: ${item.artesano}` : item.categoria}
                    </small>
                    <span className="fw-bold text-dark">
                      {formatoMoneda(item.precio)}
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-3">
                  {/* Selector de cantidad conectado al contexto */}
                  <div className="input-group input-group-sm" style={{ width: "110px" }}>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => disminuirCantidad(item.id)}
                    >
                      -
                    </button>
                    <span className="input-group-text bg-white px-3 fw-bold">
                      {item.cantidad}
                    </span>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => aumentarCantidad(item.id)}
                    >
                      +
                    </button>
                  </div>

                  <div className="text-end" style={{ minWidth: "100px" }}>
                    <div className="fw-bold text-dark">
                      {formatoMoneda((item.precio || 0) * item.cantidad)}
                    </div>
                  </div>

                  <button
                    onClick={() => quitarDelCarrito(item.id)}
                    className="btn btn-link text-danger p-0"
                    title="Eliminar producto"
                  >
                    <i className="bi bi-x-lg fs-5"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RESUMEN DEL PEDIDO */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Resumen de Compra</h5>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal productos:</span>
              <span className="fw-semibold">{formatoMoneda(totalCarrito)}</span>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Envío artesanal:</span>
              <span className="text-success fw-semibold">Gratis</span>
            </div>

            <hr className="opacity-25" />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fs-5 fw-bold">Total a Pagar:</span>
              <span className="fs-4 fw-bold text-dark">
                {formatoMoneda(totalCarrito)}
              </span>
            </div>

            <button
              className="btn btn-dark w-100 py-2 fw-semibold mb-2"
              onClick={() => navigate("/checkout")}
            >
              Proceder al Checkout
            </button>

            <Link
              to="/productos"
              className="btn btn-outline-secondary w-100 py-2 btn-sm"
            >
              Seguir explorando piezas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carrito;