import React, { useState, useEffect } from 'react';

export default function Reloj() {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setHora(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatoHora = hora.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const formatoFecha = hora.toLocaleDateString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="d-flex align-items-center gap-2 px-3 py-1 bg-light border rounded-pill shadow-sm">
      <span
        className="d-inline-block rounded-circle bg-success"
        style={{ width: '8px', height: '8px' }}
      ></span>
      <span className="text-muted small text-capitalize">{formatoFecha}</span>
      <span className="fw-bold font-monospace text-dark small">{formatoHora}</span>
    </div>
  );
}