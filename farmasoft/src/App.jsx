import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Clientes from "./pages/Clientes";
import Productos from "./pages/Productos";
import Ventas from "./pages/Ventas";
import Proveedores from "./pages/Proveedores";
import Compras from "./pages/Compras"; // <-- 1. Todos los imports arriba
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

        {/* 2. La ruta de compras DENTRO de <Routes> */}
        <Route
          path="/compras"
          element={
            <DashboardLayout>
              <Compras />
            </DashboardLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;