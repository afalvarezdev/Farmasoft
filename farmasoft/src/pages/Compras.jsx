import { useEffect, useState } from 'react';
import { obtenerCompras, crearCompra, obtenerProveedores, obtenerProductos } from '../services/api';

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Datos de la compra principal
  const [idProveedor, setIdProveedor] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');

  // Ítem temporal a agregar al carrito de compra
  const [itemTemporal, setItemTemporal] = useState({
    id_producto: '',
    cantidad: 1,
    precio_costo: '',
    fecha_caducidad: ''
  });

  // Lista de productos seleccionados en la compra actual
  const [detallesCompra, setDetallesCompra] = useState([]);

  const cargarDatos = () => {
    setCargando(true);
    Promise.all([obtenerCompras(), obtenerProveedores(), obtenerProductos()])
      .then(([datosCompras, datosProv, datosProd]) => {
        setCompras(Array.isArray(datosCompras) ? datosCompras : []);
        setProveedores(Array.isArray(datosProv) ? datosProv : []);
        setProductos(Array.isArray(datosProd) ? datosProd : []);
        setCargando(false);
      })
      .catch(() => {
        setMensaje({ tipo: 'danger', texto: 'Error al cargar los datos' });
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleAgregarProducto = (e) => {
    e.preventDefault();
    if (!itemTemporal.id_producto || !itemTemporal.precio_costo || itemTemporal.cantidad <= 0) {
      setMensaje({ tipo: 'danger', texto: 'Por favor completa todos los campos del producto' });
      return;
    }

    const prodInfo = productos.find(p => p.id_productos == itemTemporal.id_producto);
    const nuevoDetalle = {
      ...itemTemporal,
      nombre_producto: prodInfo ? prodInfo.nombre : 'Producto',
      subtotal: parseFloat(itemTemporal.precio_costo) * parseInt(itemTemporal.cantidad)
    };

    setDetallesCompra([...detallesCompra, nuevoDetalle]);
    setItemTemporal({ id_producto: '', cantidad: 1, precio_costo: '', fecha_caducidad: '' });
    setMensaje({ tipo: '', texto: '' });
  };

  const handleEliminarItem = (index) => {
    const nuevosDetalles = detallesCompra.filter((_, i) => i !== index);
    setDetallesCompra(nuevosDetalles);
  };

  const calcularTotal = () => {
    return detallesCompra.reduce((acc, item) => acc + item.subtotal, 0);
  };

  const handleGuardarCompra = () => {
    if (!idProveedor) {
      setMensaje({ tipo: 'danger', texto: 'Selecciona un proveedor' });
      return;
    }
    if (detallesCompra.length === 0) {
      setMensaje({ tipo: 'danger', texto: 'Debes agregar al menos un producto a la compra' });
      return;
    }

    const payload = {
      id_proveedor: idProveedor,
      id_usuario: 1,
      fecha_compra: new Date().toISOString().split('T')[0],
      total_compra: calcularTotal(),
      metodo_pago: metodoPago,
      detalles: detallesCompra
    };

    crearCompra(payload)
      .then(() => {
        setMensaje({ tipo: 'success', texto: 'Compra registrada con éxito' });
        setDetallesCompra([]);
        setIdProveedor('');
        cargarDatos();
      })
      .catch(() => setMensaje({ tipo: 'danger', texto: 'Error al registrar la compra' }));
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="fw-bold mb-4" style={{ color: '#003366' }}>Gestión de Compras</h2>

      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show mb-4`} role="alert">
          {mensaje.texto}
          <button type="button" className="btn-close" onClick={() => setMensaje({ tipo: '', texto: '' })}></button>
        </div>
      )}

      {/* Formulario de Compra */}
      <div className="card border-0 mb-4 p-4" style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#003366' }}>Registrar Nueva Compra</h5>
        
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Proveedor *</label>
            <select className="form-select rounded-pill" value={idProveedor} onChange={(e) => setIdProveedor(e.target.value)}>
              <option value="">Selecciona un proveedor...</option>
              {proveedores.map(p => (
                <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Método de Pago</label>
            <select className="form-select rounded-pill" value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Crédito">Crédito</option>
            </select>
          </div>
        </div>

        {/* Formulario para añadir detalle */}
        <div className="p-3 mb-3 rounded" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <h6 className="fw-bold mb-3" style={{ color: '#003366' }}>Agregar Producto a la Compra</h6>
          <div className="row g-2 align-items-center">
            <div className="col-md-4">
              <select 
                className="form-select rounded-pill" 
                value={itemTemporal.id_producto} 
                onChange={(e) => setItemTemporal({ ...itemTemporal, id_producto: e.target.value })}
              >
                <option value="">Seleccionar Producto...</option>
                {productos.map(prod => (
                  <option key={prod.id_productos} value={prod.id_productos}>{prod.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <input 
                type="number" 
                className="form-control rounded-pill" 
                placeholder="Cantidad" 
                value={itemTemporal.cantidad} 
                onChange={(e) => setItemTemporal({ ...itemTemporal, cantidad: e.target.value })} 
              />
            </div>
            <div className="col-md-2">
              <input 
                type="number" 
                step="0.01" 
                className="form-control rounded-pill" 
                placeholder="Precio Costo ($)" 
                value={itemTemporal.precio_costo} 
                onChange={(e) => setItemTemporal({ ...itemTemporal, precio_costo: e.target.value })} 
              />
            </div>
            <div className="col-md-2">
              <input 
                type="date" 
                className="form-control rounded-pill" 
                value={itemTemporal.fecha_caducidad} 
                onChange={(e) => setItemTemporal({ ...itemTemporal, fecha_caducidad: e.target.value })} 
              />
            </div>
            <div className="col-md-2">
              <button className="btn w-100" style={{ backgroundColor: '#00a859', color: '#fff', borderRadius: '25px', fontWeight: '600' }} onClick={handleAgregarProducto}>
                + Añadir
              </button>
            </div>
          </div>
        </div>

        {/* Tabla del carrito temporal */}
        {detallesCompra.length > 0 && (
          <div className="table-responsive mb-3">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Costo</th>
                  <th>Subtotal</th>
                  <th>Caducidad</th>
                  <th className="text-end">Acción</th>
                </tr>
              </thead>
              <tbody>
                {detallesCompra.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.nombre_producto}</td>
                    <td>{item.cantidad}</td>
                    <td>${parseFloat(item.precio_costo).toLocaleString()}</td>
                    <td className="fw-bold">${item.subtotal.toLocaleString()}</td>
                    <td>{item.fecha_caducidad || 'N/A'}</td>
                    <td className="text-end">
                      <button className="btn btn-outline-danger btn-sm rounded-pill px-3" onClick={() => handleEliminarItem(idx)}>Quitar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
              <h5 className="fw-bold mb-0" style={{ color: '#003366' }}>Total Compra: ${calcularTotal().toLocaleString()}</h5>
              <button className="btn px-4 py-2" style={{ backgroundColor: '#003366', color: '#fff', borderRadius: '25px', fontWeight: '600' }} onClick={handleGuardarCompra}>
                Guardar Compra
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Historial de Compras */}
      <div className="card border-0 p-4" style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#003366' }}>Historial de Compras</h5>
        {cargando ? (
          <p className="text-muted">Cargando compras...</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#003366', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <th className="py-3">ID</th>
                  <th className="py-3">Fecha</th>
                  <th className="py-3">Proveedor</th>
                  <th className="py-3">Método Pago</th>
                  <th className="py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {compras.length > 0 ? (
                  compras.map((c) => (
                    <tr key={c.id_compra}>
                      <td className="fw-semibold text-secondary">{c.id_compra}</td>
                      <td>{c.fecha_compra}</td>
                      <td className="fw-bold">{c.nombre_proveedor}</td>
                      <td>{c.metodo_pago}</td>
                      <td className="fw-bold text-success">${parseFloat(c.total_compra).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">No hay compras registradas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compras;