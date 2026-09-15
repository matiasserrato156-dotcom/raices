import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../services/api";

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    try {
      const guardado = localStorage.getItem("carrito");

      if (!guardado) {
        return [];
      }

      const datos = JSON.parse(guardado);

      if (!Array.isArray(datos)) {
        return [];
      }

      return datos
        .map((item) => {
          const productoId = Number(
            item?.producto_id ?? item?.id
          );

          const cantidad = Number(
            item?.cantidad ?? 0
          );

          const precio = Number(
            item?.precio ??
              item?.price ??
              item?.producto?.precio ??
              0
          );

          return {
            ...item,
            id: productoId,
            producto_id: productoId,
            cantidad,
            precio,
          };
        })
        .filter(
          (item) =>
            Number.isInteger(item.producto_id) &&
            item.producto_id > 0 &&
            Number.isInteger(item.cantidad) &&
            item.cantidad > 0
        );
    } catch (error) {
      console.error(
        "ERROR LEYENDO CARRITO:",
        error
      );

      return [];
    }
  });

  const [
    procesandoPedido,
    setProcesandoPedido,
  ] = useState(false);

  const [
    errorPedido,
    setErrorPedido,
  ] = useState("");

  /*
  |--------------------------------------------------------------------------
  | GUARDAR CARRITO
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    try {
      localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
      );
    } catch (error) {
      console.error(
        "ERROR GUARDANDO CARRITO:",
        error
      );
    }
  }, [carrito]);

  /*
  |--------------------------------------------------------------------------
  | AGREGAR AL CARRITO
  |--------------------------------------------------------------------------
  */

  const agregarAlCarrito = (
    producto,
    cantidad = 1
  ) => {
    if (!producto) {
      console.error(
        "No se recibió ningún producto."
      );

      return;
    }

    const productoId = Number(
      producto?.producto_id ?? producto?.id
    );

    const cantidadNumerica = Number(
      cantidad
    );

    if (
      !Number.isInteger(productoId) ||
      productoId <= 0
    ) {
      console.error(
        "PRODUCTO SIN ID VÁLIDO:",
        producto
      );

      return;
    }

    if (
      !Number.isInteger(
        cantidadNumerica
      ) ||
      cantidadNumerica <= 0
    ) {
      return;
    }

    setCarrito((actual) => {
      const existe = actual.find(
        (item) =>
          Number(
            item?.producto_id ?? item?.id
          ) === productoId
      );

      if (existe) {
        return actual.map((item) => {
          const itemId = Number(
            item?.producto_id ?? item?.id
          );

          if (itemId !== productoId) {
            return item;
          }

          return {
            ...item,
            id: productoId,
            producto_id: productoId,
            cantidad:
              Number(item?.cantidad ?? 0) +
              cantidadNumerica,
            precio: Number(
              item?.precio ??
                item?.price ??
                producto?.precio ??
                producto?.price ??
                0
            ),
          };
        });
      }

      return [
        ...actual,
        {
          ...producto,
          id: productoId,
          producto_id: productoId,
          cantidad: cantidadNumerica,
          precio: Number(
            producto?.precio ??
              producto?.price ??
              0
          ),
        },
      ];
    });
  };

  /*
  |--------------------------------------------------------------------------
  | ELIMINAR PRODUCTO
  |--------------------------------------------------------------------------
  */

  const eliminarDelCarrito = (
    productoId
  ) => {
    const id = Number(productoId);

    if (!Number.isInteger(id)) {
      return;
    }

    setCarrito((actual) =>
      actual.filter(
        (item) =>
          Number(
            item?.producto_id ?? item?.id
          ) !== id
      )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | CAMBIAR CANTIDAD
  |--------------------------------------------------------------------------
  */

  const cambiarCantidad = (
    productoId,
    nuevaCantidad
  ) => {
    const id = Number(productoId);
    const cantidad = Number(
      nuevaCantidad
    );

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return;
    }

    if (
      !Number.isFinite(cantidad) ||
      cantidad <= 0
    ) {
      eliminarDelCarrito(id);
      return;
    }

    setCarrito((actual) =>
      actual.map((item) => {
        const itemId = Number(
          item?.producto_id ?? item?.id
        );

        if (itemId !== id) {
          return item;
        }

        return {
          ...item,
          id,
          producto_id: id,
          cantidad,
        };
      })
    );
  };

  /*
  |--------------------------------------------------------------------------
  | VACIAR CARRITO
  |--------------------------------------------------------------------------
  */

  const vaciarCarrito = () => {
    setCarrito([]);

    try {
      localStorage.removeItem(
        "carrito"
      );
    } catch (error) {
      console.error(
        "ERROR ELIMINANDO CARRITO:",
        error
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | TOTAL DEL CARRITO
  |--------------------------------------------------------------------------
  */

  const totalCarrito = useMemo(() => {
    return carrito.reduce(
      (total, item) => {
        const precio = Number(
          item?.precio ??
            item?.price ??
            0
        );

        const cantidad = Number(
          item?.cantidad ?? 0
        );

        if (
          !Number.isFinite(precio) ||
          !Number.isFinite(cantidad)
        ) {
          return total;
        }

        return (
          total +
          precio * cantidad
        );
      },
      0
    );
  }, [carrito]);

  /*
  |--------------------------------------------------------------------------
  | CANTIDAD TOTAL DE PRODUCTOS
  |--------------------------------------------------------------------------
  */

  const cantidadCarrito = useMemo(() => {
    return carrito.reduce(
      (total, item) => {
        const cantidad = Number(
          item?.cantidad ?? 0
        );

        if (
          !Number.isFinite(cantidad)
        ) {
          return total;
        }

        return total + cantidad;
      },
      0
    );
  }, [carrito]);

  /*
  |--------------------------------------------------------------------------
  | CREAR PEDIDO
  |--------------------------------------------------------------------------
  */

  const crearPedido = async ({
    direccion = "",
    observaciones = "",
    telefono = "",
    ubicacion = null,
    metodoPago = "contraentrega",
    referenciaPago = "",
    comprobantePago = null,
  } = {}) => {
    if (procesandoPedido) {
      throw new Error(
        "Ya se está procesando el pedido."
      );
    }

    setProcesandoPedido(true);
    setErrorPedido("");

    try {
      /*
      |--------------------------------------------------------------------------
      | VALIDAR CARRITO
      |--------------------------------------------------------------------------
      */

      if (
        !Array.isArray(carrito) ||
        carrito.length === 0
      ) {
        throw new Error(
          "La canasta está vacía."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | VALIDAR DIRECCIÓN
      |--------------------------------------------------------------------------
      */

      const direccionLimpia =
        String(direccion ?? "").trim();

      if (!direccionLimpia) {
        throw new Error(
          "Debes ingresar una dirección de entrega."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | VALIDAR TELÉFONO
      |--------------------------------------------------------------------------
      */

      const telefonoLimpio =
        String(telefono ?? "").trim();

      if (!telefonoLimpio) {
        throw new Error(
          "Debes ingresar un número de teléfono."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | VALIDAR MÉTODO DE PAGO
      |--------------------------------------------------------------------------
      */

      const metodosPermitidos = [
        "contraentrega",
        "nequi",
        "bancolombia",
      ];

      if (
        !metodosPermitidos.includes(
          metodoPago
        )
      ) {
        throw new Error(
          "El método de pago seleccionado no es válido."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | PREPARAR PRODUCTOS
      |--------------------------------------------------------------------------
      */

      const productos = carrito.map(
        (item) => ({
          producto_id: Number(
            item?.producto_id ?? item?.id
          ),
          cantidad: Number(
            item?.cantidad
          ),
        })
      );

      const productosInvalidos =
        productos.some(
          (item) =>
            !Number.isInteger(
              item.producto_id
            ) ||
            item.producto_id <= 0 ||
            !Number.isInteger(
              item.cantidad
            ) ||
            item.cantidad <= 0
        );

      if (productosInvalidos) {
        throw new Error(
          "Uno de los productos de la canasta tiene un ID o cantidad inválida."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | FORM DATA
      |--------------------------------------------------------------------------
      */

      const formData = new FormData();

      formData.append(
        "direccion",
        direccionLimpia
      );

      formData.append(
        "telefono",
        telefonoLimpio
      );

      formData.append(
        "metodo_pago",
        metodoPago
      );

      if (
        String(
          observaciones ?? ""
        ).trim()
      ) {
        formData.append(
          "observaciones",
          String(
            observaciones
          ).trim()
        );
      }

      if (
        String(
          referenciaPago ?? ""
        ).trim()
      ) {
        formData.append(
          "referencia_pago",
          String(
            referenciaPago
          ).trim()
        );
      }

      /*
      |--------------------------------------------------------------------------
      | UBICACIÓN
      |--------------------------------------------------------------------------
      */

      if (
        ubicacion &&
        Number.isFinite(
          Number(
            ubicacion.latitud
          )
        ) &&
        Number.isFinite(
          Number(
            ubicacion.longitud
          )
        )
      ) {
        formData.append(
          "latitud",
          String(
            ubicacion.latitud
          )
        );

        formData.append(
          "longitud",
          String(
            ubicacion.longitud
          )
        );
      }

      /*
      |--------------------------------------------------------------------------
      | PRODUCTOS EN FORM DATA
      |--------------------------------------------------------------------------
      */

      productos.forEach(
        (producto, index) => {
          formData.append(
            `productos[${index}][producto_id]`,
            String(
              producto.producto_id
            )
          );

          formData.append(
            `productos[${index}][cantidad]`,
            String(
              producto.cantidad
            )
          );
        }
      );

      /*
      |--------------------------------------------------------------------------
      | COMPROBANTE DE PAGO
      |--------------------------------------------------------------------------
      */

      if (
        typeof File !==
          "undefined" &&
        comprobantePago instanceof File
      ) {
        formData.append(
          "comprobante_pago",
          comprobantePago
        );
      }

      /*
      |--------------------------------------------------------------------------
      | DEBUG
      |--------------------------------------------------------------------------
      */

      console.log(
        "CREANDO PEDIDO:",
        {
          productos,
          direccion:
            direccionLimpia,
          telefono:
            telefonoLimpio,
          metodoPago,
          referenciaPago,
          ubicacion,
          comprobante:
            comprobantePago?.name ??
            null,
        }
      );

      /*
      |--------------------------------------------------------------------------
      | ENVIAR AL BACKEND
      |--------------------------------------------------------------------------
      */

      const response =
        await api.post(
          "/pedidos",
          formData
        );

      console.log(
        "RESPUESTA DEL SERVIDOR:",
        response.data
      );

      /*
      |--------------------------------------------------------------------------
      | OBTENER PEDIDO
      |--------------------------------------------------------------------------
      */

      const pedido =
        response.data?.pedido ??
        response.data;

      /*
      |--------------------------------------------------------------------------
      | LIMPIAR CARRITO
      |--------------------------------------------------------------------------
      */

      setCarrito([]);

      localStorage.removeItem(
        "carrito"
      );

      return pedido;
    } catch (error) {
      console.error(
        "========== ERROR AL CREAR PEDIDO =========="
      );

      console.error(
        "ERROR:",
        error
      );

      console.error(
        "STATUS:",
        error?.response?.status
      );

      console.error(
        "DATA:",
        error?.response?.data
      );

      let mensaje =
        "No se pudo crear el pedido.";

      /*
      |--------------------------------------------------------------------------
      | ERROR 401
      |--------------------------------------------------------------------------
      */

      if (
        error?.response?.status ===
        401
      ) {
        mensaje =
          "Tu sesión expiró. Inicia sesión nuevamente.";
      }

      /*
      |--------------------------------------------------------------------------
      | ERROR 403
      |--------------------------------------------------------------------------
      */

      else if (
        error?.response?.status ===
        403
      ) {
        mensaje =
          "No tienes permisos para realizar esta operación.";
      }

      /*
      |--------------------------------------------------------------------------
      | ERROR 404
      |--------------------------------------------------------------------------
      */

      else if (
        error?.response?.status ===
        404
      ) {
        mensaje =
          "Uno de los productos ya no está disponible.";
      }

      /*
      |--------------------------------------------------------------------------
      | ERROR 422
      |--------------------------------------------------------------------------
      */

      else if (
        error?.response?.status ===
        422
      ) {
        const errores =
          error.response.data
            ?.errors;

        if (
          errores &&
          typeof errores ===
            "object"
        ) {
          const mensajes =
            Object.values(
              errores
            )
              .flat()
              .filter(Boolean);

          if (
            mensajes.length > 0
          ) {
            mensaje =
              mensajes.join(" ");
          } else {
            mensaje =
              error.response.data
                ?.message ||
              "Los datos del pedido no son válidos.";
          }
        } else {
          mensaje =
            error.response.data
              ?.message ||
            "Los datos del pedido no son válidos.";
        }
      }

      /*
      |--------------------------------------------------------------------------
      | ERROR 500
      |--------------------------------------------------------------------------
      */

      else if (
        error?.response?.status >=
        500
      ) {
        mensaje =
          "El servidor tuvo un problema al crear el pedido.";
      }

      /*
      |--------------------------------------------------------------------------
      | ERROR LOCAL
      |--------------------------------------------------------------------------
      */

      else if (
        error?.message
      ) {
        mensaje =
          error.message;
      }

      setErrorPedido(
        mensaje
      );

      throw new Error(
        mensaje
      );
    } finally {
      setProcesandoPedido(
        false
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | CONTEXTO
  |--------------------------------------------------------------------------
  */

  const value = {
    carrito,

    totalCarrito,

    cantidadCarrito,

    // Compatibilidad con componentes
    // que utilizan cantidadTotal.
    cantidadTotal:
      cantidadCarrito,

    agregarAlCarrito,

    eliminarDelCarrito,

    cambiarCantidad,

    vaciarCarrito,

    crearPedido,

    procesandoPedido,

    errorPedido,
  };

  return (
    <CarritoContext.Provider
      value={value}
    >
      {children}
    </CarritoContext.Provider>
  );
}

/*
|--------------------------------------------------------------------------
| HOOK
|--------------------------------------------------------------------------
*/

export function useCarrito() {
  const contexto =
    useContext(
      CarritoContext
    );

  if (!contexto) {
    throw new Error(
      "useCarrito debe utilizarse dentro de CarritoProvider"
    );
  }

  return contexto;
}

export default CarritoContext;