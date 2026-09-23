import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [editando, setEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "Artesanías",
    imagen: null,
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      setError("");

      const response = await api.get("/productos");

      const datos = Array.isArray(response.data)
        ? response.data
        : response.data?.productos || [];

      setProductos(datos);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "No fue posible cargar los productos."
      );
    } finally {
      setCargando(false);
    }
  };

  const limpiarFormulario = () => {
    setFormulario({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      categoria: "Artesanías",
      imagen: null,
    });

    setEditando(null);
  };

  const cambiarCampo = (e) => {
    const { name, value, files } = e.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: files ? files[0] : value,
    }));
  };

  const guardarProducto = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");
    setGuardando(true);

    try {
      const datos = new FormData();

      datos.append("nombre", formulario.nombre);
      datos.append("descripcion", formulario.descripcion);
      datos.append("precio", formulario.precio);
      datos.append("stock", formulario.stock);
      datos.append("categoria", formulario.categoria);

      if (formulario.imagen) {
        datos.append("imagen", formulario.imagen);
      }

      if (editando) {
        datos.append("_method", "PUT");

        await api.post(
          `/productos/${editando.id}`,
          datos,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setMensaje("Producto actualizado correctamente.");
      } else {
        await api.post(
          "/productos",
          datos,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setMensaje("Producto creado correctamente.");
      }

      limpiarFormulario();

      await cargarProductos();
    } catch (err) {
      console.error(err);

      if (err.response?.data?.errors) {
        const errores = Object.values(
          err.response.data.errors
        )
          .flat()
          .join(" ");

        setError(errores);
      } else {
        setError(
          err.response?.data?.message ||
            "No fue posible guardar el producto."
        );
      }
    } finally {
      setGuardando(false);
    }
  };

  const editarProducto = (producto) => {
    setMensaje("");
    setError("");

    setEditando(producto);

    setFormulario({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      precio: producto.precio || "",
      stock: producto.stock ?? "",
      categoria: producto.categoria || "Artesanías",
      imagen: null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const eliminarProducto = async (producto) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar "${producto.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    setMensaje("");
    setError("");

    try {
      await api.delete(`/productos/${producto.id}`);

      setMensaje("Producto eliminado correctamente.");

      if (editando?.id === producto.id) {
        limpiarFormulario();
      }

      await cargarProductos();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "No fue posible eliminar el producto."
      );
    }
  };

  const obtenerImagen = (imagen) => {
    if (!imagen) {
      return null;
    }

    if (
      imagen.startsWith("http://") ||
      imagen.startsWith("https://")
    ) {
      return imagen;
    }

    const backendURL = import.meta.env.PROD
      ? "https://raices-backend-final.onrender.com"
      : "http://127.0.0.1:8000";

    if (imagen.startsWith("/storage/")) {
      return `${backendURL}${imagen}`;
    }

    if (imagen.startsWith("/")) {
      return `${backendURL}${imagen}`;
    }

    return `${backendURL}/storage/${imagen}`;
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(Number(precio || 0));
  };

  return (
    <div className="container py-5">

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

        <div>
          <p className="text-uppercase fw-bold mb-1">
            Administración
          </p>

          <h1 className="fw-bold mb-1">
            Productos
          </h1>

          <p className="text-muted mb-0">
            Gestiona el catálogo de RAÍCES.
          </p>
        </div>

        <div className="text-end">
          <div className="fs-3 fw-bold">
            {productos.length}
          </div>

          <div className="text-muted">
            productos
          </div>
        </div>

      </div>

      {mensaje && (
        <div className="alert alert-success">
          <i className="bi bi-check-circle me-2"></i>
          {mensaje}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      <div className="card border-0 shadow-sm mb-5">

        <div className="card-body p-4">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <div>
              <h3 className="fw-bold mb-1">
                {editando
                  ? "Editar producto"
                  : "Nuevo producto"}
              </h3>

              <p className="text-muted mb-0">
                {editando
                  ? "Actualiza la información del producto."
                  : "Agrega una nueva creación al catálogo."}
              </p>
            </div>

            {editando && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={limpiarFormulario}
              >
                <i className="bi bi-x-lg me-2"></i>
                Cancelar
              </button>
            )}

          </div>

          <form onSubmit={guardarProducto}>

            <div className="row g-3">

              <div className="col-md-6">

                <label className="form-label fw-bold">
                  Nombre
                </label>

                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={formulario.nombre}
                  onChange={cambiarCampo}
                  required
                  maxLength={255}
                  placeholder="Ej. Mochila artesanal"
                />

              </div>

              <div className="col-md-3">

                <label className="form-label fw-bold">
                  Precio
                </label>

                <input
                  type="number"
                  name="precio"
                  className="form-control"
                  value={formulario.precio}
                  onChange={cambiarCampo}
                  min="0"
                  step="0.01"
                  required
                  placeholder="85000"
                />

              </div>

              <div className="col-md-3">

                <label className="form-label fw-bold">
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  className="form-control"
                  value={formulario.stock}
                  onChange={cambiarCampo}
                  min="0"
                  required
                  placeholder="10"
                />

              </div>

              <div className="col-md-6">

                <label className="form-label fw-bold">
                  Categoría
                </label>

                <input
                  type="text"
                  name="categoria"
                  className="form-control"
                  value={formulario.categoria}
                  onChange={cambiarCampo}
                  required
                  maxLength={255}
                />

              </div>

              <div className="col-md-6">

                <label className="form-label fw-bold">
                  Imagen
                </label>

                <input
                  type="file"
                  name="imagen"
                  className="form-control"
                  onChange={cambiarCampo}
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                />

                <div className="form-text">
                  JPG, JPEG, PNG o WEBP. Máximo 5 MB.
                </div>

              </div>

              <div className="col-12">

                <label className="form-label fw-bold">
                  Descripción
                </label>

                <textarea
                  name="descripcion"
                  className="form-control"
                  rows="4"
                  value={formulario.descripcion}
                  onChange={cambiarCampo}
                  placeholder="Describe el producto..."
                />

              </div>

            </div>

            <div className="mt-4">

              <button
                type="submit"
                className="btn btn-dark btn-lg"
                disabled={guardando}
              >
                {guardando ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>

                    Guardando...
                  </>
                ) : (
                  <>
                    <i
                      className={`bi ${
                        editando
                          ? "bi-pencil-square"
                          : "bi-plus-lg"
                      } me-2`}
                    ></i>

                    {editando
                      ? "Guardar cambios"
                      : "Crear producto"}
                  </>
                )}
              </button>

            </div>

          </form>

        </div>

      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">

        <div>
          <h2 className="fw-bold mb-1">
            Catálogo
          </h2>

          <p className="text-muted mb-0">
            Productos registrados actualmente.
          </p>
        </div>

        <button
          className="btn btn-outline-dark"
          onClick={cargarProductos}
          disabled={cargando}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Actualizar
        </button>

      </div>

      {cargando ? (

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
            Cargando productos...
          </p>

        </div>

      ) : productos.length === 0 ? (

        <div className="text-center py-5">

          <i className="bi bi-box-seam display-3"></i>

          <h4 className="fw-bold mt-3">
            No hay productos
          </h4>

          <p className="text-muted">
            Crea el primer producto del catálogo.
          </p>

        </div>

      ) : (

        <div className="row g-4">

          {productos.map((producto) => (

            <div
              className="col-md-6 col-lg-4"
              key={producto.id}
            >

              <div className="card h-100 border-0 shadow-sm overflow-hidden">

                {obtenerImagen(producto.imagen) ? (

                  <img
                    src={obtenerImagen(producto.imagen)}
                    alt={producto.nombre}
                    className="card-img-top"
                    style={{
                      height: "230px",
                      objectFit: "cover",
                    }}
                  />

                ) : (

                  <div
                    className="d-flex align-items-center justify-content-center bg-light"
                    style={{
                      height: "230px",
                    }}
                  >
                    <i className="bi bi-image display-3 text-muted"></i>
                  </div>

                )}

                <div className="card-body">

                  <div className="d-flex justify-content-between align-items-start gap-2 mb-2">

                    <h5 className="fw-bold mb-0">
                      {producto.nombre}
                    </h5>

                    <span className="badge text-bg-light">
                      #{producto.id}
                    </span>

                  </div>

                  <span className="badge bg-secondary mb-3">
                    {producto.categoria}
                  </span>

                  <p className="text-muted small">
                    {producto.descripcion ||
                      "Sin descripción."}
                  </p>

                  <div className="d-flex justify-content-between align-items-center mb-3">

                    <span className="fw-bold fs-5">
                      {formatearPrecio(producto.precio)}
                    </span>

                    <span
                      className={
                        Number(producto.stock) > 0
                          ? "badge text-bg-success"
                          : "badge text-bg-danger"
                      }
                    >
                      Stock: {producto.stock}
                    </span>

                  </div>

                  <div className="small text-muted mb-3">
                    <i className="bi bi-person me-2"></i>
                    {producto.user?.name ||
                      "Administrador"}
                  </div>

                  <div className="d-flex gap-2">

                    <button
                      type="button"
                      className="btn btn-outline-dark flex-grow-1"
                      onClick={() =>
                        editarProducto(producto)
                      }
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Editar
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() =>
                        eliminarProducto(producto)
                      }
                    >
                      <i className="bi bi-trash"></i>
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

export default AdminProductos;