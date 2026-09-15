import React from 'react';
import { Link } from 'react-router-dom';

export default function Inicio() {
  return (
    <div style={{ backgroundColor: '#fcfbf9', minHeight: '100vh' }}>
      
      {/* INTRO / BIENVENIDA OFICIAL CON LOGOTIPO */}
      <section className="py-5 text-center text-white" style={{ backgroundColor: '#1e4620', backgroundImage: 'linear-gradient(135deg, rgba(30, 70, 32, 0.95), rgba(45, 106, 79, 0.9))' }}>
        <div className="container py-5">
          <div className="mb-4">
            <img 
              src="/logo-raices.png" 
              alt="Logo Oficial RAÍCES" 
              style={{ 
                width: '140px', 
                height: '140px', 
                objectFit: 'contain', 
                filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.3))' 
              }} 
            />
          </div>
          <h1 className="display-3 fw-bold mb-3" style={{ letterSpacing: '1.5px', color: '#fcfbf9' }}>
            RAÍCES
          </h1>
          <p className="lead mb-4 mx-auto text-light" style={{ maxWidth: '650px', fontSize: '1.2rem', opacity: '0.9' }}>
            Conecta con la tradición, descubre artesanías únicas y vive experiencias culturales auténticas de nuestra tierra.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Link to="/productos" className="btn fw-bold px-4 py-3 shadow-sm rounded-pill" style={{ backgroundColor: '#d8f3dc', color: '#1e4620', borderColor: '#d8f3dc' }}>
              Explorar Artesanías
            </Link>
            <Link to="/experiencias" className="btn btn-outline-light fw-bold px-4 py-3 rounded-pill">
              Ver Experiencias
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE ACCESOS RÁPIDOS */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold" style={{ color: '#1e4620' }}>Tradición, Cultura y Arte</h2>
          <p className="text-muted">Piezas elaboradas a mano por maestros artesanos con identidad y pasión.</p>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-3" style={{ borderRadius: '12px', backgroundColor: '#ffffff' }}>
              <div className="card-body text-center">
                <div className="mb-3 fs-1" style={{ color: '#2d6a4f' }}><i className="bi bi-shop"></i></div>
                <h4 className="fw-bold h5" style={{ color: '#1e4620' }}>Catálogo Auténtico</h4>
                <p className="text-muted small">Explora productos de alfarería, textiles y piezas únicas con historia.</p>
                <Link to="/productos" className="btn btn-sm text-white mt-2 px-3 rounded-pill" style={{ backgroundColor: '#2d6a4f' }}>Ver catálogo</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-3" style={{ borderRadius: '12px', backgroundColor: '#ffffff' }}>
              <div className="card-body text-center">
                <div className="mb-3 fs-1" style={{ color: '#2d6a4f' }}><i className="bi bi-compass"></i></div>
                <h4 className="fw-bold h5" style={{ color: '#1e4620' }}>Experiencias Culturales</h4>
                <p className="text-muted small">Participa en talleres y vivencias directas con los creadores de las obras.</p>
                <Link to="/experiencias" className="btn btn-sm text-white mt-2 px-3 rounded-pill" style={{ backgroundColor: '#2d6a4f' }}>Ver experiencias</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-3" style={{ borderRadius: '12px', backgroundColor: '#ffffff' }}>
              <div className="card-body text-center">
                <div className="mb-3 fs-1" style={{ color: '#2d6a4f' }}><i className="bi bi-map"></i></div>
                <h4 className="fw-bold h5" style={{ color: '#1e4620' }}>Mapa Cultural</h4>
                <p className="text-muted small">Ubica geográficamente los talleres y regiones de origen de cada producto.</p>
                <Link to="/mapa" className="btn btn-sm text-white mt-2 px-3 rounded-pill" style={{ backgroundColor: '#2d6a4f' }}>Ver mapa</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}