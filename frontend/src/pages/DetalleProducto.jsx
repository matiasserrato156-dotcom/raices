import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatArtesano from '../components/ChatArtesano';

export default function DetalleProducto() {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        // Aquí puedes conectar tu API de Laravel cuando esté lista (ej: axios.get(`http://127.0.0.1:8000/api/productos/${id}`))
        // De momento simulamos la carga de la pieza o vitrina cultural
        setProducto({
            id: id || 1,
            nombre: "Artesanía Tradicional",
            descripcion: "Pieza única elaborada a mano con técnicas ancestrales de nuestra región.",
            precio: "85.000",
            artesano: "Maestro Creador"
        });
        setCargando(false);
    }, [id]);

    if (cargando) return <div className="p-6 text-center">Cargando detalles...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-2">{producto.nombre}</h1>
            <p className="text-gray-700 mb-4">{producto.descripcion}</p>
            <div className="text-2xl font-semibold text-gray-900 mb-6">${producto.precio} COP</div>

            <button className="bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-800 transition mr-4">
                Comprar ahora
            </button>

            {/* Conversatorio integrado para compradores y curiosos de paso */}
            <ChatArtesano 
                productoId={producto.id} 
                artesanoNombre={producto.artesano} 
            />
        </div>
    );
}