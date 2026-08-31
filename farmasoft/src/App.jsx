import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Clientes from "./pages/Clientes";
import Productos from "./pages/Productos";
import Ventas from "./pages/Ventas";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Al entrar a la raíz (http://localhost:5173), redirige automáticamente a /productos */}
        <Route path="/" element={<Navigate to="/productos" replace />} />

        {/* Ruta opcional de Login si deseas mantenerla disponible en /login */}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;