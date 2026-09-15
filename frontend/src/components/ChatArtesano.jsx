import { useState } from 'react';

export default function ChatArtesano({ productoId, artesanoNombre }) {
    const [mensaje, setMensaje] = useState('');
    const [enviado, setEnviado] = useState(false);

    const enviarMensaje = (e) => {
        e.preventDefault();
        console.log(`Enviando consulta sobre el producto ID ${productoId}: ${mensaje}`);
        setEnviado(true);
        setMensaje('');
    };

    return (
        <div className="p-4 border rounded-lg bg-white shadow-sm mt-6">
            <h4 className="font-bold text-lg mb-2">¿Tienes dudas sobre esta pieza?</h4>
            <p className="text-gray-600 text-sm mb-3">Chatea directamente con {artesanoNombre || 'el artesano'} si vas a comprar o si quieres saber más de su historia.</p>
            {enviado ? (
                <div className="bg-green-50 text-green-700 p-3 rounded font-medium">
                    ¡Mensaje enviado con éxito! El creador te responderá pronto.
                </div>
            ) : (
                <form onSubmit={enviarMensaje} className="flex flex-col gap-2">
                    <textarea
                        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                        rows="3"
                        placeholder="Escribe tu consulta aquí..."
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        required
                    />
                    <button 
                        type="submit" 
                        className="bg-amber-700 text-white px-4 py-2 rounded font-medium hover:bg-amber-800 transition"
                    >
                        Enviar mensaje al creador
                    </button>
                </form>
            )}
        </div>
    );
}