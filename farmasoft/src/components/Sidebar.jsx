import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="bg-dark text-white vh-100 p-3" style={{ width: "250px" }}>
      <h4 className="text-center mb-4">Mini ERP</h4>
      <ul className="nav nav-pills flex-column gap-2">
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/clientes">
            Clientes
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/productos">
            Productos
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/ventas">
            Ventas
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;