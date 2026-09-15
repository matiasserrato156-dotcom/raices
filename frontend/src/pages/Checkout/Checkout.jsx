import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../../context/CarritoContext";

const CENTRO_DESPACHO = [4.5981, -74.076];

const METODOS_PAGO = {
  contraentrega: {
    nombre: "Contraentrega",
    icono: "💵",
    descripcion:
      "Pagas en efectivo al recibir tu pedido.",
  },
  nequi: {
    nombre: "Nequi",
    icono: "📱",
    descripcion:
      "Realiza el pago por Nequi y adjunta el comprobante.",
  },
  bancolombia: {
    nombre: "Bancolombia",
    icono: "🏦",
    descripcion:
      "Realiza la transferencia y adjunta el comprobante.",
  },
};

function Checkout() {
  const {
    carrito,
    totalCarrito,
    cantidadCarrito,
    crearPedido,
    procesandoPedido,
    errorPedido,
  } = useCarrito();

  const navigate = useNavigate();

  const mapaRef = useRef(null);
  const mapaInstanciaRef = useRef(null);
  const marcadorRef = useRef(null);
  const rutaRef = useRef(null);
  const vozRef = useRef(null);

  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [ubicacion, setUbicacion] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const [buscando, setBuscando] = useState(false);
  const [cargandoRuta, setCargandoRuta] = useState(false);

  const [distancia, setDistancia] = useState(null);
  const [duracion, setDuracion] = useState(null);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [vozActiva, setVozActiva] = useState(false);

  const [metodoPago, setMetodoPago] =
    useState("contraentrega");

  const [referenciaPago, setReferenciaPago] =
    useState("");

  const [comprobantePago, setComprobantePago] =
    useState(null);

  const [enviando, setEnviando] = useState(false);

  const formatoPrecio = (precio) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(Number(precio || 0));
  };

  /*
   * ============================================================
   * VOZ EN ESPAÑOL
   * ============================================================
   */

  const detenerVoz = () => {
    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    vozRef.current = null;
    setVozActiva(false);
  };

  const obtenerVozEspanol = () => {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return null;
    }

    const voces =
      window.speechSynthesis.getVoices();

    if (!voces || !voces.length) {
      return null;
    }

    /*
     * PRIORIDAD:
     * 1. Español Colombia
     * 2. Español España
     * 3. Español México
     * 4. Cualquier español
     *
     * IMPORTANTE:
     * Nunca escogemos inglés como respaldo.
     */

    const prioridades = [
      (voz) =>
        voz.lang?.toLowerCase() === "es-co",

      (voz) =>
        voz.lang?.toLowerCase() === "es-es",

      (voz) =>
        voz.lang?.toLowerCase() === "es-mx",

      (voz) =>
        voz.lang?.toLowerCase().startsWith("es-"),

      (voz) =>
        voz.lang?.toLowerCase() === "es",
    ];

    for (const prioridad of prioridades) {
      const encontrada = voces.find(prioridad);

      if (encontrada) {
        return encontrada;
      }
    }

    return null;
  };

  const hablar = (texto) => {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      setError(
        "Tu navegador no permite reproducción de voz."
      );
      return;
    }

    detenerVoz();

    const reproducir = () => {
      const voz = obtenerVozEspanol();

      if (!voz) {
        setError(
          "No encontré una voz en español instalada en el navegador. Revisa las voces de español de tu sistema."
        );
        return;
      }

      const utterance =
        new SpeechSynthesisUtterance(texto);

      utterance.lang = voz.lang || "es-CO";
      utterance.voice = voz;

      utterance.rate = 0.92;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setVozActiva(true);
      };

      utterance.onend = () => {
        setVozActiva(false);
        vozRef.current = null;
      };

      utterance.onerror = () => {
        setVozActiva(false);
        vozRef.current = null;
      };

      vozRef.current = utterance;

      window.speechSynthesis.speak(
        utterance
      );
    };

    /*
     * Algunos navegadores cargan las voces
     * después de abrir la página.
     */
    const vocesDisponibles =
      window.speechSynthesis.getVoices();

    if (vocesDisponibles.length) {
      reproducir();
    } else {
      setTimeout(reproducir, 300);
    }
  };

  const leerResumen = () => {
    const metodo =
      METODOS_PAGO[metodoPago]?.nombre ||
      "método de pago seleccionado";

    const texto = `
      Bienvenido a Raíces.
      Tu compra tiene ${cantidadCarrito} productos.
      El total de tu pedido es ${formatoPrecio(totalCarrito)}.
      El método de pago seleccionado es ${metodo}.
      ${
        distancia
          ? `La distancia aproximada es de ${distancia} kilómetros.`
          : ""
      }
      ${
        duracion
          ? `El tiempo estimado de recorrido es de ${duracion} minutos.`
          : ""
      }
      Revisa tus datos y confirma tu compra.
    `;

    hablar(texto);
  };

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.getVoices();

      const cargarVoces = () => {
        window.speechSynthesis.getVoices();
      };

      window.speechSynthesis.onvoiceschanged =
        cargarVoces;

      return () => {
        window.speechSynthesis.onvoiceschanged =
          null;

        window.speechSynthesis.cancel();
      };
    }
  }, []);

  /*
   * ============================================================
   * MAPA
   * ============================================================
   */

  useEffect(() => {
    let cancelado = false;

    const cargarMapa = async () => {
      if (!mapaRef.current) {
        return;
      }

      try {
        const L = await import("leaflet");

        if (cancelado) {
          return;
        }

        await import("leaflet/dist/leaflet.css");

        if (mapaInstanciaRef.current) {
          return;
        }

        const mapa = L.map(
          mapaRef.current
        ).setView(CENTRO_DESPACHO, 13);

        L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; OpenStreetMap contributors',
          }
        ).addTo(mapa);

        L.marker(CENTRO_DESPACHO)
          .addTo(mapa)
          .bindPopup(
            "<strong>Centro de despacho RAÍCES</strong>"
          );

        mapaInstanciaRef.current = mapa;
      } catch (mapError) {
        console.error(
          "Error cargando mapa:",
          mapError
        );

        setError(
          "No fue posible cargar el mapa."
        );
      }
    };

    cargarMapa();

    return () => {
      cancelado = true;
    };
  }, []);

  /*
   * ============================================================
   * OBTENER UBICACIÓN
   * ============================================================
   */

  const obtenerUbicacion = () => {
    setError("");
    setMensaje("");

    if (!navigator.geolocation) {
      setError(
        "Tu navegador no permite obtener la ubicación."
      );
      return;
    }

    setMensaje(
      "Obteniendo tu ubicación..."
    );

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat =
          position.coords.latitude;

        const lon =
          position.coords.longitude;

        const nuevaUbicacion = {
          latitud: lat,
          longitud: lon,
        };

        setUbicacion(nuevaUbicacion);

        await actualizarMapa(
          lat,
          lon
        );

        await obtenerDireccion(
          lat,
          lon
        );

        await calcularRuta(
          lat,
          lon
        );

        setMensaje(
          "Ubicación obtenida correctamente."
        );
      },
      (geoError) => {
        console.error(
          "Error de ubicación:",
          geoError
        );

        setMensaje("");

        if (
          geoError.code ===
          geoError.PERMISSION_DENIED
        ) {
          setError(
            "Debes permitir el acceso a tu ubicación para calcular la ruta."
          );
        } else {
          setError(
            "No fue posible obtener tu ubicación."
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  /*
   * ============================================================
   * MAPA - ACTUALIZAR MARCADOR
   * ============================================================
   */

  const actualizarMapa = async (
    lat,
    lon
  ) => {
    if (!mapaInstanciaRef.current) {
      return;
    }

    const L = await import("leaflet");

    const mapa =
      mapaInstanciaRef.current;

    if (marcadorRef.current) {
      marcadorRef.current.remove();
    }

    marcadorRef.current = L.marker([
      lat,
      lon,
    ])
      .addTo(mapa)
      .bindPopup(
        "<strong>Tu ubicación</strong>"
      )
      .openPopup();

    mapa.setView(
      [lat, lon],
      15
    );
  };

  /*
   * ============================================================
   * DIRECCIÓN CON NOMINATIM
   * ============================================================
   */

  const obtenerDireccion = async (
    lat,
    lon
  ) => {
    try {
      const response =
        await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=es`
        );

      if (!response.ok) {
        return;
      }

      const data =
        await response.json();

      const direccionNominatim =
        data.display_name;

      if (direccionNominatim) {
        setDireccion(
          direccionNominatim
        );
      }
    } catch (direccionError) {
      console.error(
        "Error obteniendo dirección:",
        direccionError
      );
    }
  };

  /*
   * ============================================================
   * BUSCAR DIRECCIÓN
   * ============================================================
   */

  const buscarDireccion = async (
    event
  ) => {
    event?.preventDefault();

    const texto =
      busqueda.trim();

    if (!texto) {
      setError(
        "Escribe una dirección para buscar."
      );
      return;
    }

    setBuscando(true);
    setError("");
    setMensaje("");

    try {
      const response =
        await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=co&q=${encodeURIComponent(
            texto
          )}&accept-language=es`
        );

      if (!response.ok) {
        throw new Error(
          "No fue posible buscar la dirección."
        );
      }

      const resultados =
        await response.json();

      if (
        !Array.isArray(resultados) ||
        resultados.length === 0
      ) {
        throw new Error(
          "No encontramos esa dirección."
        );
      }

      const resultado =
        resultados[0];

      const lat =
        Number(resultado.lat);

      const lon =
        Number(resultado.lon);

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lon)
      ) {
        throw new Error(
          "La ubicación encontrada no es válida."
        );
      }

      const nuevaUbicacion = {
        latitud: lat,
        longitud: lon,
      };

      setUbicacion(
        nuevaUbicacion
      );

      setDireccion(
        resultado.display_name || texto
      );

      await actualizarMapa(
        lat,
        lon
      );

      await calcularRuta(
        lat,
        lon
      );

      setMensaje(
        "Dirección encontrada correctamente."
      );
    } catch (searchError) {
      console.error(
        "Error buscando dirección:",
        searchError
      );

      setError(
        searchError.message ||
          "No fue posible encontrar la dirección."
      );
    } finally {
      setBuscando(false);
    }
  };

  /*
   * ============================================================
   * RUTA OSRM
   * ============================================================
   */

  const calcularRuta = async (
    lat,
    lon
  ) => {
    setCargandoRuta(true);

    try {
      const [origenLat, origenLon] =
        CENTRO_DESPACHO;

      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${origenLon},${origenLat};${lon},${lat}` +
        `?overview=full&geometries=geojson`;

      const response =
        await fetch(url);

      if (!response.ok) {
        throw new Error(
          "No fue posible calcular la ruta."
        );
      }

      const data =
        await response.json();

      if (
        !data.routes ||
        !data.routes.length
      ) {
        throw new Error(
          "No encontramos una ruta disponible."
        );
      }

      const ruta =
        data.routes[0];

      const distanciaKm =
        Number(ruta.distance) / 1000;

      const duracionMin =
        Number(ruta.duration) / 60;

      setDistancia(
        distanciaKm.toFixed(1)
      );

      setDuracion(
        Math.max(
          1,
          Math.round(duracionMin)
        )
      );

      if (
        mapaInstanciaRef.current &&
        ruta.geometry
      ) {
        const L =
          await import("leaflet");

        if (rutaRef.current) {
          rutaRef.current.remove();
        }

        const coordenadas =
          ruta.geometry.coordinates.map(
            ([lonRuta, latRuta]) => [
              latRuta,
              lonRuta,
            ]
          );

        rutaRef.current =
          L.polyline(
            coordenadas,
            {
              weight: 5,
            }
          ).addTo(
            mapaInstanciaRef.current
          );

        mapaInstanciaRef.current.fitBounds(
          rutaRef.current.getBounds(),
          {
            padding: [30, 30],
          }
        );
      }
    } catch (routeError) {
      console.error(
        "Error calculando ruta:",
        routeError
      );

      setError(
        "No fue posible calcular la ruta automáticamente."
      );
    } finally {
      setCargandoRuta(false);
    }
  };

  /*
   * ============================================================
   * ARCHIVO DE COMPROBANTE
   * ============================================================
   */

  const seleccionarComprobante = (
    event
  ) => {
    const archivo =
      event.target.files?.[0];

    if (!archivo) {
      setComprobantePago(null);
      return;
    }

    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (
      !tiposPermitidos.includes(
        archivo.type
      )
    ) {
      setError(
        "El comprobante debe ser JPG, PNG, WEBP o PDF."
      );

      event.target.value = "";
      setComprobantePago(null);
      return;
    }

    const maximo =
      5 * 1024 * 1024;

    if (archivo.size > maximo) {
      setError(
        "El comprobante no puede superar 5 MB."
      );

      event.target.value = "";
      setComprobantePago(null);
      return;
    }

    setError("");
    setComprobantePago(
      archivo
    );
  };

  /*
   * ============================================================
   * FINALIZAR PEDIDO
   * ============================================================
   */

  const finalizarCompra = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setMensaje("");

    if (
      !carrito ||
      carrito.length === 0
    ) {
      setError(
        "La canasta está vacía."
      );
      return;
    }

    const direccionLimpia =
      direccion.trim();

    if (!direccionLimpia) {
      setError(
        "Debes ingresar una dirección de entrega."
      );
      return;
    }

    const telefonoLimpio =
      telefono.trim();

    if (!telefonoLimpio) {
      setError(
        "Debes ingresar un número de teléfono."
      );
      return;
    }

    if (!ubicacion) {
      setError(
        "Debes seleccionar una ubicación en el mapa."
      );
      return;
    }

    if (
      metodoPago !==
        "contraentrega" &&
      !referenciaPago.trim()
    ) {
      setError(
        "Ingresa la referencia del pago."
      );
      return;
    }

    if (
      metodoPago !==
        "contraentrega" &&
      !comprobantePago
    ) {
      setError(
        "Adjunta el comprobante del pago."
      );
      return;
    }

    setEnviando(true);

    try {
      const pedido =
        await crearPedido({
          direccion:
            direccionLimpia,

          observaciones:
            observaciones.trim(),

          telefono:
            telefonoLimpio,

          ubicacion,

          metodoPago,

          referenciaPago:
            referenciaPago.trim(),

          comprobantePago,
        });

      detenerVoz();

      alert(
        `¡Pedido creado correctamente!\n\nNúmero de pedido: #${pedido.id}\n\nTu pedido quedó registrado y será procesado por RAÍCES.`
      );

      navigate("/pedidos");
    } catch (pedidoError) {
      console.error(
        "Error al finalizar compra:",
        pedidoError
      );

      setError(
        pedidoError?.message ||
          "No fue posible finalizar la compra."
      );
    } finally {
      setEnviando(false);
    }
  };

  /*
   * ============================================================
   * RESUMEN DEL PAGO
   * ============================================================
   */

  const textoPago = useMemo(() => {
    if (
      metodoPago ===
      "contraentrega"
    ) {
      return "Pagarás cuando recibas tu pedido.";
    }

    if (
      metodoPago ===
      "nequi"
    ) {
      return "Realiza tu pago por Nequi y adjunta el comprobante.";
    }

    return "Realiza tu transferencia por Bancolombia y adjunta el comprobante.";
  }, [metodoPago]);

  /*
   * ============================================================
   * CARRITO VACÍO
   * ============================================================
   */

  if (
    !carrito ||
    carrito.length === 0
  ) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div
            className="mb-4"
            style={{
              fontSize: "4rem",
            }}
          >
            🛒
          </div>

          <h1 className="fw-bold">
            Tu carrito está vacío
          </h1>

          <p className="text-muted">
            Agrega productos artesanales
            para comenzar tu compra.
          </p>

          <Link
            to="/productos"
            className="btn btn-dark mt-3"
          >
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * INTERFAZ
   * ============================================================
   */

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <span className="badge bg-dark mb-3">
          RAÍCES
        </span>

        <h1 className="fw-bold">
          Finalizar compra
        </h1>

        <p className="text-muted">
          Completa tus datos de entrega
          y selecciona tu forma de pago.
        </p>

        <button
          type="button"
          className={`btn ${
            vozActiva
              ? "btn-danger"
              : "btn-outline-dark"
          } mt-2`}
          onClick={
            vozActiva
              ? detenerVoz
              : leerResumen
          }
        >
          {vozActiva
            ? "🔇 Detener voz"
            : "🔊 Escuchar resumen"}
        </button>
      </div>

      {errorPedido && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          {errorPedido}
        </div>
      )}

      {error && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          {error}
        </div>
      )}

      {mensaje && (
        <div
          className="alert alert-info"
          role="alert"
        >
          {mensaje}
        </div>
      )}

      <div className="row g-4">
        {/* ================================================= */}
        {/* MAPA Y ENTREGA */}
        {/* ================================================= */}

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h4 className="fw-bold mb-3">
                📍 Datos de entrega
              </h4>

              <label className="form-label fw-semibold">
                Buscar dirección
              </label>

              <form
                onSubmit={buscarDireccion}
                className="d-flex gap-2 mb-3"
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Calle 80 # 10-20, Bogotá"
                  value={busqueda}
                  onChange={(event) =>
                    setBusqueda(
                      event.target.value
                    )
                  }
                  disabled={
                    procesandoPedido ||
                    enviando
                  }
                />

                <button
                  type="submit"
                  className="btn btn-dark"
                  disabled={
                    buscando ||
                    procesandoPedido ||
                    enviando
                  }
                >
                  {buscando
                    ? "Buscando..."
                    : "Buscar"}
                </button>
              </form>

              <button
                type="button"
                className="btn btn-outline-primary w-100 mb-3"
                onClick={
                  obtenerUbicacion
                }
                disabled={
                  procesandoPedido ||
                  enviando
                }
              >
                📍 Usar mi ubicación actual
              </button>

              <div
                ref={mapaRef}
                style={{
                  width: "100%",
                  height: "360px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border:
                    "1px solid #ddd",
                }}
              />

              <div className="mt-3">
                <label className="form-label fw-semibold">
                  Dirección de entrega
                </label>

                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Escribe o selecciona tu dirección"
                  value={direccion}
                  onChange={(event) =>
                    setDireccion(
                      event.target.value
                    )
                  }
                  disabled={
                    procesandoPedido ||
                    enviando
                  }
                />
              </div>

              {ubicacion && (
                <div className="alert alert-light border mt-3 mb-0">
                  <strong>
                    Ubicación seleccionada
                  </strong>

                  <div className="small text-muted mt-1">
                    Latitud:{" "}
                    {Number(
                      ubicacion.latitud
                    ).toFixed(6)}
                  </div>

                  <div className="small text-muted">
                    Longitud:{" "}
                    {Number(
                      ubicacion.longitud
                    ).toFixed(6)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================================================= */}
          {/* RUTA */}
          {/* ================================================= */}

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h4 className="fw-bold mb-3">
                🚚 Información de entrega
              </h4>

              {cargandoRuta ? (
                <div className="alert alert-info mb-0">
                  Calculando la ruta de entrega...
                </div>
              ) : distancia ? (
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded">
                      <div className="text-muted small">
                        Distancia aproximada
                      </div>

                      <div className="fs-4 fw-bold">
                        {distancia} km
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded">
                      <div className="text-muted small">
                        Tiempo estimado
                      </div>

                      <div className="fs-4 fw-bold">
                        {duracion} min
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted mb-0">
                  Selecciona una ubicación
                  para calcular la ruta.
                </p>
              )}
            </div>
          </div>

          {/* ================================================= */}
          {/* CONTACTO */}
          {/* ================================================= */}

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h4 className="fw-bold mb-3">
                📞 Información de contacto
              </h4>

              <label className="form-label fw-semibold">
                Teléfono
              </label>

              <input
                type="tel"
                className="form-control"
                placeholder="Ej: 3001234567"
                value={telefono}
                onChange={(event) =>
                  setTelefono(
                    event.target.value
                  )
                }
                disabled={
                  procesandoPedido ||
                  enviando
                }
              />

              <label className="form-label fw-semibold mt-3">
                Observaciones
              </label>

              <textarea
                className="form-control"
                rows="3"
                placeholder="Información adicional para la entrega..."
                value={observaciones}
                onChange={(event) =>
                  setObservaciones(
                    event.target.value
                  )
                }
                disabled={
                  procesandoPedido ||
                  enviando
                }
              />
            </div>
          </div>

          {/* ================================================= */}
          {/* PAGO */}
          {/* ================================================= */}

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h4 className="fw-bold mb-3">
                💳 Forma de pago
              </h4>

              <div className="row g-3">
                {Object.entries(
                  METODOS_PAGO
                ).map(
                  ([
                    codigo,
                    metodo,
                  ]) => (
                    <div
                      className="col-md-4"
                      key={codigo}
                    >
                      <button
                        type="button"
                        className={`w-100 text-start h-100 p-3 rounded border ${
                          metodoPago ===
                          codigo
                            ? "border-dark bg-light"
                            : "border-secondary bg-white"
                        }`}
                        onClick={() =>
                          setMetodoPago(
                            codigo
                          )
                        }
                        disabled={
                          procesandoPedido ||
                          enviando
                        }
                        style={{
                          cursor:
                            "pointer",
                        }}
                      >
                        <div className="fs-3">
                          {metodo.icono}
                        </div>

                        <div className="fw-bold">
                          {metodo.nombre}
                        </div>

                        <div className="small text-muted mt-1">
                          {metodo.descripcion}
                        </div>
                      </button>
                    </div>
                  )
                )}
              </div>

              <div className="alert alert-secondary mt-4">
                {textoPago}
              </div>

              {metodoPago ===
                "nequi" && (
                <div className="alert alert-light border">
                  <strong>
                    Pago por Nequi
                  </strong>

                  <p className="mb-0 mt-2">
                    Configura aquí el número
                    de Nequi de RAÍCES.
                  </p>
                </div>
              )}

              {metodoPago ===
                "bancolombia" && (
                <div className="alert alert-light border">
                  <strong>
                    Pago por Bancolombia
                  </strong>

                  <p className="mb-0 mt-2">
                    Configura aquí los datos
                    de la cuenta de RAÍCES.
                  </p>
                </div>
              )}

              {metodoPago !==
                "contraentrega" && (
                <>
                  <div className="mt-3">
                    <label className="form-label fw-semibold">
                      Referencia del pago
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Número de referencia o comprobante"
                      value={
                        referenciaPago
                      }
                      onChange={(
                        event
                      ) =>
                        setReferenciaPago(
                          event.target.value
                        )
                      }
                      disabled={
                        procesandoPedido ||
                        enviando
                      }
                    />
                  </div>

                  <div className="mt-3">
                    <label className="form-label fw-semibold">
                      Comprobante de pago
                    </label>

                    <input
                      type="file"
                      className="form-control"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      onChange={
                        seleccionarComprobante
                      }
                      disabled={
                        procesandoPedido ||
                        enviando
                      }
                    />

                    <div className="form-text">
                      JPG, PNG, WEBP o PDF.
                      Máximo 5 MB.
                    </div>

                    {comprobantePago && (
                      <div className="alert alert-success mt-3 mb-0">
                        Comprobante seleccionado:
                        <br />
                        <strong>
                          {
                            comprobantePago.name
                          }
                        </strong>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* RESUMEN */}
        {/* ================================================= */}

        <div className="col-lg-5">
          <div
            className="card border-0 shadow-sm"
            style={{
              position:
                "sticky",
              top: "20px",
            }}
          >
            <div className="card-body">
              <h4 className="fw-bold mb-4">
                🛒 Resumen del pedido
              </h4>

              {carrito.map(
                (item, index) => {
                  const id = Number(
                    item.producto_id ??
                      item.id
                  );

                  const nombre =
                    item.nombre ||
                    item.name ||
                    `Producto ${id}`;

                  const cantidad =
                    Number(
                      item.cantidad ||
                        0
                    );

                  const precio =
                    Number(
                      item.precio ??
                        item.price ??
                        0
                    );

                  return (
                    <div
                      key={`${id}-${index}`}
                      className="d-flex justify-content-between align-items-start border-bottom py-3"
                    >
                      <div>
                        <div className="fw-semibold">
                          {nombre}
                        </div>

                        <div className="small text-muted">
                          Cantidad:{" "}
                          {cantidad}
                        </div>
                      </div>

                      <strong>
                        {formatoPrecio(
                          precio *
                            cantidad
                        )}
                      </strong>
                    </div>
                  );
                }
              )}

              <div className="d-flex justify-content-between mt-4">
                <span>
                  Productos
                </span>

                <strong>
                  {cantidadCarrito}
                </strong>
              </div>

              <div className="d-flex justify-content-between mt-2">
                <span>
                  Método de pago
                </span>

                <strong>
                  {
                    METODOS_PAGO[
                      metodoPago
                    ].nombre
                  }
                </strong>
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-center">
                <strong className="fs-5">
                  Total
                </strong>

                <strong className="fs-3">
                  {formatoPrecio(
                    totalCarrito
                  )}
                </strong>
              </div>

              <form
                onSubmit={
                  finalizarCompra
                }
                className="mt-4"
              >
                <button
                  type="submit"
                  className="btn btn-success btn-lg w-100"
                  disabled={
                    procesandoPedido ||
                    enviando
                  }
                >
                  {procesandoPedido ||
                  enviando
                    ? "Procesando pedido..."
                    : "✅ Confirmar compra"}
                </button>
              </form>

              <Link
                to="/productos"
                className="btn btn-outline-secondary w-100 mt-2"
              >
                Seguir comprando
              </Link>

              <div className="small text-muted text-center mt-3">
                Tu pedido será registrado
                y posteriormente gestionado
                por RAÍCES.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;