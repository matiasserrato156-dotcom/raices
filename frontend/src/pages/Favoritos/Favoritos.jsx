import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensajeExito, setMensajeExito] = useState("");

  const formatoPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(Number(precio || 0));
  };

  const cargarFavoritos = () => {
    try {
      setCargando(true);
      const guardados = localStorage.getItem("favoritos_raices");
      if (guardados) {
        setFavoritos(JSON.parse(guardados));
      } else {
        setFavoritos([]);
      }
    } catch (err) {
      console.error("Error al cargar favoritos:", err);
      setFavoritos([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarFavoritos();
  }, []);

  const eliminarDeFavoritos = (id) => {
    const actualizados = favoritos.filter((item) => item.id !== id);
    setFavoritos(actualizados);
    localStorage.setItem("favoritos_raices", JSON.stringify(actualizados));
    window.dispatchEvent(new Event("favoritosActualizados"));
  };

  const agregarAlCarrito = async (producto) => {
    try {
      // Registrar en el endpoint del carrito
      await api.post("/carrito", {
        producto_id: producto.id,
        cantidad: 1,
      });

      setMensajeExito(`¡"${producto.nombre}" se agregó al carrito!`);
      setTimeout(() => setMensajeExito(""), 3000);
      window.dispatchEvent(new Event("carritoActualizado"));
    } catch (err) {
      console.error("Error al agregar al carrito desde favoritos:", err);
      // Respaldo en localStorage si el backend no responde
      try {
        const carritoLocal = JSON.parse(localStorage.getItem("carrito_raices") || "[]");
        const index = carritoLocal.findIndex((i) => i.id === producto.id);
        if (index > -1) {
          carritoLocal[index].cantidad += 1;
        } else {
          carritoLocal.push({ ...producto, cantidad: 1 });
        }
        localStorage.setItem("carrito_raices", JSON.stringify(carritoLocal));
        setMensajeExito(`¡"${producto.nombre}" se agregó al carrito!`);
        setTimeout(() => setMensajeExito(""), 3000);
        window.dispatchEvent(new Event("carritoActualizado"));
      } catch (e) {
        console.error("Error local de carrito:", e);
      }
    }
  };

  const formatearUrlImagen = (ruta) => {
    if (!ruta) return "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d";
    if (ruta.startsWith("http://") || ruta.startsWith("https://")) return ruta;
    if (ruta.startsWith("/storage/") || ruta.startsWith("/")) {
      return `http://127.0.0.1:8000${ruta}`;
    }
    return `http://127.0.0.1:8000/storage/${ruta}`;
  };

  if (cargando) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark" role="status" />
        <p className="mt-3 text-muted">Cargando tus piezas favoritas...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="badge bg-danger text-uppercase px-3 py-1 mb-2">
            Colección Personal
          </span>
          <h1 className="fw-bold mb-1">Mis Favoritos</h1>
          <p className="text-muted mb-0">
            Artesanías que has guardado para comprar más adelante.
          </p>
        </div>

        <Link to="/productos" className="btn btn-outline-dark">
          Explorar catálogo
        </Link>
      </div>

      {mensajeExito && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {mensajeExito}
        </div>
      )}

      {favoritos.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4 my-4 p-5">
          <i className="bi bi-heart display-1 text-muted"></i>
          <h3 className="fw-bold mt-3">Aún no tienes artesanías en favoritos</h3>
          <p className="text-muted mb-4">
            Explora nuestro catálogo cultural y haz clic en el icono del corazón para guardar tus piezas predilectas.
          </p>
          <Link to="/productos" className="btn btn-dark btn-lg px-4">
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {favoritos.map((producto) => (
            <div className="col-md-6 col-lg-4" key={producto.id}>
              <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden">
                <button
                  type="button"
                  className="btn btn-sm btn-light position-absolute top-0 end-0 m-3 shadow-sm rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "36px", height: "36px", zIndex: 10 }}
                  onClick={() => eliminarDeFavoritos(producto.id)}
                  title="Quitar de favoritos"
                >
                  <i className="bi bi-heart-fill text-danger"></i>
                </button>

                <img
                  src={formatearUrlImagen(producto.imagen)}
                  className="card-img-top"
                  alt={producto.nombre}
                  style={{ height: "230px", objectFit: "cover" }}
                />

                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <span className="badge bg-secondary mb-2 text-uppercase">
                      {producto.categoria || "Artesanía"}
                    </span>
                    <h5 className="fw-bold mb-1">{producto.nombre}</h5>
                    <small className="text-muted d-block mb-3">
                      {producto.user?.name ? `Por: ${producto.user.name}` : "Maestro Artesano"}
                    </small>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="fs-5 fw-bold text-dark">
                        {formatoPrecio(producto.precio)}
                      </span>
                      <small className={Number(producto.stock) > 0 ? "text-success fw-semibold" : "text-danger"}>
                        {Number(producto.stock) > 0 ? `✓ ${producto.stock} disponibles` : "Agotado"}
                      </small>
                    </div>

                    <button
                      type="button"
                      className="btn btn-dark w-100"
                      onClick={() => agregarAlCarrito(producto)}
                      disabled={Number(producto.stock) <= 0}
                    >
                      <i className="bi bi-cart-plus me-2"></i>
                      {Number(producto.stock) > 0 ? "Agregar al carrito" : "Sin existencias"}
                    </button>
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

export default Favoritos;