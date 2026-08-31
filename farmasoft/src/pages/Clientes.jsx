import React, { useEffect, useState } from 'react';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estado del formulario
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre_completo: '',
    telefono: '',
    direccion: ''
  });

  const cargarClientes = () => {
    setCargando(true);
    fetch('http://localhost/farmasoft/backend/clientes/listar.php')
      .then((res) => res.json())
      .then((datos) => {
        if (Array.isArray(datos)) setClientes(datos);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleChange = (e) => {
    setNuevoCliente({
      ...nuevoCliente,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevoCliente.nombre_completo) return alert("Ingresa el nombre");

    fetch('http://localhost/farmasoft/backend/clientes/crear.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoCliente)
    })
      .then((res) => res.json())
      .then(() => {
        setNuevoCliente({ nombre_completo: '', telefono: '', direccion: '' });
        cargarClientes();
      })
      .catch((err) => console.error(err));
  };

  const handleEliminar = (id) => {
    if (!window.confirm("¿Deseas eliminar este cliente?")) return;

    fetch('http://localhost/farmasoft/backend/clientes/eliminar.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_cliente: id })
    })
      .then((res) => res.json())
      .then(() => cargarClientes())
      .catch((err) => console.error(err));
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Clientes</h2>

      {/* Formulario */}
      <div className="card my-4 p-3 shadow-sm">
        <h5>Agregar Nuevo Cliente</h5>
        <form onSubmit={handleSubmit} className="row g-3 mt-1">
          <div className="col-md-4">
            <input
              type="text"
              name="nombre_completo"
              className="form-control"
              placeholder="Nombre Completo"
              value={nuevoCliente.nombre_completo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="telefono"
              className="form-control"
              placeholder="Teléfono"
              value={nuevoCliente.telefono}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="direccion"
              className="form-control"
              placeholder="Dirección"
              value={nuevoCliente.direccion}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">Guardar</button>
          </div>
        </form>
      </div>

      {/* Tabla */}
      {cargando ? (
        <p>Cargando información...</p>
      ) : (
        <table className="table table-bordered table-striped mt-3 align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length > 0 ? (
              clientes.map((cli) => (
                <tr key={cli.id_cliente}>
                  <td>{cli.id_cliente}</td>
                  <td>{cli.nombre_completo}</td>
                  <td>{cli.telefono}</td>
                  <td>{cli.direccion || 'N/A'}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEliminar(cli.id_cliente)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No hay clientes registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Clientes;