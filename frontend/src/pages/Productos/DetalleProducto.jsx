import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [mensajeCarrito, setMensajeCarrito] = useState("");
  const [mostrarModalVideo, setMostrarModalVideo] = useState(false);

  // =====================================================
  // RESEÑAS
  // =====================================================

  const [resenas, setResenas] = useState([]);
  const [promedio, setPromedio] = useState(0);
  const [totalResenas, setTotalResenas] = useState(0);
  const [cargandoResenas, setCargandoResenas] = useState(true);

  const [calificacion, setCalificacion] = useState(5);
  const [comentario, setComentario] = useState("");
  const [enviandoResena, setEnviandoResena] = useState(false);
  const [mensajeResena, setMensajeResena] = useState("");
  const [errorResena, setErrorResena] = useState("");

  // =====================================================
  // OBTENER USUARIO ACTUAL
  // =====================================================

  const token = localStorage.getItem("token");
  const usuarioGuardado = localStorage.getItem("user");

  let usuarioActual = null;

  try {
    usuarioActual = usuarioGuardado
      ? JSON.parse(usuarioGuardado)
      : null;
  } catch {
    usuarioActual = null;
  }

  const usuarioId = usuarioActual?.id;

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

    if (
      valor.startsWith("http://") ||
      valor.startsWith("https://")
    ) {
      return valor;
    }

    if (valor.startsWith("/storage/")) {
      return "http://127.0.0.1:8000" + valor;
    }

    if (valor.startsWith("storage/")) {
      return "http://127.0.0.1:8000/" + valor;
    }

    return "http://127.0.0.1:8000/storage/" + valor;
  };

  // =====================================================
  // CARGAR PRODUCTO
  // =====================================================

  useEffect(() => {
    const cargarDetalle = async () => {
      setCargando(true);
      setError("");

      try {
        const res = await api.get("/productos/" + id);

        const data = res.data?.producto || res.data;

        setProducto(data);
      } catch (err) {
        console.error("Error al cargar producto:", err);

        setError(
          "No se pudo cargar la información de esta artesanía."
        );
      } finally {
        setCargando(false);
      }
    };

    cargarDetalle();
  }, [id]);

  // =====================================================
  // CARGAR RESEÑAS
  // =====================================================

  const cargarResenas = async () => {
    setCargandoResenas(true);

    try {
      const res = await api.get(
        "/productos/" + id + "/resenas"
      );

      setResenas(res.data?.resenas || []);
      setPromedio(Number(res.data?.promedio || 0));
      setTotalResenas(Number(res.data?.total || 0));

      // Si el usuario ya tiene reseña, cargarla en el formulario
      const propia = (res.data?.resenas || []).find(
        (resena) =>
          usuarioId &&
          Number(resena.user_id) === Number(usuarioId)
      );

      if (propia) {
        setCalificacion(Number(propia.calificacion));
        setComentario(propia.comentario || "");
      }
    } catch (err) {
      console.error("Error al cargar reseñas:", err);

      setResenas([]);
      setPromedio(0);
      setTotalResenas(0);
    } finally {
      setCargandoResenas(false);
    }
  };

  useEffect(() => {
    if (producto) {
      cargarResenas();
    }
  }, [producto, id, usuarioId]);

  // =====================================================
  // FORMATO DE PRECIO
  // =====================================================

  const formatoPrecio = (valor) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(Number(valor || 0));

  // =====================================================
  // AGREGAR AL CARRITO
  // =====================================================

  const agregarAlCarrito = () => {
    if (!producto || producto.stock <= 0) {
      return;
    }

    try {
      const carritoActual = JSON.parse(
        localStorage.getItem("carrito") || "[]"
      );

      const index = carritoActual.findIndex(
        (item) => item.id === producto.id
      );

      if (index >= 0) {
        const nuevaCant =
          carritoActual[index].cantidad + cantidad;

        carritoActual[index].cantidad = Math.min(
          nuevaCant,
          producto.stock
        );
      } else {
        carritoActual.push({
          id: producto.id,
          titulo:
            producto.titulo ||
            producto.nombre ||
            "Producto artesanal",
          nombre:
            producto.nombre ||
            producto.titulo ||
            "Producto artesanal",
          precio: producto.precio,
          imagen: producto.imagen,
          stock: producto.stock,
          cantidad: Math.min(
            cantidad,
            producto.stock
          ),
        });
      }

      localStorage.setItem(
        "carrito",
        JSON.stringify(carritoActual)
      );

      setMensajeCarrito(
        "¡Artesanía agregada al carrito!"
      );

      setTimeout(() => {
        setMensajeCarrito("");
      }, 4000);
    } catch (err) {
      console.error(
        "Error al actualizar carrito:",
        err
      );
    }
  };

  // =====================================================
  // CONVERTIR YOUTUBE A EMBED
  // =====================================================

  const obtenerEmbedUrl = (url) => {
    if (!url) {
      return "";
    }

    const match = url.match(
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    );

    return match && match[2].length === 11
      ? "https://www.youtube.com/embed/" +
          match[2] +
          "?autoplay=1"
      : url;
  };

  // =====================================================
  // GUARDAR RESEÑA
  // =====================================================

  const guardarResena = async (e) => {
    e.preventDefault();

    if (!token) {
      setErrorResena(
        "Debes iniciar sesión para publicar una reseña."
      );
      return;
    }

    if (!comentario.trim()) {
      setErrorResena(
        "Escribe un comentario antes de publicar."
      );
      return;
    }

    setEnviandoResena(true);
    setMensajeResena("");
    setErrorResena("");

    try {
      const res = await api.post(
        "/productos/" + id + "/resenas",
        {
          calificacion: Number(calificacion),
          comentario: comentario.trim(),
        }
      );

      setMensajeResena(
        res.data?.message ||
          "Reseña guardada correctamente."
      );

      await cargarResenas();
    } catch (err) {
      console.error("Error al guardar reseña:", err);

      if (err.response?.status === 401) {
        setErrorResena(
          "Tu sesión ha expirado. Inicia sesión nuevamente."
        );
      } else if (err.response?.status === 422) {
        const errores = err.response?.data?.errors;

        if (errores) {
          const primerError =
            Object.values(errores)?.[0]?.[0];

          setErrorResena(
            primerError ||
              "Revisa los datos de la reseña."
          );
        } else {
          setErrorResena(
            "Revisa los datos de la reseña."
          );
        }
      } else {
        setErrorResena(
          "No se pudo guardar la reseña."
        );
      }
    } finally {
      setEnviandoResena(false);
    }
  };

  // =====================================================
  // ELIMINAR RESEÑA
  // =====================================================

  const eliminarResena = async (resenaId) => {
    if (!token) {
      return;
    }

    const confirmar = window.confirm(
      "¿Quieres eliminar tu reseña?"
    );

    if (!confirmar) {
      return;
    }

    setMensajeResena("");
    setErrorResena("");

    try {
      const res = await api.delete(
        "/productos/" +
          id +
          "/resenas/" +
          resenaId
      );

      setMensajeResena(
        res.data?.message ||
          "Reseña eliminada correctamente."
      );

      setComentario("");
      setCalificacion(5);

      await cargarResenas();
    } catch (err) {
      console.error(
        "Error al eliminar reseña:",
        err
      );

      setErrorResena(
        err.response?.data?.message ||
          "No se pudo eliminar la reseña."
      );
    }
  };

  // =====================================================
  // ESTRELLAS
  // =====================================================

  const mostrarEstrellas = (valor, grande = false) => {
    const numero = Number(valor || 0);

    return (
      <div
        className={
          grande
            ? "d-flex align-items-center gap-1"
            : "d-flex align-items-center gap-1"
        }
      >
        {[1, 2, 3, 4, 5].map((estrella) => (
          <i
            key={estrella}
            className={
              estrella <= Math.round(numero)
                ? "bi bi-star-fill text-warning"
                : "bi bi-star text-secondary"
            }
            style={{
              fontSize: grande
                ? "1.5rem"
                : "1rem",
            }}
          ></i>
        ))}
      </div>
    );
  };

  // =====================================================
  // ESTADOS DE CARGA
  // =====================================================

  if (cargando) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-dark"
          role="status"
        ></div>

        <p className="text-muted mt-3">
          Cargando detalles de la pieza...
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR / PRODUCTO NO ENCONTRADO
  // =====================================================

  if (error || !producto) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning py-4 rounded-4 shadow-sm">
          <h5>
            {error ||
              "Pieza artesanal no encontrada"}
          </h5>

          <Link
            to="/productos"
            className="btn btn-dark mt-3 rounded-pill px-4"
          >
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  // =====================================================
  // DATOS DEL PRODUCTO
  // =====================================================

  const nombreProducto =
    producto.nombre ||
    producto.titulo ||
    "Producto artesanal";

  const imagenProducto = obtenerImagenProducto(
    producto.imagen ||
      producto.imagen_url
  );

  const tieneVideo = Boolean(
    producto.video_url ||
      producto.video
  );

  const videoSrc =
    producto.video_url ||
    producto.video;

  const miResena = resenas.find(
    (resena) =>
      usuarioId &&
      Number(resena.user_id) === Number(usuarioId)
  );

  // =====================================================
  // VISTA PRINCIPAL
  // =====================================================

  return (
    <div className="container py-4">

      {/* ================================================= */}
      {/* NAVEGACIÓN */}
      {/* ================================================= */}

      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-light border btn-sm rounded-pill px-3 text-muted fw-semibold"
        >
          ← Volver
        </button>
      </div>

      {/* ================================================= */}
      {/* MENSAJE CARRITO */}
      {/* ================================================= */}

      {mensajeCarrito && (
        <div
          className="alert alert-success position-fixed bottom-0 end-0 m-4 shadow-lg rounded-4 d-flex align-items-center gap-3 border border-success"
          style={{ zIndex: 1060 }}
        >
          <i className="bi bi-cart-check-fill fs-3 text-success"></i>

          <div>
            <strong>
              {mensajeCarrito}
            </strong>

            <div className="small text-muted">
              Revisa tu compra en el carrito.
            </div>
          </div>

          <Link
            to="/carrito"
            className="btn btn-dark btn-sm rounded-pill ms-2"
          >
            Ver Carrito
          </Link>
        </div>
      )}

      {/* ================================================= */}
      {/* PRODUCTO */}
      {/* ================================================= */}

      <div className="row g-5">

        {/* COLUMNA IZQUIERDA */}

        <div className="col-12 col-md-6">

          <div className="card border-0 shadow-sm rounded-4 overflow-hidden position-relative bg-light">

            <img
              src={imagenProducto}
              alt={nombreProducto}
              className="w-100"
              style={{
                objectFit: "cover",
                maxHeight: "480px",
                minHeight: "350px",
              }}
              onError={(e) => {
                e.currentTarget.onerror = null;

                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261";
              }}
            />

            {tieneVideo && (
              <button
                className="btn btn-dark position-absolute bottom-0 start-50 translate-middle-x mb-4 rounded-pill px-4 py-2 shadow-lg fw-bold d-flex align-items-center gap-2"
                onClick={() =>
                  setMostrarModalVideo(true)
                }
              >
                <i className="bi bi-play-circle-fill text-warning fs-5"></i>

                Ver Proceso de Elaboración
              </button>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA */}

        <div className="col-12 col-md-6 d-flex flex-column">

          <span className="badge bg-warning text-dark text-uppercase fw-bold px-3 py-2 align-self-start mb-2 rounded-pill">
            {producto.categoria ||
              "Tradición Colombiana"}
          </span>

          <h2 className="fw-bold text-dark mb-2">
            {nombreProducto}
          </h2>

          <div className="d-flex align-items-center gap-3 mb-3 text-muted small">

            <span>
              <i className="bi bi-geo-alt text-danger me-1"></i>

              {producto.origen ||
                producto.comunidad ||
                "Colombia"}
            </span>

            <span>•</span>

            <span
              className={
                producto.stock > 0
                  ? "text-success fw-bold"
                  : "text-danger fw-bold"
              }
            >
              {producto.stock > 0
                ? "Stock disponible: " +
                  producto.stock +
                  " unidades"
                : "Agotado temporalmente"}
            </span>

          </div>

          <div className="fs-2 fw-bold text-dark mb-3">
            {formatoPrecio(
              producto.precio
            )}
          </div>

          {/* RESUMEN DE CALIFICACIÓN */}

          <div className="d-flex align-items-center gap-3 mb-4">

            {mostrarEstrellas(promedio, true)}

            <div>
              <strong className="text-dark">
                {promedio > 0
                  ? promedio.toFixed(1)
                  : "Sin calificación"}
              </strong>

              <div className="small text-muted">
                {totalResenas}{" "}
                {totalResenas === 1
                  ? "reseña"
                  : "reseñas"}
              </div>
            </div>

          </div>

          {/* DESCRIPCIÓN */}

          <div className="p-3 bg-light rounded-3 mb-4">

            <h6 className="fw-bold text-dark mb-2">
              Historia y Técnica Ancestral
            </h6>

            <p
              className="text-muted small mb-0"
              style={{
                lineHeight: "1.7",
              }}
            >
              {producto.descripcion ||
                "Pieza auténtica elaborada a mano por comunidades tradicionales colombianas."}
            </p>

          </div>

          {/* CANTIDAD */}

          <div className="mt-auto pt-3 border-top">

            <div className="row g-3 align-items-center">

              <div className="col-4 col-sm-3">

                <label className="form-label small text-muted fw-bold">
                  Cantidad
                </label>

                <input
                  type="number"
                  className="form-control text-center fw-bold"
                  min="1"
                  max={producto.stock}
                  value={cantidad}
                  disabled={producto.stock <= 0}
                  onChange={(e) => {
                    const valor =
                      Number(e.target.value);

                    setCantidad(
                      Math.max(
                        1,
                        Math.min(
                          producto.stock,
                          valor || 1
                        )
                      )
                    );
                  }}
                />

              </div>

              <div className="col-8 col-sm-9 d-flex align-items-end">

                <button
                  className="btn btn-dark w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                  disabled={producto.stock <= 0}
                  onClick={agregarAlCarrito}
                >
                  <i className="bi bi-bag-plus"></i>

                  {producto.stock > 0
                    ? "Agregar al Carrito"
                    : "Pieza Agotada"}
                </button>

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ===================================================== */}
      {/* RESEÑAS Y COMENTARIOS */}
      {/* ===================================================== */}

      <section className="mt-5 pt-4 border-top">

        <div className="row g-4">

          {/* RESUMEN */}

          <div className="col-12 col-lg-4">

            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">

              <h4 className="fw-bold mb-3">
                Opiniones de la comunidad
              </h4>

              <div className="display-5 fw-bold text-dark">
                {promedio > 0
                  ? promedio.toFixed(1)
                  : "—"}
              </div>

              <div className="my-2">
                {mostrarEstrellas(
                  promedio,
                  true
                )}
              </div>

              <p className="text-muted mb-0">
                Basado en{" "}
                <strong>
                  {totalResenas}
                </strong>{" "}
                {totalResenas === 1
                  ? "reseña"
                  : "reseñas"}
              </p>

            </div>
          </div>

          {/* FORMULARIO */}

          <div className="col-12 col-lg-8">

            <div className="card border-0 shadow-sm rounded-4 p-4">

              <h5 className="fw-bold mb-3">
                {miResena
                  ? "Actualiza tu reseña"
                  : "Comparte tu experiencia"}
              </h5>

              {!token ? (
                <div className="alert alert-light border rounded-3 mb-0">
                  <i className="bi bi-person-lock me-2"></i>

                  Debes iniciar sesión para dejar una reseña.
                </div>
              ) : (
                <form onSubmit={guardarResena}>

                  <label className="form-label fw-semibold">
                    Tu calificación
                  </label>

                  <div className="d-flex gap-2 mb-3">

                    {[1, 2, 3, 4, 5].map(
                      (estrella) => (
                        <button
                          key={estrella}
                          type="button"
                          className="btn p-0 border-0"
                          onClick={() =>
                            setCalificacion(
                              estrella
                            )
                          }
                          aria-label={
                            "Calificar con " +
                            estrella +
                            " estrellas"
                          }
                        >
                          <i
                            className={
                              estrella <=
                              calificacion
                                ? "bi bi-star-fill text-warning"
                                : "bi bi-star text-secondary"
                            }
                            style={{
                              fontSize:
                                "1.8rem",
                            }}
                          ></i>
                        </button>
                      )
                    )}

                  </div>

                  <label className="form-label fw-semibold">
                    Comentario
                  </label>

                  <textarea
                    className="form-control rounded-3 mb-3"
                    rows="4"
                    maxLength="1000"
                    value={comentario}
                    placeholder="Cuéntanos qué te pareció esta artesanía..."
                    onChange={(e) =>
                      setComentario(
                        e.target.value
                      )
                    }
                  ></textarea>

                  {mensajeResena && (
                    <div className="alert alert-success py-2">
                      {mensajeResena}
                    </div>
                  )}

                  {errorResena && (
                    <div className="alert alert-danger py-2">
                      {errorResena}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-dark rounded-pill px-4 fw-bold"
                    disabled={enviandoResena}
                  >
                    {enviandoResena ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>

                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>

                        {miResena
                          ? "Actualizar reseña"
                          : "Publicar reseña"}
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>
          </div>
        </div>

        {/* LISTA DE RESEÑAS */}

        <div className="mt-4">

          <h5 className="fw-bold mb-3">
            Reseñas
          </h5>

          {cargandoResenas ? (
            <div className="text-center py-4">
              <div
                className="spinner-border text-dark"
                role="status"
              ></div>

              <p className="text-muted mt-2 mb-0">
                Cargando opiniones...
              </p>
            </div>
          ) : resenas.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
              <i className="bi bi-chat-square-text fs-1 text-muted"></i>

              <h6 className="fw-bold mt-3">
                Aún no hay reseñas
              </h6>

              <p className="text-muted mb-0">
                Sé la primera persona en compartir su experiencia.
              </p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">

              {resenas.map((resena) => (
                <div
                  key={resena.id}
                  className="card border-0 shadow-sm rounded-4 p-4"
                >

                  <div className="d-flex justify-content-between align-items-start gap-3">

                    <div>

                      <div className="d-flex align-items-center gap-2 mb-1">

                        <div
                          className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                        >
                          <i className="bi bi-person-fill"></i>
                        </div>

                        <div>
                          <strong>
                            {resena.usuario ||
                              "Usuario"}
                          </strong>

                          <div className="small text-muted">
                            {resena.created_at
                              ? new Date(
                                  resena.created_at
                                ).toLocaleDateString(
                                  "es-CO",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : ""}
                          </div>
                        </div>

                      </div>

                      <div className="mb-2">
                        {mostrarEstrellas(
                          resena.calificacion
                        )}
                      </div>

                    </div>

                    {usuarioId &&
                      Number(
                        resena.user_id
                      ) ===
                        Number(usuarioId) && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm rounded-pill"
                          onClick={() =>
                            eliminarResena(
                              resena.id
                            )
                          }
                        >
                          <i className="bi bi-trash me-1"></i>
                          Eliminar
                        </button>
                      )}

                  </div>

                  <p className="text-muted mb-0 mt-2">
                    {resena.comentario}
                  </p>

                </div>
              ))}

            </div>
          )}

        </div>

      </section>

      {/* ===================================================== */}
      {/* MODAL VIDEO */}
      {/* ===================================================== */}

      {mostrarModalVideo && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor:
              "rgba(0,0,0,0.85)",
            zIndex: 1070,
          }}
        >

          <div className="modal-dialog modal-lg modal-dialog-centered">

            <div className="modal-content bg-dark text-white border-0 shadow-lg rounded-4 overflow-hidden">

              <div className="modal-header border-secondary py-3">

                <h6 className="modal-title fw-bold">

                  <i className="bi bi-film me-2 text-warning"></i>

                  Proceso de Creación:{" "}
                  {nombreProducto}

                </h6>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() =>
                    setMostrarModalVideo(false)
                  }
                ></button>

              </div>

              <div className="modal-body p-0">

                <div className="ratio ratio-16x9 bg-black">

                  {videoSrc?.includes(
                    "youtube"
                  ) ||
                  videoSrc?.includes(
                    "youtu.be"
                  ) ? (

                    <iframe
                      src={obtenerEmbedUrl(
                        videoSrc
                      )}
                      title={nombreProducto}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>

                  ) : (

                    <video
                      controls
                      autoPlay
                      className="w-100 h-100"
                    >
                      <source
                        src={videoSrc}
                        type="video/mp4"
                      />

                      Tu navegador no soporta reproducción de video.

                    </video>

                  )}

                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default DetalleProducto;