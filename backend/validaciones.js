export const validarCorreo = (e) => /^[^s@]+@[^s@]+.[^s@]+$/.test(e);
export const validarDireccion = (d) => d && d.trim().length >= 6 && /\d/.test(d);
