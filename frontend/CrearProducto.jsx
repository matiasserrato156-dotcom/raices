import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCloudUploadAlt,
  FaImage,
  FaSave,
  FaTimes,
  FaBoxOpen,
} from "react-icons/fa";

const API_URL = "http://127.0.0.1:8000/api";

const CATEGORIAS = [
  "Artesanías",
  "Textiles",
  "Cerámica",
  "Joyería",
  "Cestería",
  "Madera",
  "Cuero",
  "Instrumentos",
  "Arte indígena",
  "Gastronomía",
  "Otros",
];

export default function CrearProducto() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "",
  });

  const [imagen, setImagen] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState("");

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState("");

  useEffect(() => {
    try {
      const usuarioGuardado = localStorage.getItem("usuario");

      if (!usuarioGuardado) {
        navigate("/login");
        return;
      }

      const usuarioActual = JSON.parse(usuarioGuardado);

      const rolesPermitidos = [
        "artesano",
        "emprendedor",
        "admin",
      ];

      if (!rolesPermitidos.includes(usuarioActual.role)) {
        navigate("/productos");
        return;
      }

      setUsuario(usuarioActual);
    } catch (e) {
      console.error(e);
      navigate("/login");
    }
  }, [navigate]);

  const cambiarCampo = (e) => {
    const { name, value } = e.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));

    setErrores((actual) => ({
      ...actual,
      [name]: "",
    }));

    setError("");
    setExito("");
  };

  const seleccionarImagen = (e) => {
    const archivo = e.target.files?.[0];

    if (!archivo) {
      setImagen(null);
      setVistaPrevia("");
      return;
    }

    if (!archivo.type.startsWith("image/")) {
      setImagen(null);
      setVistaPrevia("");
      setError("El archivo seleccionado debe ser una imagen.");
      e.target.value = "";
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      setImagen(null);
      setVistaPrevia("");
      setError("La imagen no puede superar los 5 MB.");
      e.target.value = "";
      return;
    }

    setImagen(archivo);
    setErrores((actual) => ({
      ...actual,
      imagen: "",
    }));
    setError("");
    setExito("");

    const lector = new FileReader();

    lector.onload = (evento) => {
      setVistaPrevia(evento.target.result);
    };

    lector.readAsDataURL(archivo);
  };

  const quitarImagen = () => {
    setImagen(null);
    setVistaPrevia("");

    const input = document.getElementById("imagen-producto");

    if (input) {
      input.value = "";
    }
  };

  const validar = () => {
    const nuevosErrores = {};

    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = "El nombre del producto es obligatorio.";
    }

    if (!formulario.descripcion.trim()) {
      nuevosErrores.descripcion =
        "La descripción del producto es obligatoria.";
    }

    if (!formulario.precio) {
      nuevosErrores.precio = "Ingresa el precio.";
    } else if (Number(formulario.precio) < 0) {
      nuevosErrores.precio = "El precio no puede ser negativo.";
    }

    if (
      formulario.stock === "" ||
      formulario.stock === null ||
      formulario.stock === undefined
    ) {
      nuevosErrores.stock = "Ingresa la cantidad disponible.";
    } else if (
      !Number.isInteger(Number(formulario.stock)) ||
      Number(formulario.stock) < 0
    ) {
      nuevosErrores.stock =
        "El stock debe ser un número entero mayor o igual a 0.";
    }

    if (!formulario.categoria) {
      nuevosErrores.categoria = "Selecciona una categoría.";
    }

    if (!imagen) {
      nuevosErrores.imagen = "Debes seleccionar una imagen del producto.";
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const crearProducto = async (e) => {
    e.preventDefault();

    setError("");
    setExito("");

    if (!validar()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setGuardando(true);

    try {
      const datos = new FormData();

      datos.append("nombre", formulario.nombre.trim());
      datos.append(
        "descripcion",
        formulario.descripcion.trim()
      );
      datos.append("precio", formulario.precio);
      datos.append("stock", formulario.stock);
      datos.append("categoria", formulario.categoria);
      datos.append("imagen", imagen);

      const respuesta = await fetch(`${API_URL}/productos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: datos,
      });

      const contenido = await respuesta.json().catch(() => null);

      if (respuesta.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        navigate("/login");
        return;
      }

      if (respuesta.status === 403) {
        throw new Error(
          contenido?.message ||
            "No tienes permisos para crear productos."
        );
      }

      if (respuesta.status === 422) {
        const erroresServidor = contenido?.errors || {};

        setErrores(erroresServidor);

        throw new Error(
          contenido?.message ||
            "Revisa los datos del formulario."
        );
      }

      if (!respuesta.ok) {
        throw new Error(
          contenido?.message ||
            "No fue posible crear el producto."
        );
      }

      setExito(
        "¡Producto creado correctamente! Ya está disponible en el catálogo."
      );

      setFormulario({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria: "",
      });

      quitarImagen();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      setTimeout(() => {
        navigate("/productos");
      }, 1800);
    } catch (err) {
      console.error("Error creando producto:", err);

      setError(
        err.message ||
          "Ocurrió un error al crear el producto."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setGuardando(false);
    }
  };

  if (!usuario) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status" />
        <p className="mt-3">Cargando...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        background:
          "linear-gradient(180deg, #f7f4ed 0%, #ffffff 100%)",
      }}
    >
      <div className="container py-4 py-lg-5">

        <div className="mb-4">
          <Link
            to="/productos"
            className="text-decoration-none text-dark d-inline-flex align-items-center gap-2"
          >
            <FaArrowLeft />
            Volver a productos
          </Link>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">

            <div className="text-center mb-4">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: 70,
                  height: 70,
                  background: "#e9f5ec",
                  color: "#2f6f44",
                  fontSize: "1.8rem",
                }}
              >
                <FaBoxOpen />
              </div>

              <h1 className="fw-bold mb-2">
                Crear producto
              </h1>

              <p className="text-muted mb-0">
                Publica tu producto artesanal y hazlo visible
                en el catálogo de RAÍCES.
              </p>
            </div>

            {error && (
              <div
                className="alert alert-danger d-flex align-items-start gap-2"
                role="alert"
              >
                <span>⚠️</span>
                <div>{error}</div>
              </div>
            )}

            {exito && (
              <div
                className="alert alert-success d-flex align-items-start gap-2"
                role="alert"
              >
                <span>✓</span>
                <div>{exito}</div>
              </div>
            )}

            <form onSubmit={crearProducto}>

              <div className="row g-4">

                {/* INFORMACIÓN */}
                <div className="col-12 col-lg-7">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-4">

                      <h4 className="fw-bold mb-4">
                        Información del producto
                      </h4>

                      <div className="mb-3">
                        <label
                          htmlFor="nombre"
                          className="form-label fw-semibold"
                        >
                          Nombre del producto *
                        </label>

                        <input
                          id="nombre"
                          name="nombre"
                          type="text"
                          className={`form-control ${
                            errores.nombre
                              ? "is-invalid"
                              : ""
                          }`}
                          value={formulario.nombre}
                          onChange={cambiarCampo}
                          placeholder="Ej. Mochila Arhuaca Tradicional"
                          maxLength={255}
                        />

                        {errores.nombre && (
                          <div className="invalid-feedback">
                            {Array.isArray(errores.nombre)
                              ? errores.nombre[0]
                              : errores.nombre}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="descripcion"
                          className="form-label fw-semibold"
                        >
                          Descripción *
                        </label>

                        <textarea
                          id="descripcion"
                          name="descripcion"
                          className={`form-control ${
                            errores.descripcion
                              ? "is-invalid"
                              : ""
                          }`}
                          value={formulario.descripcion}
                          onChange={cambiarCampo}
                          placeholder="Cuenta la historia, materiales y características de tu producto..."
                          rows={6}
                        />

                        {errores.descripcion && (
                          <div className="invalid-feedback">
                            {Array.isArray(
                              errores.descripcion
                            )
                              ? errores.descripcion[0]
                              : errores.descripcion}
                          </div>
                        )}
                      </div>

                      <div className="row g-3">

                        <div className="col-12 col-md-6">
                          <label
                            htmlFor="precio"
                            className="form-label fw-semibold"
                          >
                            Precio (COP) *
                          </label>

                          <div className="input-group">
                            <span className="input-group-text">
                              $
                            </span>

                            <input
                              id="precio"
                              name="precio"
                              type="number"
                              min="0"
                              step="1"
                              className={`form-control ${
                                errores.precio
                                  ? "is-invalid"
                                  : ""
                              }`}
                              value={formulario.precio}
                              onChange={cambiarCampo}
                              placeholder="180000"
                            />
                          </div>

                          {errores.precio && (
                            <div className="text-danger small mt-1">
                              {Array.isArray(
                                errores.precio
                              )
                                ? errores.precio[0]
                                : errores.precio}
                            </div>
                          )}
                        </div>

                        <div className="col-12 col-md-6">
                          <label
                            htmlFor="stock"
                            className="form-label fw-semibold"
                          >
                            Cantidad disponible *
                          </label>

                          <input
                            id="stock"
                            name="stock"
                            type="number"
                            min="0"
                            step="1"
                            className={`form-control ${
                              errores.stock
                                ? "is-invalid"
                                : ""
                            }`}
                            value={formulario.stock}
                            onChange={cambiarCampo}
                            placeholder="10"
                          />

                          {errores.stock && (
                            <div className="text-danger small mt-1">
                              {Array.isArray(errores.stock)
                                ? errores.stock[0]
                                : errores.stock}
                            </div>
                          )}
                        </div>

                      </div>

                      <div className="mt-3">
                        <label
                          htmlFor="categoria"
                          className="form-label fw-semibold"
                        >
                          Categoría *
                        </label>

                        <select
                          id="categoria"
                          name="categoria"
                          className={`form-select ${
                            errores.categoria
                              ? "is-invalid"
                              : ""
                          }`}
                          value={formulario.categoria}
                          onChange={cambiarCampo}
                        >
                          <option value="">
                            Selecciona una categoría
                          </option>

                          {CATEGORIAS.map((categoria) => (
                            <option
                              key={categoria}
                              value={categoria}
                            >
                              {categoria}
                            </option>
                          ))}
                        </select>

                        {errores.categoria && (
                          <div className="invalid-feedback">
                            {Array.isArray(
                              errores.categoria
                            )
                              ? errores.categoria[0]
                              : errores.categoria}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>

                {/* IMAGEN */}
                <div className="col-12 col-lg-5">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-4">

                      <h4 className="fw-bold mb-3">
                        Imagen del producto
                      </h4>

                      <p className="text-muted small">
                        Sube una imagen clara de tu producto.
                        Formatos permitidos: JPG, JPEG, PNG o WEBP.
                        Máximo 5 MB.
                      </p>

                      {!vistaPrevia ? (
                        <label
                          htmlFor="imagen-producto"
                          className={`border rounded-4 d-flex flex-column align-items-center justify-content-center text-center p-4 ${
                            errores.imagen
                              ? "border-danger"
                              : ""
                          }`}
                          style={{
                            minHeight: 300,
                            cursor: "pointer",
                            background: "#fafafa",
                            borderStyle: "dashed",
                          }}
                        >
                          <FaCloudUploadAlt
                            size={55}
                            className="text-success mb-3"
                          />

                          <h5 className="fw-bold">
                            Seleccionar imagen
                          </h5>

                          <p className="text-muted mb-0">
                            Haz clic aquí para buscarla
                            en tu computador.
                          </p>

                          <input
                            id="imagen-producto"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={seleccionarImagen}
                            className="d-none"
                          />
                        </label>
                      ) : (
                        <div className="position-relative">
                          <img
                            src={vistaPrevia}
                            alt="Vista previa del producto"
                            className="img-fluid rounded-4 w-100"
                            style={{
                              height: 300,
                              objectFit: "cover",
                            }}
                          />

                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
                            onClick={quitarImagen}
                            title="Quitar imagen"
                            style={{
                              width: 38,
                              height: 38,
                            }}
                          >
                            <FaTimes />
                          </button>

                          <div className="bg-light rounded-3 p-2 mt-2 small text-muted d-flex align-items-center gap-2">
                            <FaImage />
                            <span className="text-truncate">
                              {imagen?.name}
                            </span>
                          </div>
                        </div>
                      )}

                      {errores.imagen && (
                        <div className="text-danger small mt-2">
                          {Array.isArray(errores.imagen)
                            ? errores.imagen[0]
                            : errores.imagen}
                        </div>
                      )}

                      <div className="alert alert-light border mt-4 mb-0">
                        <strong>Consejo:</strong>{" "}
                        utiliza una foto con buena iluminación y
                        donde el producto se vea claramente.
                      </div>

                    </div>
                  </div>
                </div>

              </div>

              {/* BOTONES */}
              <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-4">

                <Link
                  to="/productos"
                  className="btn btn-outline-secondary px-4"
                >
                  Cancelar
                </Link>

                <button
                  type="submit"
                  className="btn btn-success px-4 d-flex align-items-center justify-content-center gap-2"
                  disabled={guardando}
                >
                  {guardando ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                      />
                      Publicando...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Publicar producto
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

