import React, { useEffect, useState } from 'react';
import { obtenerProductos, crearProducto } from '../services/api.js';

// Presenta el catálogo y el formulario para registrar productos nuevos.
const Productos = () => {
  // Guarda los productos recibidos del backend para mostrarlos en la tabla.
  const [productos, setProductos] = useState([]);

  // Indica si la lista de productos todavía se está cargando.
  const [cargando, setCargando] = useState(true);

  // Mantiene los valores del formulario, incluida la cantidad y unidad del peso.
  const [nuevoProducto, setNuevoProducto] = useState({
    codigo_producto: '',
    nombre: '',
    precio_costo: '',
    porcentaje_venta: '',
    marca: '',
    peso_cantidad: '',
    peso_unidad: 'gramos'
  });

  // Consulta el catálogo y actualiza el estado de carga incluso si ocurre un error.
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

  // Carga el catálogo una vez al montar la página.
  useEffect(() => {
    cargarProductos();
  }, []);

  // Actualiza el campo del formulario identificado por el atributo name.
  const handleChange = (e) => {
    setNuevoProducto({
      ...nuevoProducto,
      [e.target.name]: e.target.value
    });
  };

  // Convierte cantidad y unidad en el campo peso que espera el backend.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { peso_cantidad, peso_unidad, ...datosProducto } = nuevoProducto;
      await crearProducto({
        ...datosProducto,
        precio_costo: Number(datosProducto.precio_costo),
        peso: `${peso_cantidad} ${peso_unidad}`
      });
      setNuevoProducto({
        codigo_producto: '',
        nombre: '',
        precio_costo: '',
        porcentaje_venta: '',
        marca: '',
        peso_cantidad: '',
        peso_unidad: 'gramos'
      });
      cargarProductos();
    } catch (err) {
      console.error("Error al crear producto:", err);
    }
  };

  return (
    <div className="container-fluid px-4 mt-4 fade-in">
      <h2 className="fw-bold mb-4" style={{ color: '#003366' }}>Gestión de Productos</h2>

      {/* Formulario de registro con precio de costo y peso desglosado. */}
      <div className="card card-custom my-4 p-4">
        <h5 className="fw-semibold mb-3" style={{ color: '#003366' }}>Agregar Nuevo Producto</h5>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-3">
            <label className="form-label" htmlFor="codigo-producto">Código</label>
            <input
              type="text"
              id="codigo-producto"
              name="codigo_producto"
              className="form-control form-control-custom"
              placeholder="Código"
              value={nuevoProducto.codigo_producto}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="nombre-producto">Nombre del Producto</label>
            <input
              type="text"
              id="nombre-producto"
              name="nombre"
              className="form-control form-control-custom"
              placeholder="Nombre Producto"
              value={nuevoProducto.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="precio-costo">Precio de Costo unidad</label>
            <input
              type="number"
              id="precio-costo"
              name="precio_costo"
              className="form-control form-control-custom"
              placeholder="Precio de Costo unidad"
              min="0"
              max="999999.99"
              step="0.01"
              value={nuevoProducto.precio_costo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="porcentaje-venta">Porcentaje de Venta</label>
            <input
              type="number"
              id="porcentaje-venta"
              step="0.01"
              name="porcentaje_venta"
              className="form-control form-control-custom"
              placeholder="% Venta"
              value={nuevoProducto.porcentaje_venta}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="marca-producto">Marca</label>
            <input
              type="text"
              id="marca-producto"
              name="marca"
              className="form-control form-control-custom"
              placeholder="Marca"
              value={nuevoProducto.marca}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="peso-cantidad">Valor de Medida</label>
            <input
              type="number"
              id="peso-cantidad"
              name="peso_cantidad"
              className="form-control form-control-custom"
              placeholder="Ej. 50gr"
              min="0.01"
              step="any"
              value={nuevoProducto.peso_cantidad}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label" htmlFor="peso-unidad">Unidad del Peso</label>
            <select
              id="peso-unidad"
              name="peso_unidad"
              className="form-select form-control-custom"
              value={nuevoProducto.peso_unidad}
              onChange={handleChange}
              required
            >
              <option value="gramos">Gramos</option>
              <option value="kilogramos">Kilogramos</option>
              <option value="mililitros">Mililitros</option>
              <option value="litros">Litros</option>
              <option value="unidades">Unidades</option>
            </select>
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <button type="submit" className="btn btn-farmasoft w-100">
              Guardar Producto
            </button>
          </div>
        </form>
      </div>

      {/* Tabla del catálogo con los productos que ya existen. */}
      {cargando ? (
        <div className="text-center py-4">
          <p className="text-muted fw-semibold">Cargando lista de productos...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle table-farmasoft mt-2">
            <thead>
              <tr>
                {/* <th>ID</th> */}
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
                    {/* <td className="fw-semibold">{prod.Id_productos || prod.id_producto}</td> */}
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