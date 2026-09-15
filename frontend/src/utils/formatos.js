// Oculta el teléfono dejando solo los primeros 3 y últimos 2 dígitos (Ej: 300****56)
export const enmascararTelefono = (tel) => {
  if (!tel || tel.length < 6) return "******";
  const str = String(tel);
  return `${str.slice(0, 3)}****${str.slice(-2)}`;
};

// Oculta el documento de identidad (Ej: 1045***789)
export const enmascararDocumento = (doc) => {
  if (!doc || doc.length < 5) return "***-***";
  const str = String(doc);
  return `${str.slice(0, 3)}****${str.slice(-3)}`;
};

// Oculta tarjetas bancarias (Ej: **** **** **** 4321)
export const enmascararTarjeta = (num) => {
  if (!num || num.length < 4) return "**** **** **** ****";
  const str = String(num).replace(/\s+/g, "");
  return `**** **** **** ${str.slice(-4)}`;
};