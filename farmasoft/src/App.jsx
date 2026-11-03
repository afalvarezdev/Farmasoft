import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Clientes from "./pages/Clientes";
import Productos from "./pages/Productos";
import Ventas from "./pages/Ventas";
import Proveedores from "./pages/Proveedores";
import Compras from "./pages/Compras";
import Roles from "./pages/Roles";
import Reportes from "./pages/Reportes";
import DashboardLayout from "./layouts/DashboardLayout";

// Componente protector para validar si el usuario ha iniciado sesión
const RutaPrivada = ({ children }) => {
  const usuarioLogueado = localStorage.getItem('usuarioLogueado');
  // Si existe sesión, muestra el contenido (DashboardLayout con sus páginas). Si no, redirige al login.
  return usuarioLogueado ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. La raíz ahora muestra directamente la pantalla de Login */}
        <Route path="/" element={<Login />} />

        {/* Ruta alternativa por si llamas /login explícitamente */}
        <Route path="/login" element={<Login />} />

        {/* 2. Todas tus rutas del panel se mantienen exactamente igual, 
               pero envueltas de forma segura dentro de <RutaPrivada> */}
        <Route
          path="/clientes"
          element={
            <RutaPrivada>
              <DashboardLayout>
                <Clientes />
              </DashboardLayout>
            </RutaPrivada>
          }
        />
        <Route
          path="/productos"
          element={
            <RutaPrivada>
              <DashboardLayout>
                <Productos />
              </DashboardLayout>
            </RutaPrivada>
          }
        />
        <Route
          path="/ventas"
          element={
            <RutaPrivada>
              <DashboardLayout>
                <Ventas />
              </DashboardLayout>
            </RutaPrivada>
          }
        />
        <Route
          path="/proveedores"
          element={
            <RutaPrivada>
              <DashboardLayout>
                <Proveedores />
              </DashboardLayout>
            </RutaPrivada>
          }
        />
        <Route
          path="/compras"
          element={
            <RutaPrivada>
              <DashboardLayout>
                <Compras />
              </DashboardLayout>
            </RutaPrivada>
          }
        />
        <Route
          path="/informes"
          element={
            <RutaPrivada>
              <DashboardLayout>
                <Reportes />
              </DashboardLayout>
            </RutaPrivada>
          }
        />
        <Route
          path="/roles"
          element={
            <RutaPrivada>
              <DashboardLayout>
                <Roles />
              </DashboardLayout>
            </RutaPrivada>
          }
        />

        {/* Si escriben cualquier otra ruta que no exista, los regresa al Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;