import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="py-5">
      <div className="container">

        <div className="row align-items-center py-5">

          <div className="col-lg-7">

            <p className="text-uppercase fw-bold mb-3">
              Cultura · Tradición · Futuro
            </p>

            <h1 className="display-3 fw-bold mb-4">
              Descubre las historias
              detrás de nuestras raíces.
            </h1>

            <p className="lead text-muted mb-4">
              RAÍCES conecta a las personas con productos artesanales,
              creadores y tradiciones que forman parte de nuestra cultura.
            </p>

            <p className="text-muted mb-4">
              Explora productos auténticos, conoce a quienes los crean
              y apoya el talento de nuestras comunidades.
            </p>

            <div className="d-flex gap-2 flex-wrap">

              <button
                className="btn btn-dark btn-lg"
                onClick={() => navigate("/productos")}
              >
                <i className="bi bi-shop me-2"></i>
                Explorar artesanías
              </button>

              <button
                className="btn btn-outline-dark btn-lg"
                onClick={() => {
                  document
                    .getElementById("artesanos")
                    ?.scrollIntoView({
                      behavior: "smooth"
                    });
                }}
              >
                <i className="bi bi-people me-2"></i>
                Conocer artesanos
              </button>

            </div>

          </div>

          <div className="col-lg-5 mt-5 mt-lg-0">

            <div
              className="rounded-4 p-5 text-center shadow-sm"
              style={{
                background: "#e8e1d2",
                minHeight: "350px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >

              <i className="bi bi-flower1 display-1"></i>

              <h3 className="mt-4 fw-bold">
                RAÍCES
              </h3>

              <p className="text-muted mb-0">
                Tradición que conecta generaciones.
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;