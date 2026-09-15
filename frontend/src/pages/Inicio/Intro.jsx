import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Intro() {
  const navigate = useNavigate();
  const [saliendo, setSaliendo] = useState(false);

  const irAInicio = () => {
    setSaliendo(true);

    setTimeout(() => {
      const token = localStorage.getItem("token");

      if (token) {
        navigate("/inicio", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }, 500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      irAInicio();
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`raices-intro ${saliendo ? "raices-intro-salida" : ""}`}
    >
      {/* Fondo */}
      <div className="raices-fondo-decoracion raices-decoracion-1"></div>
      <div className="raices-fondo-decoracion raices-decoracion-2"></div>

      {/* Contenido principal */}
      <div className="raices-intro-contenido">

        {/* Logo */}
        <div className="raices-logo-contenedor">
          <img
            src="/logo-raices.png"
            alt="Logo oficial RAÍCES"
            className="raices-logo-intro"
          />
        </div>

        {/* Nombre */}
        <h1 className="raices-titulo">
          RAÍCES
        </h1>

        {/* Eslogan */}
        <div className="raices-eslogan">
          <span>Conecta</span>
          <b>•</b>
          <span>Descubre</span>
          <b>•</b>
          <span>Aprende</span>
        </div>

        {/* Línea decorativa */}
        <div className="raices-linea"></div>

        <p className="raices-descripcion">
          Preservamos nuestra cultura,
          <br />
          impulsamos nuestras tradiciones.
        </p>

        {/* Botón */}
        <button
          type="button"
          onClick={irAInicio}
          className="raices-boton"
        >
          Ingresar a RAÍCES
          <span>→</span>
        </button>

        {/* Indicador */}
        <div className="raices-cargando">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Pie */}
      <footer className="raices-footer">
        Plataforma Artesanal • Proyecto SENA ADSO
      </footer>

      {/* Estilos */}
      <style>{`
        .raices-intro {
          position: fixed;
          inset: 0;
          z-index: 99999;

          display: flex;
          align-items: center;
          justify-content: center;

          overflow: hidden;

          background:
            linear-gradient(
              135deg,
              #163b29 0%,
              #1e5a38 45%,
              #376b43 100%
            );

          color: #ffffff;

          opacity: 1;

          transition:
            opacity 0.5s ease,
            transform 0.5s ease;
        }

        .raices-intro-salida {
          opacity: 0;
          transform: scale(1.03);
          pointer-events: none;
        }

        .raices-intro::before {
          content: "";
          position: absolute;
          inset: 0;

          background:
            radial-gradient(
              circle at 50% 40%,
              rgba(255,255,255,0.12),
              transparent 35%
            );

          pointer-events: none;
        }

        .raices-intro::after {
          content: "";
          position: absolute;
          inset: 0;

          background-image:
            radial-gradient(
              circle,
              rgba(225, 205, 151, 0.14) 1px,
              transparent 1px
            );

          background-size: 34px 34px;

          opacity: 0.25;

          pointer-events: none;
        }

        .raices-intro-contenido {
          position: relative;
          z-index: 3;

          width: min(92%, 620px);

          display: flex;
          flex-direction: column;
          align-items: center;

          text-align: center;

          animation: raicesContenidoEntrada 1.1s ease-out;
        }

        .raices-logo-contenedor {
          width: 245px;
          height: 245px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 12px;

          background: rgba(255,255,255,0.98);

          border-radius: 50%;

          box-shadow:
            0 25px 65px rgba(0,0,0,0.30),
            0 0 0 7px rgba(221, 199, 145, 0.22);

          animation:
            raicesLogoEntrada 1.1s ease-out,
            raicesLogoFlotar 3.2s ease-in-out infinite;
        }

        .raices-logo-intro {
          width: 100%;
          height: 100%;

          object-fit: contain;

          border-radius: 50%;
        }

        .raices-titulo {
          margin: 28px 0 5px;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: clamp(2.5rem, 8vw, 4.6rem);

          font-weight: 700;

          letter-spacing: 0.20em;

          color: #f8f4e8;

          text-shadow:
            0 4px 18px rgba(0,0,0,0.22);

          animation: raicesTextoEntrada 1.2s ease-out;
        }

        .raices-eslogan {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;

          color: #e5d3a0;

          font-size: clamp(0.85rem, 3vw, 1.1rem);

          font-weight: 500;

          letter-spacing: 0.12em;

          animation: raicesTextoEntrada 1.4s ease-out;
        }

        .raices-eslogan b {
          color: #c9aa61;
          font-size: 1rem;
        }

        .raices-linea {
          width: 95px;
          height: 2px;

          margin: 19px 0 14px;

          border-radius: 10px;

          background: #d5b86c;

          box-shadow:
            0 0 12px rgba(213,184,108,0.35);

          animation: raicesLineaEntrada 1.5s ease-out;
        }

        .raices-descripcion {
          margin: 0;

          color: rgba(255,255,255,0.82);

          font-size: clamp(0.78rem, 2.5vw, 0.95rem);

          line-height: 1.7;

          letter-spacing: 0.06em;

          text-transform: uppercase;

          animation: raicesTextoEntrada 1.6s ease-out;
        }

        .raices-boton {
          margin-top: 30px;

          min-width: 220px;

          padding: 13px 27px;

          border: 2px solid #dfcf9d;

          border-radius: 50px;

          background: #f0ead8;

          color: #1b4b30;

          font-size: 1rem;

          font-weight: 700;

          letter-spacing: 0.03em;

          cursor: pointer;

          box-shadow:
            0 12px 30px rgba(0,0,0,0.20);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            background 0.25s ease;

          animation: raicesBotonEntrada 1.8s ease-out;
        }

        .raices-boton span {
          margin-left: 9px;

          font-size: 1.2rem;
        }

        .raices-boton:hover {
          transform: translateY(-3px) scale(1.03);

          background: #ffffff;

          box-shadow:
            0 16px 35px rgba(0,0,0,0.27);
        }

        .raices-boton:active {
          transform: translateY(0) scale(0.98);
        }

        .raices-cargando {
          display: flex;
          gap: 6px;

          margin-top: 20px;
        }

        .raices-cargando span {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #d8c27e;

          animation: raicesPuntos 1.2s infinite ease-in-out;
        }

        .raices-cargando span:nth-child(2) {
          animation-delay: 0.15s;
        }

        .raices-cargando span:nth-child(3) {
          animation-delay: 0.30s;
        }

        .raices-footer {
          position: absolute;

          z-index: 4;

          bottom: 22px;

          left: 0;
          right: 0;

          text-align: center;

          padding: 0 15px;

          color: rgba(255,255,255,0.62);

          font-size: 0.72rem;

          letter-spacing: 0.08em;

          text-transform: uppercase;
        }

        .raices-fondo-decoracion {
          position: absolute;

          border-radius: 50%;

          pointer-events: none;
        }

        .raices-decoracion-1 {
          width: 380px;
          height: 380px;

          left: -190px;
          bottom: -180px;

          border: 1px solid rgba(218,194,129,0.16);

          box-shadow:
            0 0 0 35px rgba(218,194,129,0.03),
            0 0 0 70px rgba(218,194,129,0.025);
        }

        .raices-decoracion-2 {
          width: 280px;
          height: 280px;

          right: -130px;
          top: -130px;

          border: 1px solid rgba(218,194,129,0.14);

          box-shadow:
            0 0 0 35px rgba(218,194,129,0.03),
            0 0 0 70px rgba(218,194,129,0.02);
        }

        @keyframes raicesContenidoEntrada {
          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes raicesLogoEntrada {
          from {
            opacity: 0;
            transform: scale(0.65);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes raicesLogoFlotar {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes raicesTextoEntrada {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes raicesLineaEntrada {
          from {
            width: 0;
            opacity: 0;
          }

          to {
            width: 95px;
            opacity: 1;
          }
        }

        @keyframes raicesBotonEntrada {
          from {
            opacity: 0;
            transform: translateY(15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes raicesPuntos {
          0%,
          80%,
          100% {
            opacity: 0.35;
            transform: scale(0.8);
          }

          40% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        @media (max-width: 576px) {
          .raices-logo-contenedor {
            width: 205px;
            height: 205px;
          }

          .raices-titulo {
            margin-top: 22px;
            font-size: 2.45rem;
          }

          .raices-eslogan {
            font-size: 0.75rem;
            gap: 5px;
            letter-spacing: 0.08em;
          }

          .raices-descripcion {
            font-size: 0.68rem;
          }

          .raices-boton {
            min-width: 205px;
            padding: 12px 22px;
            font-size: 0.9rem;
          }

          .raices-footer {
            font-size: 0.58rem;
            bottom: 15px;
          }
        }
      `}</style>
    </div>
  );
}