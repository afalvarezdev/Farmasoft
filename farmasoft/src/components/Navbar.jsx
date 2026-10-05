function Navbar() {
  return (
    <nav className="navbar navbar-light px-4 border-bottom navbar-farmasoft sticky-top d-flex justify-content-between align-items-center">
      <div className="navbar-title fs-5">
        Panel Administrativo
      </div>
      <button className="btn btn-sm btn-logout-custom d-flex align-items-center gap-2">
        Cerrar sesión
      </button>
    </nav>
  );
}

export default Navbar;