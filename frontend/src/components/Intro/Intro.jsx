import { useEffect } from "react";
import "./Intro.css";
import logoRaices from "../../assets/logo-raices.png";

export default function Intro({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="raices-intro">
      <div className="raices-intro-background"></div>

      <div className="raices-intro-content">
        <div className="raices-intro-logo-wrapper">
          <img
            src={logoRaices}
            alt="RAÍCES"
            className="raices-intro-logo"
          />
        </div>

        <div className="raices-intro-text">
          <h1>RAÍCES</h1>

          <p>
            Conecta <span>•</span> Descubre <span>•</span> Aprende
          </p>

          <div className="raices-intro-line"></div>

          <small>
            Preservamos cultura, impulsamos tradiciones
          </small>
        </div>
      </div>

      <div className="raices-intro-leaves raices-leaf-1">❧</div>
      <div className="raices-intro-leaves raices-leaf-2">❧</div>
    </div>
  );
}