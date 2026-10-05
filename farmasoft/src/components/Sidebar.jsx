import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar-bg text-white vh-100 p-3" style={{ width: "250px" }}>
      <div className="d-flex align-items-center justify-content-center mb-4 pt-2">
        <h4 className="fw-bold tracking-wide m-0 text-white">FARMASOFT</h4>
      </div>
      
      <ul className="nav nav-pills flex-column gap-2">
        <li className="nav-item">
          <NavLink 
            className={({ isActive }) => `nav-link sidebar-link ${isActive ? 'active' : ''}`} 
            to="/productos"
          >
            Inventario
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            className={({ isActive }) => `nav-link sidebar-link ${isActive ? 'active' : ''}`} 
            to="/ventas"
          >
            Ventas
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            className={({ isActive }) => `nav-link sidebar-link ${isActive ? 'active' : ''}`} 
            to="/clientes"
          >
            Clientes
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            className={({ isActive }) => `nav-link sidebar-link ${isActive ? 'active' : ''}`} 
            to="/proveedores"
          >
            Proveedores
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            className={({ isActive }) => `nav-link sidebar-link ${isActive ? 'active' : ''}`} 
            to="/compras"
          >
            Compras
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            className={({ isActive }) => `nav-link sidebar-link ${isActive ? 'active' : ''}`} 
            to="/reportes"
          >
            Reportes
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            className={({ isActive }) => `nav-link sidebar-link ${isActive ? 'active' : ''}`} 
            to="/usuarios"
          >
            Usuarios
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            className={({ isActive }) => `nav-link sidebar-link ${isActive ? 'active' : ''}`} 
            to="/roles"
          >
            Roles
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            className={({ isActive }) => `nav-link sidebar-link ${isActive ? 'active' : ''}`} 
            to="/configuracion"
          >
            Configuración
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;