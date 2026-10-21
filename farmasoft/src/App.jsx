import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Clientes from "./pages/Clientes";
import Productos from "./pages/Productos";
import Ventas from "./pages/Ventas";
import Proveedores from "./pages/Proveedores";
import Compras from "./pages/Compras";
import Roles from "./pages/Roles";
import Reportes from "./pages/Reportes"; // <--- 1. Importamos el componente de reportes/informes
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Al entrar a la raíz, redirige automáticamente a /productos */}
        <Route path="/" element={<Navigate to="/productos" replace />} />

        {/* Ruta opcional de Login */}
        <Route path="/login" element={<Login />} />

        <Route
          path="/clientes"
          element={
            <DashboardLayout>
              <Clientes />
            </DashboardLayout>
          }
        />
        <Route
          path="/productos"
          element={
            <DashboardLayout>
              <Productos />
            </DashboardLayout>
          }
        />
        <Route
          path="/ventas"
          element={
            <DashboardLayout>
              <Ventas />
            </DashboardLayout>
          }
        />
        <Route
          path="/proveedores"
          element={
            <DashboardLayout>
              <Proveedores />
            </DashboardLayout>
          }
        />
        <Route
          path="/compras"
          element={
            <DashboardLayout>
              <Compras />
            </DashboardLayout>
          }
        />
        {/* 2. Agregamos la ruta para los Informes */}
        <Route
          path="/informes"
          element={
            <DashboardLayout>
              <Reportes />
            </DashboardLayout>
          }
        />
        <Route
          path="/roles"
          element={
            <DashboardLayout>
              <Roles />
            </DashboardLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;