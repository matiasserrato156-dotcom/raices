import { useState, useEffect } from "react";

function SeccionResenas({ productoId, nombreProducto }) {
  const STORAGE_KEY = `resenas_producto_${productoId}`;

  const [resenas, setResenas] = useState(() => {
    try {
      const guardadas = localStorage.getItem(STORAGE_KEY);
      if (guardadas) return JSON.parse(guardadas);
    } catch {
      // Fallback a iniciales si falla localStorage
    }

    return [
      {
        id: 1,
        autor: "Valentina Gómez",
        calificacion: 5,
        fecha: "2026-08-14",
        comentario:
          "Los acabados son espectaculares. Se nota el trabajo manual y el empaque venía muy bien protegido para envíos largos.",
      },
      {
        id: 2,
        autor: "Carlos Morales",
        calificacion: 4,
        fecha: "2026-08-28",
        comentario:
          "Gran calidad de la materia prima. Llegó exactamente en el tiempo previsto por la guía de despacho.",
      },
    ];
  });

  const [calificacion, setCalificacion] = useState(5);
  const [comentario, setComentario] = useState("");
  const [hoverEstrellas, setHoverEstrellas] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resenas));
    } catch (err) {
      console.error("Error al guardar reseña:", err);
    }
  }, [resenas, STORAGE_KEY]);

  const promedioCalificacion =
    resenas.length > 0
      ? (
          resenas.reduce((acc, r) => acc + Number(r.calificacion), 0) /
          resenas.length
        ).toFixed(1)
      : "5.0";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comentario.trim()) return;

    let usuarioActual = "Comprador Verificado";
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.name) usuarioActual = user.name;
    } catch {
      // uso predeterminado
    }

    const nuevaResena = {
      id: Date.now(),
      autor: usuarioActual,
      calificacion: Number(calificacion),
      fecha: new Date().toISOString().split("T")[0],
      comentario: comentario.trim(),
    };

    setResenas([nuevaResena, ...resenas]);
    setComentario("");
    setCalificacion(5);
  };

  return (
    <div className="card border-0 shadow-sm p-4 mt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
        <div>
          <h4 className="fw-bold mb-1">Opiniones y Valoraciones</h4>
          <small className="text-muted">
            Experiencias de compradores sobre {nombreProducto || "esta pieza patrimonial"}
          </small>
        </div>

        <div className="d-flex align-items-center gap-3 mt-3 mt-md-0 bg-light px-3 py-2 rounded-3">
          <div className="display-6 fw-bold text-dark">{promedioCalificacion}</div>
          <div>
            <div className="text-warning fs-5">
              {[1, 2, 3, 4, 5].map((estrella) => (
                <i
                  key={estrella}
                  className={`bi bi-star${
                    estrella <= Math.round(Number(promedioCalificacion))
                      ? "-fill"
                      : ""
                  } me-1`}
                ></i>
              ))}
            </div>
            <small className="text-muted d-block">
              Basado en {resenas.length} valoraciones
            </small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* FORMULARIO */}
        <div className="col-lg-5">
          <div className="bg-light p-3 rounded-3">
            <h6 className="fw-bold mb-3">Deja tu Calificación</h6>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted d-block">
                  Puntuación de la pieza:
                </label>
                <div className="fs-3 text-warning cursor-pointer">
                  {[1, 2, 3, 4, 5].map((estrella) => (
                    <i
                      key={estrella}
                      className={`bi bi-star${
                        estrella <= (hoverEstrellas || calificacion) ? "-fill" : ""
                      } me-1`}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => setHoverEstrellas(estrella)}
                      onMouseLeave={() => setHoverEstrellas(0)}
                      onClick={() => setCalificacion(estrella)}
                    ></i>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">
                  Comentario sobre los acabados y entrega:
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Describe la calidad de los materiales, técnica artesanal, etc..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-dark w-100">
                <i className="bi bi-chat-left-text me-2"></i>
                Publicar Opinión
              </button>
            </form>
          </div>
        </div>

        {/* LISTADO DE RESEÑAS */}
        <div className="col-lg-7">
          <div className="d-flex flex-column gap-3">
            {resenas.map((r) => (
              <div key={r.id} className="border-bottom pb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-bold text-dark">{r.autor}</span>
                  <small className="text-muted">{r.fecha}</small>
                </div>
                <div className="text-warning small mb-2">
                  {[1, 2, 3, 4, 5].map((estrella) => (
                    <i
                      key={estrella}
                      className={`bi bi-star${
                        estrella <= r.calificacion ? "-fill" : ""
                      } me-1`}
                    ></i>
                  ))}
                </div>
                <p className="text-secondary small mb-0">{r.comentario}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeccionResenas;