import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function Mapa() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [filtroTipo, setFiltroTipo] = useState("todos");

  const puntosCulturales = [
    {
      id: 1,
      nombre: "Taller de Filigrana Tradicional",
      artesano: "Maestro Pedro Narváez",
      tipo: "taller",
      departamento: "Bolívar",
      ciudad: "Mompox",
      lat: 9.2427,
      lng: -74.4256,
      descripcion: "Orfebrería y tejido milimétrico en hilos de plata y oro.",
      especialidad: "Joyería",
    },
    {
      id: 2,
      nombre: "Comunidad Tejedora Wayuu",
      artesano: "Colectivo Jayeechi",
      tipo: "artesano",
      departamento: "La Guajira",
      ciudad: "Uribia",
      lat: 11.7139,
      lng: -72.2658,
      descripcion: "Elaboración de mochilas con simbología ancestral y tinturado natural.",
      especialidad: "Tejidos",
    },
    {
      id: 3,
      nombre: "Alfarería y Cerámica Tradicional",
      artesano: "Familia Briceño",
      tipo: "taller",
      departamento: "Boyacá",
      ciudad: "Ráquira",
      lat: 5.5386,
      lng: -73.6317,
      descripcion: "Modelado a torno tradicional y cocción ancestral de piezas de barro.",
      especialidad: "Cerámica",
    },
    {
      id: 4,
      nombre: "Taller de Barniz de Pasto (Mopa-Mopa)",
      artesano: "Taller Obando",
      tipo: "experiencia",
      departamento: "Nariño",
      ciudad: "Pasto",
      lat: 1.2136,
      lng: -77.2811,
      descripcion: "Resina vegetal aplicada sobre madera tallada. Patrimonio cultural.",
      especialidad: "Arte en Madera",
    },
    {
      id: 5,
      nombre: "Tejedores del Sombrero Vueltiao",
      artesano: "Asociación Zenú",
      tipo: "artesano",
      departamento: "Córdoba",
      ciudad: "Tuchín",
      lat: 9.1869,
      lng: -75.5606,
      descripcion: "Trenzado tradicional de fibra de Caña Flecha con diseño geométrico.",
      especialidad: "Accesorios",
    },
  ];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([4.5709, -74.2973], 5);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const puntosFiltrados =
      filtroTipo === "todos"
        ? puntosCulturales
        : puntosCulturales.filter((p) => p.tipo === filtroTipo);

    puntosFiltrados.forEach((punto) => {
      const popupHtml = `
        <div style="max-width: 220px; font-family: sans-serif;">
          <span style="background: #212529; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 11px; text-transform: uppercase;">
            ${punto.especialidad}
          </span>
          <h6 style="margin: 8px 0 4px; font-weight: bold;">${punto.nombre}</h6>
          <small style="color: #6c757d; display: block; margin-bottom: 6px;">
            ${punto.artesano} — ${punto.ciudad}, ${punto.departamento}
          </small>
          <p style="font-size: 12px; margin-bottom: 8px; color: #333;">
            ${punto.descripcion}
          </p>
          <a href="/productos" style="display: block; text-align: center; background: #212529; color: #fff; text-decoration: none; padding: 5px 8px; border-radius: 4px; font-size: 12px;">
            Ver catálogo
          </a>
        </div>
      `;

      const marker = L.marker([punto.lat, punto.lng]);
      marker.bindPopup(popupHtml);
      markersLayerRef.current.addLayer(marker);
    });
  }, [filtroTipo]);

  const puntosFiltrados =
    filtroTipo === "todos"
      ? puntosCulturales
      : puntosCulturales.filter((p) => p.tipo === filtroTipo);

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <span className="badge bg-dark text-uppercase px-3 py-1 mb-2">
            Cartografía Viva
          </span>
          <h1 className="fw-bold mb-1">Mapa Cultural de Colombia</h1>
          <p className="text-muted mb-0">
            Explora talleres, maestros artesanos y puntos culturales en cada departamento.
          </p>
        </div>

        <div className="mt-3 mt-md-0 d-flex gap-2">
          <button
            className={`btn btn-sm ${
              filtroTipo === "todos" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setFiltroTipo("todos")}
          >
            Todos
          </button>
          <button
            className={`btn btn-sm ${
              filtroTipo === "artesano" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setFiltroTipo("artesano")}
          >
            Artesanos
          </button>
          <button
            className={`btn btn-sm ${
              filtroTipo === "taller" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setFiltroTipo("taller")}
          >
            Talleres
          </button>
          <button
            className={`btn btn-sm ${
              filtroTipo === "experiencia" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setFiltroTipo("experiencia")}
          >
            Experiencias
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div
            className="card border-0 shadow-sm overflow-hidden"
            style={{ height: "550px", width: "100%" }}
          >
            <div
              ref={mapContainerRef}
              style={{ height: "100%", width: "100%" }}
            />
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100 p-4">
            <h5 className="fw-bold mb-3">Directorio Geográfico</h5>
            <p className="text-muted small">
              Mostrando {puntosFiltrados.length} punto(s) de interés cultural.
            </p>

            <div
              className="list-group list-group-flush overflow-auto"
              style={{ maxHeight: "430px" }}
            >
              {puntosFiltrados.map((punto) => (
                <div key={punto.id} className="list-group-item px-0 py-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="fw-bold mb-1">{punto.nombre}</h6>
                      <small className="text-muted d-block">
                        {punto.ciudad}, {punto.departamento}
                      </small>
                    </div>
                    <span className="badge bg-light text-dark border">
                      {punto.especialidad}
                    </span>
                  </div>
                  <p className="text-muted small mt-2 mb-0">
                    {punto.descripcion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mapa;