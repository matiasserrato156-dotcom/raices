import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Intro() {
  const navigate = useNavigate();
  // Fases: "entrada" -> "presentacion" -> "implosion" -> "rebote_salida"
  const [fase, setFase] = useState("entrada");

  const redirigirDestino = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/inicio", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    // 1. Entrada y acomodo de los elementos
    const t1 = setTimeout(() => setFase("presentacion"), 1400);

    // 2. Implosión: succión profunda hacia el centro
    const t2 = setTimeout(() => setFase("implosion"), 5400);

    // 3. Rebote de estallido expansivo
    const t3 = setTimeout(() => setFase("rebote_salida"), 6600);

    // 4. Redirección final suave
    const t4 = setTimeout(() => {
      redirigirDestino();
    }, 7200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#0a0c0f",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        perspective: "1200px",
        transition: "opacity 0.6s ease-out",
        opacity: fase === "rebote_salida" ? 0 : 1,
      }}
    >
      {/* Resplandor radial dorado de fondo */}
      <div
        style={{
          position: "absolute",
          width: "750px",
          height: "750px",
          background:
            "radial-gradient(circle, rgba(243, 156, 18, 0.25) 0%, rgba(0,0,0,0) 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
          transform:
            fase === "implosion"
              ? "scale(0.05)"
              : fase === "rebote_salida"
              ? "scale(3.2)"
              : "scale(1.15)",
          transition: "transform 1.1s cubic-bezier(0.7, 0, 0.3, 1)",
        }}
      />

      {/* Botón para omitir intro */}
      <button
        onClick={redirigirDestino}
        style={{
          position: "absolute",
          top: "24px",
          right: "24px",
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "#fff",
          padding: "8px 22px",
          borderRadius: "30px",
          fontSize: "0.85rem",
          cursor: "pointer",
          backdropFilter: "blur(10px)",
          letterSpacing: "1px",
          textTransform: "uppercase",
          transition: "all 0.3s ease",
          zIndex: 10,
        }}
      >
        Saltar Intro ✕
      </button>

      {/* Contenedor central con animación de implosión y rebote */}
      <div
        style={{
          textAlign: "center",
          padding: "24px",
          maxWidth: "920px",
          transformOrigin: "center center",
          transition:
            fase === "implosion"
              ? "transform 0.9s cubic-bezier(0.6, -0.28, 0.735, 0.045), opacity 0.8s ease, filter 0.8s ease"
              : fase === "rebote_salida"
              ? "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease"
              : "transform 1.2s ease-out, opacity 1s ease",
          transform:
            fase === "entrada"
              ? "scale(0.75) translateY(30px)"
              : fase === "presentacion"
              ? "scale(1) translateY(0)"
              : fase === "implosion"
              ? "scale(0.02) rotate(-180deg)"
              : "scale(2.5) rotate(10deg)",
          opacity: fase === "implosion" ? 0.2 : fase === "rebote_salida" ? 0 : 1,
          filter:
            fase === "implosion"
              ? "blur(25px)"
              : fase === "rebote_salida"
              ? "blur(12px)"
              : "blur(0px)",
        }}
      >
        {/* Encabezado */}
        <div>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.95rem",
              letterSpacing: "6px",
              color: "#f39c12",
              textTransform: "uppercase",
              fontWeight: "700",
              marginBottom: "12px",
            }}
          >
            ✦ Bienvenidos ✦
          </span>

          <h1
            style={{
              fontSize: "clamp(3.8rem, 8.5vw, 7.2rem)",
              fontWeight: "900",
              letterSpacing: "14px",
              margin: 0,
              background: "linear-gradient(135deg, #ffffff 40%, #f39c12 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textTransform: "uppercase",
              filter: "drop-shadow(0 0 35px rgba(243, 156, 18, 0.35))",
            }}
          >
            RAÍCES
          </h1>
        </div>

        {/* Dicho cultural ancestral */}
        <div
          style={{
            marginTop: "16px",
            transition: "opacity 0.8s ease",
            opacity: fase === "presentacion" ? 1 : 0,
          }}
        >
          <p
            style={{
              fontStyle: "italic",
              fontSize: "clamp(1.05rem, 2vw, 1.3rem)",
              color: "#ffc107",
              letterSpacing: "1.5px",
              margin: 0,
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            }}
          >
            “El que olvida sus raíces no florece; el que teje su historia jamás se apaga.”
          </p>
        </div>

        {/* Presentación del equipo creador */}
        <div
          style={{
            marginTop: "24px",
            transition: "opacity 0.8s ease, transform 0.8s ease",
            opacity: fase === "presentacion" ? 1 : 0,
            transform: fase === "presentacion" ? "translateY(0)" : "translateY(15px)",
          }}
        >
          <p
            style={{
              fontSize: "clamp(1.1rem, 2.3vw, 1.45rem)",
              color: "#f0f0f0",
              lineHeight: "1.6",
              fontWeight: "300",
              marginBottom: "18px",
            }}
          >
            Les presentamos la plataforma <strong style={{ color: "#f39c12", fontWeight: "700" }}>Raíces</strong>, creada con dedicación por el grupo de:
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            {[
              { nombre: "Jochusa", icono: "🎨" },
              { nombre: "Eilin", icono: "✨" },
              { nombre: "Matías", icono: "⚡" },
            ].map((creador) => (
              <span
                key={creador.nombre}
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(243, 156, 18, 0.5)",
                  color: "#ffffff",
                  padding: "10px 26px",
                  borderRadius: "50px",
                  fontSize: "1.15rem",
                  fontWeight: "700",
                  letterSpacing: "1px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                }}
              >
                {creador.icono} {creador.nombre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Intro;