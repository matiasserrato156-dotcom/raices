```jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Productos() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Estados de búsqueda y filtros
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [soloConStock, setSoloConStock] = useState(false);
  const [precioMaximo, setPrecioMaximo] = useState(2000000);
  const [orden, setOrden] = useState("recientes");
  const [mensajeCarrito, setMensajeCarrito] = useState("");
  const [carritoIds, setCarritoIds] = useState({});

  // =========================================================
  // USUARIO ACTUAL
  // =========================================================

  const obtenerUsuario = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  };

  const usuarioActual = obtenerUsuario();

  const puedeAgregarProductos =
    usuarioActual?.role === "admin" ||
    usuarioActual?.role === "artesano" ||
    usuarioActual?.role === "emprendedor";

  // =========================================================
  // CARRITO
  // =========================================================

  const actualizarEstadoCarritoLocal = () => {
    try {
      const items = JSON.parse(localStorage.getItem("carrito") || "[]");

      const conteo = {};

      items.forEach((it) => {
        conteo[it.id] =
          (conteo[it.id] || 0) + Number(it.cantidad || 1);
      });

      setCarritoIds(conteo);
    } catch {
      setCarritoIds({});
    }
  };

  // =========================================================
  // CARGAR PRODUCTOS
  // =========================================================

  const cargarProductos = async () => {
    setCargando(true);
    setError("");

    try {
      const res = await api.get("/productos");

      const lista = Array.isArray(res.data)
        ? res.data
        : res.data?.productos ||
          res.data?.data ||
          [];

      setProductos(lista);
    } catch (err) {
      console.error("Error al cargar artesanías:", err);

      setError(
        "No fue posible cargar el catálogo de artesanías en este momento."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
    actualizarEstadoCarritoLocal();

    const handleStorageChange = () => {
      actualizarEstadoCarritoLocal();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  // =========================================================
  // FORMATO DE PRECIO
  // =========================================================

  const formatoPrecio = (precio) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(Number(precio || 0));

  // =========================================================
  // AGREGAR AL CARRITO
  // =========================================================

  const handleAgregarAlCarrito = (producto) => {
    const stockDisponible = Number(
      producto.stock || 0
    );

    if (stockDisponible <= 0) {
      alert(
        "Esta pieza artesanal no tiene existencias disponibles."
      );

      return;
    }

    try {
      const carritoActual = JSON.parse(
        localStorage.getItem("carrito") || "[]"
      );

      const index = carritoActual.findIndex(
        (i) => i.id === producto.id
      );

      if (index !== -1) {
        if (
          carritoActual[index].cantidad >=
          stockDisponible
        ) {
          alert(
            `Has alcanzado el límite máximo disponible (${stockDisponible} unidades) para esta pieza.`
          );

          return;
        }

        carritoActual[index].cantidad += 1;
      } else {
        carritoActual.push({
          id: producto.id,
          nombre: producto.nombre,
          precio: Number(producto.precio),
          imagen:
            producto.imagen ||
            producto.imagen_url,
          stock: stockDisponible,
          cantidad: 1,
        });
      }

      localStorage.setItem(
        "carrito",
        JSON.stringify(carritoActual)
      );

      actualizarEstadoCarritoLocal();

      window.dispatchEvent(
        new Event("storage")
      );

      setMensajeCarrito(
        `"${producto.nombre}" se agregó al carrito.`
      );

      setTimeout(() => {
        setMensajeCarrito("");
      }, 3500);
    } catch (err) {
      console.error(
        "Error guardando en el carrito:",
        err
      );
    }
  };

  // =========================================================
  // CATEGORÍAS
  // =========================================================

  const categoriasDisponibles = [
    "todas",
    ...new Set(
      productos
        .map(
          (p) =>
            p.categoria?.nombre ||
            p.categoria
        )
        .filter(Boolean)
    ),
  ];

  // =========================================================
  // FILTRADO
  // =========================================================

  const productosFiltrados = productos
    .filter((prod) => {
      const q = busqueda
        .toLowerCase()
        .trim();

      cons
```
