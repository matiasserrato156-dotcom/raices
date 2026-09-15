import { useEffect, useState } from "react";
import api from "../services/api";

function Videos() {
  const [videos, setVideos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [videoActivo, setVideoActivo] = useState(null);

  // Estados para publicar nuevo video
  const [modalSubir, setModalSubir] = useState(false);
  const [tipoOrigen, setTipoOrigen] = useState("youtube"); // "youtube" o "archivo"
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [formError, setFormError] = useState("");

  const [nuevoVideo, setNuevoVideo] = useState({
    titulo: "",
    categoria: "Tejidos",
    url: "",
    miniatura: "",
    descripcion: "",
    artesano_nombre: "",
    comunidad: "",
    duracion: "05:00",
  });

  const usuario = (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  const puedeSubirVideo =
    usuario &&
    ["emprendedor", "artesano", "admin"].includes(
      (usuario.role || "").toLowerCase()
    );

  const cargarVideos = async () => {
    setCargando(true);
    setError("");
    try {
      const res = await api.get("/videos");
      const lista = res.data?.videos || (Array.isArray(res.data) ? res.data : []);
      setVideos(lista);
    } catch (err) {
      console.error("Error al cargar videos:", err);
      setError("No fue posible cargar la biblioteca audiovisual en este momento.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarVideos();
  }, []);

  const esVideoYoutube = (url) => {
    if (!url) return false;
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const obtenerEmbedUrl = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : url;
  };

  const abrirReproductor = async (video) => {
    setVideoActivo(video);
    try {
      await api.get(`/videos/${video.id}`);
      setVideos((prev) =>
        prev.map((v) => (v.id === video.id ? { ...v, vistas: v.vistas + 1 } : v))
      );
    } catch (e) {
      console.error("Error registrando vista:", e);
    }
  };

  const handleGuardarVideo = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setFormError("");

    if (tipoOrigen === "archivo" && !archivoSeleccionado) {
      setFormError("Por favor selecciona un archivo de video de tu dispositivo.");
      setGuardando(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("titulo", nuevoVideo.titulo);
      formData.append("categoria", nuevoVideo.categoria);
      formData.append("tipo_origen", tipoOrigen);
      formData.append(
        "artesano_nombre",
        nuevoVideo.artesano_nombre.trim() || usuario?.name || "Maestro Artesano"
      );
      formData.append("comunidad", nuevoVideo.comunidad);
      formData.append("miniatura", nuevoVideo.miniatura);
      formData.append("duracion", nuevoVideo.duracion);
      formData.append("descripcion", nuevoVideo.descripcion);

      if (tipoOrigen === "youtube") {
        formData.append("url", nuevoVideo.url);
      } else {
        formData.append("archivo_video", archivoSeleccionado);
      }

      const res = await api.post("/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const videoCreado = res.data?.video;
      if (videoCreado) {
        setVideos([videoCreado, ...videos]);
      } else {
        cargarVideos();
      }

      setMensajeExito("¡Video cultural publicado con éxito!");
      setModalSubir(false);
      setArchivoSeleccionado(null);
      setNuevoVideo({
        titulo: "",
        categoria: "Tejidos",
        url: "",
        miniatura: "",
        descripcion: "",
        artesano_nombre: "",
        comunidad: "",
        duracion: "05:00",
      });

      setTimeout(() => setMensajeExito(""), 5000);
    } catch (err) {
      console.error("Error subiendo video:", err);
      setFormError(
        err.response?.data?.message ||
          "Ocurrió un error al subir el video. Si es un archivo local, comprueba que no exceda 100MB."
      );
    } finally {
      setGuardando(false);
    }
  };

  const categorias = [
    "todas",
    ...new Set(videos.map((v) => v.categoria).filter(Boolean)),
  ];

  const videosFiltrados = videos.filter((v) => {
    const q = busqueda.toLowerCase().trim();
    const titulo = (v.titulo || "").toLowerCase();
    const artesano = (v.artesano_nombre || "").toLowerCase();
    const comunidad = (v.comunidad || "").toLowerCase();

    const coincideTexto =
      !q || titulo.includes(q) || artesano.includes(q) || comunidad.includes(q);

    const coincideCat =
      categoriaSeleccionada === "todas" ||
      (v.categoria || "").toLowerCase() === categoriaSeleccionada.toLowerCase();

    return coincideTexto && coincideCat;
  });

  return (
    <div className="container-fluid px-lg-5 py-4">
      {/* BANNER PRINCIPAL */}
      <div className="card border-0 bg-dark text-white p-4 p-md-5 mb-4 rounded-4 shadow-sm position-relative overflow-hidden">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 position-relative" style={{ zIndex: 2 }}>
          <div className="col-lg-8">
            <span className="badge bg-warning text-dark text-uppercase fw-bold mb-2 px-3 py-2">
              Aprende con Raíces
            </span>
            <h1 className="fw-bold display-5 mb-2">Biblioteca Audiovisual Ancestral</h1>
            <p className="text-white-50 lead mb-0">
              Descubre las manos, historias y técnicas milenarias que dan vida a cada una de nuestras piezas tradicionales.
            </p>
          </div>

          {puedeSubirVideo && (
            <div>
              <button
                className="btn btn-warning text-dark fw-bold px-4 py-3 rounded-pill shadow d-flex align-items-center gap-2"
                onClick={() => setModalSubir(true)}
              >
                <i className="bi bi-cloud-arrow-up-fill fs-5"></i>
                Subir Video Cultural
              </button>
            </div>
          )}
        </div>
      </div>

      {mensajeExito && (
        <div
          className="alert alert-success shadow-lg position-fixed bottom-0 end-0 m-4 py-3 px-4 rounded-4 d-flex align-items-center gap-3 border border-success"
          style={{ zIndex: 1060 }}
        >
          <i className="bi bi-check-circle-fill text-success fs-3"></i>
          <div>
            <div className="fw-bold">{mensajeExito}</div>
            <small className="text-muted">Tu saber tradicional ya está disponible para todos.</small>
          </div>
          <button
            type="button"
            className="btn-close ms-2"
            onClick={() => setMensajeExito("")}
          ></button>
        </div>
      )}

      {/* FILTROS */}
      <div className="card border-0 shadow-sm p-4 mb-4 bg-white rounded-3">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 bg-light"
                placeholder="Buscar por técnica, artesano o región..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              {busqueda && (
                <button
                  className="btn btn-light border border-start-0 text-muted"
                  onClick={() => setBusqueda("")}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="col-12 col-md-6 d-flex gap-2 flex-wrap justify-content-md-end">
            {categorias.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm rounded-pill ${
                  categoriaSeleccionada === cat
                    ? "btn-dark fw-bold px-3"
                    : "btn-light border text-muted px-3"
                }`}
                onClick={() => setCategoriaSeleccionada(cat)}
              >
                {cat === "todas" ? "Todas las Técnicas" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GRILLA DE VIDEOS O BIENVENIDA */}
      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status"></div>
          <p className="mt-3 text-muted">Cargando historias ancestrales...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger shadow-sm text-center py-4">{error}</div>
      ) : videosFiltrados.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center bg-white rounded-4 my-4">
          <div className="py-4">
            <div
              className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
              style={{ width: "80px", height: "80px" }}
            >
              <i className="bi bi-camera-reels-fill fs-1 text-warning"></i>
            </div>
            <h3 className="fw-bold text-dark">Aún no hay saberes audiovisuales publicados</h3>
            <p className="text-muted col-md-6 mx-auto mb-4">
              Esta videoteca está lista para preservar las técnicas y memorias de nuestros maestros artesanos. 
              {puedeSubirVideo
                ? " Comparte el primer video pegando un enlace de YouTube o cargando un archivo directo."
                : " Pronto los artesanos compartirán sus historias y procesos de creación aquí."}
            </p>

            {puedeSubirVideo && (
              <button
                className="btn btn-warning text-dark fw-bold px-4 py-2 rounded-pill shadow-sm"
                onClick={() => setModalSubir(true)}
              >
                <i className="bi bi-cloud-arrow-up-fill me-2"></i>
                Publicar el Primer Video
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {videosFiltrados.map((vid) => (
            <div key={vid.id} className="col">
              <div
                className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden d-flex flex-column"
                style={{ cursor: "pointer" }}
                onClick={() => abrirReproductor(vid)}
              >
                <div
                  className="position-relative"
                  style={{ height: "200px", backgroundColor: "#000" }}
                >
                  <img
                    src={
                      vid.miniatura ||
                      "https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb"
                    }
                    alt={vid.titulo}
                    className="w-100 h-100"
                    style={{ objectFit: "cover", opacity: 0.85 }}
                  />
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <div
                      className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center shadow-lg"
                      style={{ width: "54px", height: "54px" }}
                    >
                      <i className="bi bi-play-fill fs-2 ms-1"></i>
                    </div>
                  </div>
                  <div className="position-absolute bottom-0 end-0 m-2">
                    <span className="badge bg-dark bg-opacity-75 text-white">
                      {vid.duracion}
                    </span>
                  </div>
                  <div className="position-absolute top-0 start-0 m-2">
                    <span className="badge bg-warning text-dark fw-bold">
                      {vid.categoria}
                    </span>
                  </div>
                </div>

                <div className="card-body d-flex flex-column p-3">
                  <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: "0.75rem" }}>
                    {vid.comunidad || "Colombia"} • Por {vid.artesano_nombre || "Maestro Artesano"}
                  </small>
                  <h6 className="fw-bold mt-1 mb-2 text-dark">{vid.titulo}</h6>
                  <p
                    className="text-muted small mb-3"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {vid.descripcion}
                  </p>

                  <div className="mt-auto d-flex justify-content-between align-items-center pt-2 border-top text-muted small">
                    <span>
                      <i className="bi bi-eye me-1"></i>
                      {vid.vistas} reproducciones
                    </span>
                    <span className="text-dark fw-bold">Ver documental →</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REPRODUCTOR MODAL */}
      {videoActivo && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.85)", zIndex: 1070 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-dark text-white border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-secondary">
                <div>
                  <span className="badge bg-warning text-dark text-uppercase me-2">
                    {videoActivo.categoria}
                  </span>
                  <strong className="modal-title">{videoActivo.titulo}</strong>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setVideoActivo(null)}
                ></button>
              </div>
              <div className="modal-body p-0">
                <div className="ratio ratio-16x9 bg-black">
                  {esVideoYoutube(videoActivo.url) ? (
                    <iframe
                      src={obtenerEmbedUrl(videoActivo.url)}
                      title={videoActivo.titulo}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video controls autoPlay className="w-100 h-100">
                      <source src={videoActivo.url} type="video/mp4" />
                      Tu navegador no soporta reproducción directa de video.
                    </video>
                  )}
                </div>
                <div className="p-3 bg-dark">
                  <p className="text-white-50 small mb-2">{videoActivo.descripcion}</p>
                  <div className="d-flex justify-content-between text-muted small">
                    <span>
                      <strong>Comunidad:</strong> {videoActivo.comunidad}
                    </span>
                    <span>
                      <strong>Maestro:</strong> {videoActivo.artesano_nombre}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA SUBIR VIDEO */}
      {modalSubir && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.75)", zIndex: 1070 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-dark text-white py-3">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-camera-video me-2 text-warning"></i>
                  Publicar Saberes y Documental Cultural
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setModalSubir(false)}
                ></button>
              </div>

              <form onSubmit={handleGuardarVideo}>
                <div className="modal-body p-4 bg-light">
                  {formError && (
                    <div className="alert alert-danger py-2 small mb-3">
                      {formError}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-bold d-block text-dark">
                      ¿Cómo deseas compartir el video?
                    </label>
                    <div className="btn-group w-100" role="group">
                      <button
                        type="button"
                        className={`btn ${
                          tipoOrigen === "youtube" ? "btn-dark fw-bold" : "btn-outline-dark"
                        }`}
                        onClick={() => setTipoOrigen("youtube")}
                      >
                        <i className="bi bi-youtube me-2 text-danger"></i>
                        Enlace de YouTube
                      </button>
                      <button
                        type="button"
                        className={`btn ${
                          tipoOrigen === "archivo" ? "btn-dark fw-bold" : "btn-outline-dark"
                        }`}
                        onClick={() => setTipoOrigen("archivo")}
                      >
                        <i className="bi bi-file-earmark-play-fill me-2 text-warning"></i>
                        Subir Archivo desde mi Dispositivo
                      </button>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-md-8">
                      <label className="form-label small fw-bold">Título del Video / Taller *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ej. El Arte del Teñido Natural con Frutas del Campo"
                        value={nuevoVideo.titulo}
                        onChange={(e) => setNuevoVideo({ ...nuevoVideo, titulo: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-bold">Técnica / Categoría *</label>
                      <select
                        className="form-select"
                        value={nuevoVideo.categoria}
                        onChange={(e) => setNuevoVideo({ ...nuevoVideo, categoria: e.target.value })}
                        required
                      >
                        <option value="Tejidos">Tejidos</option>
                        <option value="Cerámica">Cerámica</option>
                        <option value="Joyería">Joyería</option>
                        <option value="Talla en Madera">Talla en Madera</option>
                        <option value="Cestería">Cestería</option>
                        <option value="Cuero y Marroquinería">Cuero y Marroquinería</option>
                      </select>
                    </div>

                    {tipoOrigen === "youtube" ? (
                      <div className="col-12">
                        <label className="form-label small fw-bold">Enlace de YouTube *</label>
                        <input
                          type="url"
                          className="form-control"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={nuevoVideo.url}
                          onChange={(e) => setNuevoVideo({ ...nuevoVideo, url: e.target.value })}
                          required
                        />
                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                          Pega el enlace normal de YouTube y lo convertiremos automáticamente.
                        </small>
                      </div>
                    ) : (
                      <div className="col-12">
                        <label className="form-label small fw-bold">
                          Seleccionar Archivo de Video (.mp4, .mov, .webm) *
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          accept="video/mp4,video/quicktime,video/webm"
                          onChange={(e) => setArchivoSeleccionado(e.target.files[0] || null)}
                          required
                        />
                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                          Sube tu grabación directa (tamaño máximo recomendado: 100MB).
                        </small>
                      </div>
                    )}

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold">Nombre del Artesano / Taller</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={usuario?.name || "Nombre del maestro artesano"}
                        value={nuevoVideo.artesano_nombre}
                        onChange={(e) => setNuevoVideo({ ...nuevoVideo, artesano_nombre: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold">Comunidad / Municipio</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ej. San Jacinto, Bolívar"
                        value={nuevoVideo.comunidad}
                        onChange={(e) => setNuevoVideo({ ...nuevoVideo, comunidad: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-8">
                      <label className="form-label small fw-bold">URL Imagen de Portada / Miniatura (Opcional)</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://images.unsplash.com/..."
                        value={nuevoVideo.miniatura}
                        onChange={(e) => setNuevoVideo({ ...nuevoVideo, miniatura: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-bold">Duración Aprox.</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ej. 08:30"
                        value={nuevoVideo.duracion}
                        onChange={(e) => setNuevoVideo({ ...nuevoVideo, duracion: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold">Descripción de la Técnica e Historia *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Describe la tradición, los materiales empleados y la importancia cultural de esta pieza..."
                        value={nuevoVideo.descripcion}
                        onChange={(e) => setNuevoVideo({ ...nuevoVideo, descripcion: e.target.value })}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-white border-top py-3">
                  <button
                    type="button"
                    className="btn btn-light btn-sm px-3"
                    onClick={() => setModalSubir(false)}
                    disabled={guardando}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-warning text-dark btn-sm px-4 fw-bold shadow-sm"
                    disabled={guardando}
                  >
                    {guardando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Subiendo Video...
                      </>
                    ) : (
                      "Publicar Documental"
                    )}
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

export default Videos;