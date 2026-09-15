function Footer() {
  return (
    <footer className="bg-dark text-white mt-5">
      <div className="container py-5">

        <div className="row g-4">

          <div className="col-md-4">
            <h4 className="fw-bold">RAÍCES</h4>
            <p className="text-light opacity-75">
              Conectamos personas con nuestra cultura,
              tradición y artesanía.
            </p>
          </div>

          <div className="col-md-4">
            <h5 className="fw-bold">Enlaces</h5>

            <ul className="list-unstyled">
              <li className="mb-2">Inicio</li>
              <li className="mb-2">Artesanías</li>
              <li className="mb-2">Experiencias</li>
              <li className="mb-2">Ubicaciones</li>
            </ul>
          </div>

          <div className="col-md-4">
            <h5 className="fw-bold">Síguenos</h5>

            <div className="d-flex gap-3 fs-4">
              <i className="bi bi-facebook"></i>
              <i className="bi bi-instagram"></i>
              <i className="bi bi-tiktok"></i>
            </div>
          </div>

        </div>

        <hr />

        <p className="text-center mb-0 opacity-75">
          © 2026 Raíces. Todos los derechos reservados.
        </p>

      </div>
    </footer>
  );
}

export default Footer;