import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState("Todas");

  // =====================================================
  // OBTENER URL REAL DE LA IMAGEN
  // =====================================================

  const obtenerImagenProducto = (imagen) => {
    const imagenRespaldo =
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261";

    if (!imagen) {
      return imagenRespaldo;
    }

    const valor = String(imagen).trim();

    if (!valor) {
      return imagenRespaldo;
    }

    // URL completa
    if (
      valor.startsWith("http://") ||
      valor.startsWith("https://")
    ) {
      return valor;
    }

    // /storage/productos/...
    if (valor.startsWith("/storage/")) {
      return "http://127.0.0.1:8000" + valor;
    }

    // storage/productos/...
    if (valor.startsWith("storage/")) {
      return "http://127.0.0.1:8000/" + valor;
    }

    // productos/...
    return "http://127.0.0.1:8000/storage/" + valor;
  };

  // =====================================================
  // CARGAR PRODUCTOS
  // =====================================================

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true);
        setError("");

        const respuesta = await api.get("/productos");

        const datos = respuesta.data;

        const lista = Array.isArray(datos)
          ? datos
          : Array.isArray(datos?.data)
          ? datos.data
          : [];

        setProductos(lista);
      } catch (error) {
        console.error("Error cargando productos:", error);

        setError(
          error?.response?.data?.message ||
            "No se pudieron cargar los productos."
        );

        setProductos([]);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  // =====================================================
  // CATEGORÍAS
  // =====================================================

  const categorias = [
    "Todas",
    ...new Set(
      productos
        .map((producto) => producto.categoria)
        .filter(Boolean)
    ),
  ];

  // =====================================================
  // FILTRAR PRODUCTOS
  // =====================================================

  const productosFiltrados =
    categoriaSeleccionada === "Todas"
      ? productos
      : productos.filter(
          (producto) =>
            producto.categoria === categoriaSeleccionada
        );

  // =====================================================
  // FORMATO DE PRECIO
  // =====================================================

  const formatoPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(Number(precio || 0));
  };

  // =====================================================
  // CARGANDO
  // =====================================================

  if (cargando) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div
            className="spinner-border"
            role="status"
          >
            <span className="visually-hidden">
              Cargando...
            </span>
          </div>

          <p className="text-muted mt-3">
            Cargando artesanías...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h5 className="fw-bold">
            No se pudieron cargar las artesanías
          </h5>

          <p className="mb-0">
            {error}
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // VISTA PRINCIPAL
  // =====================================================

  return (
    <div className="container py-5">

      {/* ================================================= */}
      {/* ENCABEZADO */}
      {/* ================================================= */}

      <div className="text-center mb-5">
        <h1 className="fw-bold">
          Artesanías
        </h1>

        <p className="text-muted">
          Descubre productos artesanales
          hechos por creadores colombianos.
        </p>
      </div>

      {/* ================================================= */}
      {/* FILTROS */}
      {/* ================================================= */}

      {categorias.length > 1 && (
        <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              className={
                categoriaSeleccionada === categoria
                  ? "btn btn-dark"
                  : "btn btn-outline-dark"
              }
              onClick={() =>
                setCategoriaSeleccionada(categoria)
              }
            >
              {categoria}
            </button>
          ))}
        </div>
      )}

      {/* ================================================= */}
      {/* SIN PRODUCTOS */}
      {/* ================================================= */}

      {productosFiltrados.length === 0 ? (
        <div className="text-center py-5">

          <div
            style={{
              fontSize: "4rem",
            }}
          >
            🧺
          </div>

          <h3 className="fw-bold mt-3">
            No hay artesanías disponibles
          </h3>

          <p className="text-muted">
            Actualmente no encontramos productos
            en esta categoría.
          </p>

          {categoriaSeleccionada !== "Todas" && (
            <button
              type="button"
              className="btn btn-dark mt-2"
              onClick={() =>
                setCategoriaSeleccionada("Todas")
              }
            >
              Ver todas
            </button>
          )}
        </div>
      ) : (

        /* ================================================= */
        /* PRODUCTOS */
        /* ================================================= */

        <div className="row g-4">

          {productosFiltrados.map((producto) => {

            // =================================================
            // IMAGEN DEL PRODUCTO
            // =================================================

            const imagenSrc =
              obtenerImagenProducto(
                producto.imagen ||
                  producto.imagen_url
              );

            return (
              <div
                className="col-12 col-sm-6 col-lg-4 col-xl-3"
                key={producto.id}
              >

                <div className="card h-100 border-0 shadow-sm">

                  {/* ========================================= */}
                  {/* IMAGEN */}
                  {/* ========================================= */}

                  <div
                    style={{
                      height: "260px",
                      overflow: "hidden",
                      backgroundColor: "#f8f9fa",
                    }}
                  >

                    <img
                      src={imagenSrc}
                      alt={
                        producto.nombre ||
                        "Producto artesanal"
                      }
                      className="w-100 h-100"
                      style={{
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;

                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261";
                      }}
                    />

                  </div>

                  {/* ========================================= */}
                  {/* INFORMACIÓN */}
                  {/* ========================================= */}

                  <div className="card-body d-flex flex-column">

                    {/* CATEGORÍA */}

                    {producto.categoria && (
                      <span
                        className="badge bg-dark align-self-start mb-2"
                      >
                        {producto.categoria}
                      </span>
                    )}

                    {/* NOMBRE */}

                    <h5 className="card-title fw-bold">
                      {producto.nombre}
                    </h5>

                    {/* DESCRIPCIÓN */}

                    {producto.descripcion && (
                      <p className="card-text text-muted small">
                        {producto.descripcion.length > 100
                          ? producto.descripcion.substring(
                              0,
                              100
                            ) + "..."
                          : producto.descripcion}
                      </p>
                    )}

                    {/* PRECIO */}

                    <div className="mt-auto">

                      <div className="fw-bold fs-5 mb-3">
                        {formatoPrecio(
                          producto.precio
                        )}
                      </div>

                      {/* VER PRODUCTO */}

                      <Link
                        to={"/productos/" + producto.id}
                        className="btn btn-dark w-100"
                      >
                        Ver producto
                      </Link>

                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default Productos;