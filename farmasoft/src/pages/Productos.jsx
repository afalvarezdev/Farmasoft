import React, { useEffect, useState } from 'react';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [nuevoProducto, setNuevoProducto] = useState({
    codigo_producto: '',
    nombre: '',
    porcentaje_venta: '',
    marca: '',
    peso: ''
  });

  const cargarProductos = () => {
    setCargando(true);
    fetch('http://localhost/farmasoft/backend/productos/listar.php')
      .then((res) => res.json())
      .then((datos) => {
        if (Array.isArray(datos)) setProductos(datos);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleChange = (e) => {
    setNuevoProducto({
      ...nuevoProducto,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost/farmasoft/backend/productos/crear.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProducto)
    })
      .then((res) => res.json())
      .then(() => {
        setNuevoProducto({
          codigo_producto: '',
          nombre: '',
          porcentaje_venta: '',
          marca: '',
          peso: ''
        });
        cargarProductos();
      })
      .catch((err) => console.error("Error al crear producto:", err));
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Productos</h2>

      {/* Formulario de registro */}
      <div className="card my-4 p-3 shadow-sm">
        <h5>Agregar Nuevo Producto</h5>
        <form onSubmit={handleSubmit} className="row g-3 mt-1">
          <div className="col-md-3">
            <input
              type="text"
              name="codigo_producto"
              className="form-control"
              placeholder="Código"
              value={nuevoProducto.codigo_producto}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="nombre"
              className="form-control"
              placeholder="Nombre Producto"
              value={nuevoProducto.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              step="0.01"
              name="porcentaje_venta"
              className="form-control"
              placeholder="% Venta"
              value={nuevoProducto.porcentaje_venta}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              name="marca"
              className="form-control"
              placeholder="Marca"
              value={nuevoProducto.marca}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              name="peso"
              className="form-control"
              placeholder="Peso"
              value={nuevoProducto.peso}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 text-end mt-3">
            <button type="submit" className="btn btn-success">Guardar Producto</button>
          </div>
        </form>
      </div>

      {/* Tabla de Productos */}
      {cargando ? (
        <p>Cargando lista de productos...</p>
      ) : (
        <table className="table table-bordered table-striped mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>% Venta</th>
              <th>Marca</th>
              <th>Peso</th>
            </tr>
          </thead>
          <tbody>
            {productos.length > 0 ? (
              productos.map((prod) => (
                <tr key={prod.Id_productos}>
                  <td>{prod.Id_productos}</td>
                  <td>{prod.codigo_producto}</td>
                  <td>{prod.nombre}</td>
                  <td>{prod.porcentaje_venta}%</td>
                  <td>{prod.marca || 'N/A'}</td>
                  <td>{prod.peso || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No hay productos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Productos;