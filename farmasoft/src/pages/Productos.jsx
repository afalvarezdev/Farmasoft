import React, { useEffect, useState } from 'react';
import { obtenerProductos, crearProducto } from '../services/api.js';

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

  const cargarProductos = async () => {
    setCargando(true);
    try {
      const datos = await obtenerProductos();
      if (Array.isArray(datos)) setProductos(datos);
    } catch (err) {
      console.error("Error al cargar productos:", err);
    } finally {
      setCargando(false);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearProducto(nuevoProducto);
      setNuevoProducto({
        codigo_producto: '',
        nombre: '',
        porcentaje_venta: '',
        marca: '',
        peso: ''
      });
      cargarProductos();
    } catch (err) {
      console.error("Error al crear producto:", err);
    }
  };

  return (
    <div className="container-fluid px-4 mt-4 fade-in">
      <h2 className="fw-bold mb-4" style={{ color: '#003366' }}>Gestión de Productos</h2>

      {/* Formulario de registro */}
      <div className="card card-custom my-4 p-4">
        <h5 className="fw-semibold mb-3" style={{ color: '#003366' }}>Agregar Nuevo Producto</h5>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              name="codigo_producto"
              className="form-control form-control-custom"
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
              className="form-control form-control-custom"
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
              className="form-control form-control-custom"
              placeholder="% Venta"
              value={nuevoProducto.porcentaje_venta}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              name="marca"
              className="form-control form-control-custom"
              placeholder="Marca"
              value={nuevoProducto.marca}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              name="peso"
              className="form-control form-control-custom"
              placeholder="Peso"
              value={nuevoProducto.peso}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 text-end mt-3">
            <button type="submit" className="btn btn-farmasoft">
              Guardar Producto
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de Productos */}
      {cargando ? (
        <div className="text-center py-4">
          <p className="text-muted fw-semibold">Cargando lista de productos...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle table-farmasoft mt-2">
            <thead>
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
                  <tr key={prod.Id_productos || prod.id_producto}>
                    <td className="fw-semibold">{prod.Id_productos || prod.id_producto}</td>
                    <td>{prod.codigo_producto || prod.codigo}</td>
                    <td className="fw-semibold">{prod.nombre}</td>
                    <td>{prod.porcentaje_venta}%</td>
                    <td>{prod.marca || 'N/A'}</td>
                    <td>{prod.peso || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No hay productos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Productos;