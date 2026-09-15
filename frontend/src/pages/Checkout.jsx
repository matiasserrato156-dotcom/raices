import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapaEnvio from '../components/MapaEnvio';

export default function Checkout() {
    const navigate = useNavigate();
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [paisDestino, setPaisDestino] = useState('Colombia');
    const [error, setError] = useState('');

    const validarYComprar = (e) => {
        e.preventDefault();

        // Validación estricta para evitar texto aleatorio o basura en la dirección
        if (!direccion || direccion.trim().length < 8 || !/\d/.test(direccion)) {
            setError('Por favor, ingresa o selecciona una dirección válida en el mapa (que incluya nomenclatura).');
            return;
        }

        // Validación básica para el teléfono
        if (!telefono || telefono.trim().length < 7) {
            setError('Por favor, ingresa un número de teléfono válido.');
            return;
        }

        setError('');

        // Simulación de guardado de pedido o llamada a tu API de Laravel
        console.log('Compra procesada con éxito:', { direccion, telefono, paisDestino });
        alert('¡Pedido realizado con éxito!');
        navigate('/productos');
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg my-8">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Finalizar Compra</h2>
            
            {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={validarYComprar} className="flex flex-col gap-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Dirección de entrega</label>
                    <input 
                        type="text"
                        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50"
                        placeholder="Se autocompletará con el mapa o puedes escribirla"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">Usa el mapa de abajo para buscar y fijar la dirección exacta.</p>
                </div>

                {/* Integración del mapa internacional con selector de país */}
                <MapaEnvio 
                    direccionInicial={direccion}
                    onUbicacionSeleccionada={(datos) => {
                        setDireccion(datos.direccion);
                        if (datos.pais) setPaisDestino(datos.pais);
                    }}
                />

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Teléfono de contacto</label>
                    <input 
                        type="tel"
                        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Ej: 3001478983"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                    />
                </div>

                <button 
                    type="submit"
                    className="bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-800 transition mt-2 shadow-sm"
                >
                    Confirmar y Pagar Contra Entrega
                </button>
            </form>
        </div>
    );
}