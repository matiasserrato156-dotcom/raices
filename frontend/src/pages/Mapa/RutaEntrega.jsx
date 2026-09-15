import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix para íconos estándar de Leaflet en Vite/React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function RutaEntrega() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef(null);

  // Origen Base: Taller y Centro de Despacho Raíces (Centro Histórico)
  const ORIGEN_BODEGA = {
    nombre: "Taller Central Raíces - Centro de Despacho",
    lat: 4.5981,
    lng: -74.076,
  };

  const [destino, setDestino] = useState({
    nombre: "Usaquén (Zona Norte)",
    lat: 4.6973,
    lng: -74.0321,
  });

  const [direccionInput, setDireccionInput] = useState("");
  const [rutaElegida, setRutaElegida] = useState("segura");

  // Generador de rutas basado en coordenadas relativas
  const generarRutas = (orig, dest) => {
    const dLat = dest.lat - orig.lat;
    const dLng = dest.lng - orig.lng;

    return [
      {
        id: "segura",
        nombre: "Vía Segura por Autopista (Recomendada)",
        color: "#198754", // Verde
        distancia: "18.6 km",
        tiempo: "52 min",
        riesgo: "Bajo (Vía Segura)",
        alertaClase: "success",
        estadoVial: "Pavimentada al 100%, iluminación LED, cámaras de fotomulta activas.",
        peligro: "Mayor tiempo de desplazamiento debido a reductores y controles viales.",
        pasos: [
          "Salida por Corredor Principal iluminado",
          "Incorporación a Avenida Principal por carril derecho",
          "Paso por punto de control vial y seguridad comunitaria",
          "Llegada al destino final por vía ancha señalizada",
        ],
        camino: [
          [orig.lat, orig.lng],
          [orig.lat + dLat * 0.2, orig.lng + dLng * 0.05],
          [orig.lat + dLat * 0.5, orig.lng + dLng * 0.35],
          [orig.lat + dLat * 0.85, orig.lng + dLng * 0.75],
          [dest.lat, dest.lng],
        ],
      },
      {
        id: "rapida",
        nombre: "Atajo Rápido (Zona de Precaución / Trocha)",
        color: "#dc3545", // Rojo
        distancia: "11.2 km",
        tiempo: "27 min",
        riesgo: "Alto (Zona Crítica)",
        alertaClase: "danger",
        estadoVial: "Tramos sin pavimentar (trocha), huecos profundos y sin alumbrado.",
        peligro:
          "¡ADVERTENCIA! Ahorras 25 minutos pero cruza sectores solitarios propensos a hurtos y averías mecánicas en motocicletas/furgones de carga.",
        pasos: [
          "Desvío inmediato por callejones secundarios no señalizados",
          "Cruce por tramo destapado (velocidad máx recomendada 15 km/h)",
          "Sector despoblado sin presencia policial ni cámaras",
          "Conexión forzada con la vía de entrega por calle estrecha",
        ],
        camino: [
          [orig.lat, orig.lng],
          [orig.lat + dLat * 0.35, orig.lng + dLng * 0.65],
          [orig.lat + dLat * 0.7, orig.lng + dLng * 0.85],
          [dest.lat, dest.lng],
        ],
      },
      {
        id: "comercial",
        nombre: "Ruta Comercial Mixta",
        color: "#ffc107", // Amarillo
        distancia: "14.9 km",
        tiempo: "39 min",
        riesgo: "Medio (Tráfico Pesado)",
        alertaClase: "warning",
        estadoVial: "Vía pavimentada regular, zonas de descargue y semaforización continua.",
        peligro: "Demoras por congestión en zonas de bodegas comerciales y alto flujo de camiones.",
        pasos: [
          "Avenida intermedia cruzando sector de abastos/comercio",
          "Rotonda de alto flujo vehicular con posibles represamientos",
          "Carril compartido con transporte público masivo",
          "Ingreso directo al punto de entrega",
        ],
        camino: [
          [orig.lat, orig.lng],
          [orig.lat + dLat * 0.25, orig.lng + dLng * 0.2],
          [orig.lat + dLat * 0.6, orig.lng + dLng * 0.5],
          [orig.lat + dLat * 0.8, orig.lng + dLng * 0.7],
          [dest.lat, dest.lng],
        ],
      },
    ];
  };

  const rutas = generarRutas(ORIGEN_BODEGA, destino);
  const rutaSeleccionada = rutas.find((r) => r.id === rutaElegida) || rutas[0];

  // Inicializar Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView(
        [ORIGEN_BODEGA.lat, ORIGEN_BODEGA.lng],
        12
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      }).addTo(map);

      layersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Evento de click para fijar destino libre en el mapa
      map.on("click", (e) => {
        setDestino({
          nombre: `Punto Seleccionado (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`,
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Redibujar capas al cambiar destino o ruta activa
  useEffect(() => {
    if (!layersGroupRef.current || !mapInstanceRef.current) return;

    layersGroupRef.current.clearLayers();

    // 1. Marcador Origen
    const markerOrigen = L.marker([ORIGEN_BODEGA.lat, ORIGEN_BODEGA.lng]).bindPopup(`
      <div style="font-family: sans-serif;">
        <strong style="color: #111;">📦 Salida de Envíos</strong><br/>
        <small>${ORIGEN_BODEGA.nombre}</small>
      </div>
    `);
    layersGroupRef.current.addLayer(markerOrigen);

    // 2. Marcador Destino
    const markerDestino = L.marker([destino.lat, destino.lng]).bindPopup(`
      <div style="font-family: sans-serif;">
        <strong style="color: #111;">🎯 Punto de Entrega</strong><br/>
        <small>${destino.nombre}</small>
      </div>
    `);
    layersGroupRef.current.addLayer(markerDestino);

    // 3. Trazado de las 3 alternativas
    rutas.forEach((r) => {
      const esActiva = r.id === rutaElegida;
      const linea = L.polyline(r.camino, {
        color: r.color,
        weight: esActiva ? 6 : 3,
        opacity: esActiva ? 1 : 0.45,
        dashArray: r.id === "rapida" ? "7, 7" : null,
      });

      linea.bindTooltip(
        `<strong>${r.nombre}</strong><br/>⏱ ${r.tiempo} • 📏 ${r.distancia} • ⚠️ ${r.riesgo}`,
        { sticky: true }
      );

      linea.on("click", () => setRutaElegida(r.id));
      layersGroupRef.current.addLayer(linea);
    });

    // Encuadre automático
    const bounds = L.latLngBounds([
      [ORIGEN_BODEGA.lat, ORIGEN_BODEGA.lng],
      [destino.lat, destino.lng],
    ]);
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
  }, [destino, rutaElegida]);

  // Manejador de búsqueda rápida de dirección predeterminada
  const handleBuscar = (e) => {
    e.preventDefault();
    if (!direccionInput.trim()) return;

    // Destinos de demostración con coordenadas reales
    const busqueda = direccionInput.toLowerCase();
    if (busqueda.includes("suba") || busqueda.includes("noroeste")) {
      setDestino({ nombre: "Suba Rincón - Entrega Directa", lat: 4.7431, lng: -74.0892 });
    } else if (busqueda.includes("soacha") || busqueda.includes("sur")) {
      setDestino({ nombre: "Soacha Centro - Despacho Sur", lat: 4.5802, lng: -74.2185 });
    } else if (busqueda.includes("centro") || busqueda.includes("candelaria")) {
      setDestino({ nombre: "La Candelaria - Centro Histórico", lat: 4.5956, lng: -74.0722 });
    } else if (busqueda.includes("chapinero")) {
      setDestino({ nombre: "Chapinero Alto - Tienda Aliada", lat: 4.6465, lng: -74.0601 });
    } else {
      // Coordenada con leve offset simulado para cualquier otra dirección
      const nuevoLat = ORIGEN_BODEGA.lat + (Math.random() * 0.1 - 0.05);
      const nuevoLng = ORIGEN_BODEGA.lng + (Math.random() * 0.1 - 0.05);
      setDestino({ nombre: direccionInput, lat: nuevoLat, lng: nuevoLng });
    }
    setDireccionInput("");
  };

  return (
    <div className="container py-4">
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <span className="badge bg-dark text-uppercase px-3 py-1 mb-2">
            Sistema Inteligente de Guía y Navegación
          </span>
          <h2 className="fw-bold mb-1">Optimizador de Rutas y Seguridad de Entrega</h2>
          <p className="text-muted mb-0">
            Haz click en cualquier punto del mapa o escribe una dirección para comparar las vías según velocidad y seguridad vial.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* MAPA INTERACTIVO */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm overflow-hidden mb-3">
            <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <span className="fw-semibold text-dark">
                <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                Destino actual: <strong>{destino.nombre}</strong>
              </span>
              <small className="text-muted">
                <i className="bi bi-hand-index-thumb me-1"></i>
                Haz click en el mapa para mover el destino
              </small>
            </div>
            <div
              ref={mapContainerRef}
              style={{ height: "540px", width: "100%", zIndex: 1 }}
            />
          </div>

          {/* BUSCADOR DE DIRECCIONES */}
          <div className="card border-0 shadow-sm p-3">
            <form onSubmit={handleBuscar} className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Escribe una dirección o localidad (ej. Suba, Chapinero, Soacha, Calle 100)..."
                value={direccionInput}
                onChange={(e) => setDireccionInput(e.target.value)}
              />
              <button type="submit" className="btn btn-dark px-4 d-flex align-items-center gap-2">
                <i className="bi bi-search"></i>
                Localizar
              </button>
            </form>
          </div>
        </div>

        {/* PANEL LATERAL DE CONTROL Y COMPARACIÓN */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 className="fw-bold mb-3">Comparativa de Opciones</h5>

              {/* SELECTOR DE RUTAS */}
              <div className="d-flex flex-column gap-3 mb-4">
                {rutas.map((r) => {
                  const activa = r.id === rutaElegida;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setRutaElegida(r.id)}
                      className={`p-3 rounded-3 border transition-all cursor-pointer ${
                        activa
                          ? "border-dark bg-light shadow-sm"
                          : "border-light-subtle bg-white"
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bold" style={{ color: r.color }}>
                          ● {r.tiempo}
                        </span>
                        <span className={`badge bg-${r.alertaClase}-subtle text-${r.alertaClase} border`}>
                          {r.riesgo}
                        </span>
                      </div>
                      <div className="fw-semibold text-dark small mb-1">{r.nombre}</div>
                      <div className="text-muted small">Distancia total: {r.distancia}</div>
                    </div>
                  );
                })}
              </div>

              {/* ANÁLISIS DE RIESGO DE LA RUTA ELEGIDA */}
              <div className={`alert alert-${rutaSeleccionada.alertaClase} border mb-3`}>
                <h6 className="fw-bold alert-heading d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-shield-shaded"></i>
                  Evaluación de Seguridad ({rutaSeleccionada.riesgo})
                </h6>
                <p className="small mb-2">
                  <strong>Estado vial:</strong> {rutaSeleccionada.estadoVial}
                </p>
                <p className="small mb-0">
                  <strong>Diagnóstico:</strong> {rutaSeleccionada.peligro}
                </p>
              </div>

              {/* GUÍA PASO A PASO */}
              <div className="bg-light rounded-3 p-3 mb-3">
                <h6 className="fw-bold text-dark small text-uppercase mb-2">
                  <i className="bi bi-signpost-2 me-1"></i> Itinerario Guía de Despacho
                </h6>
                <ol className="small ps-3 mb-0 text-muted">
                  {rutaSeleccionada.pasos.map((paso, idx) => (
                    <li key={idx} className="mb-1">
                      {paso}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* BOTÓN DE CONFIRMACIÓN DE DESPACHO */}
            <button
              type="button"
              className="btn btn-dark w-100 py-2 fw-semibold"
              onClick={() =>
                alert(
                  `Ruta seleccionada: ${rutaSeleccionada.nombre}\nDestino: ${destino.nombre}\nTiempo estimado: ${rutaSeleccionada.tiempo}\nNivel de riesgo: ${rutaSeleccionada.riesgo}`
                )
              }
            >
              <i className="bi bi-send-check me-2"></i>
              Iniciar Entrega con esta Guía
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RutaEntrega;