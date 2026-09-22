import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import MainLayout from "./layouts/MainLayout";

import Inicio from "./pages/Inicio/inicio";
import Intro from "./pages/Inicio/Intro";
import Login from "./pages/Auth/Login";
import Registro from "./pages/Auth/Registro";
import ProductosPage from "./pages/Productos/Productos";
import DetalleProducto from "./pages/Productos/DetalleProducto";
import Carrito from "./pages/Carrito/Carrito";
import Favoritos from "./pages/Favoritos/Favoritos";
import Checkout from "./pages/Checkout/Checkout";
import Pedidos from "./pages/Pedidos/Pedidos";
import PedidoDetalle from "./pages/PedidoDetalle/PedidoDetalle";
import RecuperarPassword from "./pages/Auth/RecuperarPassword";
import Perfil from "./pages/Perfil/Perfil";
import Experiencias from "./pages/Experiencias/Experiencias";
import Mapa from "./pages/Mapa/Mapa";
import RutaEntrega from "./pages/Mapa/RutaEntrega";
import PerfilArtesano from "./pages/Artesanos/PerfilArtesano";
import Videos from "./pages/Videos";

import AdminDashboard from "./pages/Administrador/AdminDashboard";
import AdminPedidos from "./pages/Administrador/AdminPedidos";
import AdminPedidoDetalle from "./pages/Administrador/AdminPedidoDetalle";
import AdminProductos from "./pages/Administrador/AdminProductos";

function RecuperarPasswordInicio() {
  return <RecuperarPassword />;
}

function obtenerUsuario() {
  try {
    const usuario = localStorage.getItem("user");
    return usuario ? JSON.parse(usuario) : null;
  } catch {
    return null;
  }
}

function RutaProtegida({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function RutaLogin({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/inicio" replace />;
  }

  return children;
}

// CORREGIDO: Ahora permite el acceso a admin, emprendedor y artesano
function RutaAdmin({ children }) {
  const token = localStorage.getItem("token");
  const user = obtenerUsuario();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const rol = user?.role;
  if (rol !== "admin" && rol !== "emprendedor" && rol !== "artesano") {
    return <Navigate to="/inicio" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PANTALLA DE INTRO / BIENVENIDA AISLADA (RUTA RAÍZ) */}
        <Route path="/" element={<Intro />} />
        <Route path="/intro" element={<Intro />} />

        {/* AUTENTICACIÓN LIBRE */}
        <Route
          path="/login"
          element={
            <RutaLogin>
              <Login />
            </RutaLogin>
          }
        />

        <Route
          path="/registro"
          element={
            <RutaLogin>
              <Registro />
            </RutaLogin>
          }
        />

        <Route
          path="/recuperar-password"
          element={
            <RutaLogin>
              <RecuperarPasswordInicio />
            </RutaLogin>
          }
        />

        <Route
          path="/reset-password/:token"
          element={<RecuperarPassword />}
        />

        {/* RESTO DE LA APLICACIÓN DENTRO DEL MAINLAYOUT */}
        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                <Route
                  path="/inicio"
                  element={
                    <RutaProtegida>
                      <Inicio />
                    </RutaProtegida>
                  }
                />

                <Route
                  path="/perfil"
                  element={
                    <RutaProtegida>
                      <Perfil />
                    </RutaProtegida>
                  }
                />

                <Route
                  path="/productos"
                  element={
                    <RutaProtegida>
                      <ProductosPage />
                    </RutaProtegida>
                  }
                />

                <Route
                  path="/productos/:id"
                  element={
                    <RutaProtegida>
                      <DetalleProducto />
                    </RutaProtegida>
                  }
                />

                <Route
                  path="/producto/:id"
                  element={
                    <RutaProtegida>
                      <DetalleProducto />
                    </RutaProtegida>
                  }
                />

                <Route
                  path="/carrito"
                  element={
                    <RutaProtegida>
                      <Carrito />
                    </RutaProtegida>
                  }
                />

                <Route
                  path="/favoritos"
                  element={
                    <RutaProtegida>
                      <Favoritos />
                    </RutaProtegida>
                  }
                />

                <Route
                  path="/checkout"
                  element={
                    <RutaProtegida>
                      <Checkout />
                    </RutaProtegida>
                  }
                />

                <Route
                  path="/pedidos"
                  element={
                    <RutaProtegida>
                      <Pedidos />
                    </RutaProtegida>
                  }
                />

                <Route
                  path="/pedidos/:id"
                  element={
                    <RutaProtegida>
                      <PedidoDetalle />
                    </RutaProtegida>
                  }
                />

                <Route
                  path="/videos"
                  element={
                    <RutaProtegida>
                      <Videos />
                    </RutaProtegida>
                  }
                />

                <Route
                  path="/experiencias"
                  element={
                    <RutaProtegida>
                      <Experiencias />
                    </RutaProtegida>
                  }
                />

                <Route
                  path="/mapa"
                  element={
                    <RutaProtegida>
                      <Mapa />
                    </RutaProtegida>
                  }
                />

                <Route
                  path="/guia-ruta"
                  element={
                    <RutaProtegida>
                      <RutaEntrega />
                    </RutaProtegida>
                  }
                />

                <Route
                  path="/artesano/:id"
                  element={
                    <RutaProtegida>
                      <PerfilArtesano />
                    </RutaProtegida>
                  }
                />

                {/* MÓDULO ADMINISTRADOR / GESTIÓN DE PRODUCTOS */}
                <Route
                  path="/admin"
                  element={
                    <RutaAdmin>
                      <AdminDashboard />
                    </RutaAdmin>
                  }
                />

                <Route
                  path="/admin/dashboard"
                  element={
                    <RutaAdmin>
                      <AdminDashboard />
                    </RutaAdmin>
                  }
                />

                <Route
                  path="/admin/productos"
                  element={
                    <RutaAdmin>
                      <AdminProductos />
                    </RutaAdmin>
                  }
                />

                <Route
                  path="/admin/pedidos"
                  element={
                    <RutaAdmin>
                      <AdminPedidos />
                    </RutaAdmin>
                  }
                />

                <Route
                  path="/admin/pedidos/:id"
                  element={
                    <RutaAdmin>
                      <AdminPedidoDetalle />
                    </RutaAdmin>
                  }
                />

                {/* REDIRECCIÓN POR DEFECTO */}
                <Route
                  path="*"
                  element={<Navigate to="/inicio" replace />}
                />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;