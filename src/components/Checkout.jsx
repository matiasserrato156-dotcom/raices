import React, { useState } from "react";
import { validarCorreo, validarDireccion } from "../utils/validaciones";

export default function Checkout() {
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarCorreo(email)) {
      alert("Error: Ingresa un correo electrónico válido.");
      return;
    }
    if (!validarDireccion(direccion)) {
      alert("Error: Introduce una dirección de envío válida (incluyendo calle y número).");
      return;
    }
    alert("¡Pedido procesado con éxito!");
  };

  return (
    <div className="container py-5" style={{ maxWidth: "500px" }}>
      <h3 className="mb-4">Finalizar Compra</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Correo de contacto</label>
          <input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ejemplo@correo.com" />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección de envío</label>
          <input type="text" className="form-control" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Calle 10 # 15-20" />
        </div>
        <button type="submit" className="btn btn-primary w-100">Confirmar Pedido</button>
      </form>
    </div>
  );
}
