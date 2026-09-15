import React, { useState } from "react";
import { validarCorreo } from "../utils/validaciones";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validarCorreo(email)) {
      alert("El formato del correo electrónico no es válido.");
      return;
    }
    alert("Inicio de sesión validado correctamente.");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-sm" style={{ width: "380px" }}>
        <div className="text-center mb-4">
          <img src="https://i.imgur.com/3Z66p93.png" alt="Raíces Logo" style={{ width: "110px", height: "auto" }} />
          <h3 className="mt-2 fw-bold text-success">Raíces</h3>
          <p className="text-muted small">Conecta • Descubre • Aprende</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input type="text" className="form-control" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-success w-100">Ingresar</button>
        </form>
      </div>
    </div>
  );
}
