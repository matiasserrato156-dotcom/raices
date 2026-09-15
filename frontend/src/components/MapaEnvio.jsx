import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function ActualizarCentro({ center }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 15);
    }, [center, map]);
    return null;
}

const PAISES = [
    { codigo: 'co', nombre: 'Colombia', centro: [4.5709, -74.2973] },
    { codigo: 'mx', nombre: 'México', centro: [23.6345, -102.5528] },
    { codigo: 'es', nombre: 'España', centro: [40.4168, -3.7038] },
    { codigo: 'ar', nombre: 'Argentina', centro: [-38.4161, -63.6167] },
    { codigo: 'us', nombre: 'Estados Unidos', centro: [37.0902, -95.7129] },
    { codigo: 'pe', nombre: 'Perú', centro: [-9.1900, -75.0152] },
    { codigo: 'cl', nombre: 'Chile', centro: [-35.6751, -71.5430] }
];

export default function MapaEnvio({ direccionInicial, onUbicacionSeleccionada }) {
    const [paisSeleccionado, setPaisSeleccionado] = useState(PAISES[0]);
    const [position, setPosition] = useState(PAISES[0].centro);
    const [busqueda, setBusqueda] = useState(direccionInicial || '');
    const [errorMapa, setErrorMapa] = useState('');
    const [cargando, setCargando] = useState(false);

    const cambiarPais = (e) => {
        const codigoBuscado = e.target.value;
        const paisEncontrado = PAISES.find(p => p.codigo === codigoBuscado);
        if (paisEncontrado) {
            setPaisSeleccionado(paisEncontrado);
            setPosition(paisEncontrado.centro);
            setBusqueda('');
            setErrorMapa('');
        }
    };

    const buscarEnMapa = async (e) => {
        if (e) e.preventDefault();
        if (!busqueda.trim()) return;

        setCargando(true);
        setErrorMapa('');

        try {
            // Forzamos el contexto geográfico estricto al país seleccionado y añadimos parámetros para priorizar resultados locales
            const textoBusqueda = busqueda.toLowerCase().includes(paisSeleccionado.nombre.toLowerCase()) 
                ? busqueda 
                : `${busqueda}, ${paisSeleccionado.nombre}`;

            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(textoBusqueda)}&countrycodes=${paisSeleccionado.codigo}&addressdetails=1&limit=1`;
            
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.length > 0) {
                const nuevaLat = parseFloat(data[0].lat);
                const nuevaLon = parseFloat(data[0].lon);
                const nuevaPos = [nuevaLat, nuevaLon];
                
                setPosition(nuevaPos);
                if (onUbicacionSeleccionada) {
                    onUbicacionSeleccionada({ 
                        lat: nuevaLat, 
                        lon: nuevaLon, 
                        direccion: data[0].display_name,
                        pais: paisSeleccionado.nombre 
                    });
                }
            } else {
                setErrorMapa(`No se encontró esa dirección exacta en ${paisSeleccionado.nombre}. Intenta especificando la ciudad o el barrio.`);
            }
        } catch (err) {
            console.error(err);
            setErrorMapa('Error al conectar con la red de mapas.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mt-6">
            <h3 className="text-xl font-bold text-amber-900 mb-1">Mapa de Destino Internacional</h3>
            <p className="text-gray-600 text-sm mb-4">Selecciona el país y escribe una dirección real para ubicarla sin errores geográficos.</p>

            <div className="mb-3">
                <label className="block text-gray-700 font-medium text-sm mb-1">País de destino</label>
                <select 
                    value={paisSeleccionado.codigo}
                    onChange={cambiarPais}
                    className="border p-2 rounded w-full bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                >
                    {PAISES.map((p) => (
                        <option key={p.codigo} value={p.codigo}>{p.nombre}</option>
                    ))}
                </select>
            </div>

            <form onSubmit={buscarEnMapa} className="flex gap-2 mb-2">
                <input 
                    type="text"
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder={`Ej: Calle, Carrera o Nomenclatura en ${paisSeleccionado.nombre}...`}
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <button 
                    type="submit"
                    disabled={cargando}
                    className="bg-amber-700 text-white px-4 py-2 rounded font-medium hover:bg-amber-800 transition whitespace-nowrap"
                >
                    {cargando ? 'Buscando...' : 'Ubicar'}
                </button>
            </form>

            {errorMapa && (
                <p className="text-red-500 text-xs mb-2 font-medium">{errorMapa}</p>
            )}

            <div className="h-72 w-full rounded-lg overflow-hidden border">
                <MapContainer center={position} zoom={6} style={{ height: '100%', width: '100%' }}>
                    <ActualizarCentro center={position} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                        <Popup>Destino seleccionado en {paisSeleccionado.nombre}</Popup>
                    </Marker>
                </MapContainer>
            </div>
            
            <p className="text-xs text-gray-500 mt-2 text-center">Filtro internacional estricto activo para evitar desvíos a otros países.</p>
        </div>
    );
}