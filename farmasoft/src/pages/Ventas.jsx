import { useEffect, useState } from 'react';
import { obtenerVentas, crearVenta, obtenerClientes, obtenerProductos } from '../services/api';

const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 2
});

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Campos principales de la venta
  const [idCliente, setIdCliente] = useState('');
  const [tipoPago, setTipoPago] = useState('Contado');
  const [medioPago, setMedioPago] = useState('Efectivo');

  // Ítem temporal para el carrito de venta
  const [itemTemporal, setItemTemporal] = useState({
    id_producto: '',
    cantidad: 1,
    precio_venta: ''
  });
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [mostrarResultadosProducto, setMostrarResultadosProducto] = useState(false);

  // Lista de productos seleccionados
  const [detallesVenta, setDetallesVenta] = useState([]);

  const cargarDatos = () => {
    setCargando(true);
    
    obtenerVentas()
      .then((datosVentas) => {
        console.log("Datos de ventas recibidos:", datosVentas); // Para ver qué trae el servidor en F12 -> Console
        // Verificamos si viene directo como arreglo o dentro de .data (común en Axios)
        const listaVentas = Array.isArray(datosVentas) 
          ? datosVentas 
          : (datosVentas?.data || datosVentas?.ventas || []);
        setVentas(listaVentas);
      })
      .catch((err) => console.error("Error al cargar ventas:", err));

    obtenerClientes()
      .then((datosCli) => setClientes(Array.isArray(datosCli) ? datosCli : []))
      .catch((err) => console.error("Error al cargar clientes:", err));

    obtenerProductos()
      .then((datosProd) => {
        setProductos(Array.isArray(datosProd) ? datosProd : []);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        setMensaje({ tipo: 'danger', texto: 'Error al conectar con el servidor' });
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const productosFiltrados = productos.filter((producto) =>
    `${producto.nombre} ${producto.codigo_producto || ''}`
      .toLowerCase()
      .includes(busquedaProducto.trim().toLowerCase())
  );

  const handleSelectProducto = (productoSeleccionado) => {
    const precioCosto = Number(productoSeleccionado?.precio_costo);
    const porcentajeVenta = Number(productoSeleccionado?.porcentaje_venta);
    const precioVenta = precioCosto + (precioCosto * porcentajeVenta / 100);

    setItemTemporal({
      ...itemTemporal,
      id_producto: productoSeleccionado ? Number(productoSeleccionado.id_productos) : '',
      precio_venta: productoSeleccionado && Number.isFinite(precioVenta) ? String(precioVenta) : ''
    });
    setBusquedaProducto(productoSeleccionado?.nombre || '');
    setMostrarResultadosProducto(false);
  };

  const handleAgregarProducto = (e) => {
    e.preventDefault();
    if (!itemTemporal.id_producto || !itemTemporal.precio_venta || itemTemporal.cantidad <= 0) {
      setMensaje({ tipo: 'danger', texto: 'Selecciona un producto, cantidad y precio válidos' });
      return;
    }

    const prodInfo = productos.find(p => String(p.id_productos) === String(itemTemporal.id_producto));
    const subtotalItem = parseFloat(itemTemporal.precio_venta) * parseInt(itemTemporal.cantidad);

    const nuevoDetalle = {
      ...itemTemporal,
      id_producto: Number(itemTemporal.id_producto),
      nombre_producto: prodInfo ? prodInfo.nombre : 'Producto',
      subtotal: subtotalItem
    };

    setDetallesVenta([...detallesVenta, nuevoDetalle]);
    setItemTemporal({ id_producto: '', cantidad: 1, precio_venta: '' });
    setBusquedaProducto('');
    setMostrarResultadosProducto(false);
    setMensaje({ tipo: '', texto: '' });
  };

  const handleEliminarItem = (index) => {
    const nuevosDetalles = detallesVenta.filter((_, i) => i !== index);
    setDetallesVenta(nuevosDetalles);
  };

  const calcularSubtotal = () => {
    return detallesVenta.reduce((acc, item) => acc + item.subtotal, 0);
  };

  const calcularImpuesto = () => {
    return calcularSubtotal() * 0.19; 
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularImpuesto();
  };

  const handleGuardarVenta = () => {
    if (detallesVenta.length === 0) {
      setMensaje({ tipo: 'danger', texto: 'Agrega al menos un producto a la venta' });
      return;
    }

    const payload = {
      id_cliente: idCliente ? parseInt(idCliente) : null,
      id_usuario: 1,
      tipo_pago: tipoPago,
      medio_pago: medioPago,
      subtotal: calcularSubtotal(),
      impuesto: calcularImpuesto(),
      total: calcularTotal(),
      detalles: detallesVenta
    };

    crearVenta(payload)
      .then(() => {
        setMensaje({ tipo: 'success', texto: '¡Venta registrada con éxito!' });
        setDetallesVenta([]);
        setIdCliente('');
        cargarDatos();
      })
      .catch(() => setMensaje({ tipo: 'danger', texto: 'Error al registrar la venta' }));
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="fw-bold mb-4" style={{ color: '#003366' }}>Gestión de Ventas</h2>

      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show mb-4`} role="alert">
          {mensaje.texto}
          <button type="button" className="btn-close" onClick={() => setMensaje({ tipo: '', texto: '' })}></button>
        </div>
      )}

      {/* Formulario de Registro de Venta */}
      <div className="card border-0 mb-4 p-4" style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#003366' }}>Nueva Factura de Venta</h5>

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Cliente (Opcional)</label>
            <select className="form-select rounded-pill" value={idCliente} onChange={(e) => setIdCliente(e.target.value)}>
              <option value="">Cliente Ocasional / General</option>
              {clientes.map(c => (
                <option key={c.id_cliente} value={c.id_cliente}>{c.nombre} {c.nombre_completo}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Añadir Producto al Carrito */}
        <div className="p-3 mb-3 rounded" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <h6 className="fw-bold mb-3" style={{ color: '#003366' }}>Agregar Productos</h6>
          <div className="row g-2 align-items-center">
            <div className="col-md-5">
              <div className="position-relative">
                <input
                  type="search"
                  className="form-control rounded-pill"
                  placeholder="Buscar producto..."
                  value={busquedaProducto}
                  autoComplete="off"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={mostrarResultadosProducto}
                  onFocus={() => setMostrarResultadosProducto(true)}
                  onBlur={() => setMostrarResultadosProducto(false)}
                  onChange={(e) => {
                    setBusquedaProducto(e.target.value);
                    setMostrarResultadosProducto(true);
                    setItemTemporal({ ...itemTemporal, id_producto: '', precio_venta: '' });
                  }}
                />
                {mostrarResultadosProducto && (
                  <div
                    className="dropdown-menu show w-100"
                    role="listbox"
                    style={{ position: 'absolute', maxHeight: '240px', overflowY: 'auto', zIndex: 1050 }}
                  >
                    {productosFiltrados.length > 0 ? productosFiltrados.map(prod => (
                      <button
                        key={prod.id_productos}
                        type="button"
                        className="dropdown-item"
                        role="option"
                        aria-selected={String(itemTemporal.id_producto) === String(prod.id_productos)}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelectProducto(prod)}
                      >
                        {prod.nombre}
                      </button>
                    )) : (
                      <span className="dropdown-item-text text-muted">No se encontraron productos</span>
                    )}
                  </div>
                )}
              </div>
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
            <div className="col-md-3">
              <input 
                type="number" 
                step="0.01" 
                className="form-control rounded-pill" 
                placeholder="Precio Venta ($)" 
                value={itemTemporal.precio_venta} 
                onChange={(e) => setItemTemporal({ ...itemTemporal, precio_venta: e.target.value })} 
              />
            </div>
            <div className="col-md-2">
              <button className="btn w-100" style={{ backgroundColor: '#00a859', color: '#fff', borderRadius: '25px', fontWeight: '600' }} onClick={handleAgregarProducto}>
                + Añadir
              </button>
            </div>
          </div>
        </div>

        {/* Detalle de Productos Seleccionados */}
        {detallesVenta.length > 0 && (
          <div className="table-responsive mb-3">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Venta</th>
                  <th>Subtotal</th>
                  <th className="text-end">Acción</th>
                </tr>
              </thead>
              <tbody>
                {detallesVenta.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.nombre_producto}</td>
                    <td>{item.cantidad}</td>
                    <td>{formatoCOP.format(Number(item.precio_venta))}</td>
                    <td className="fw-bold">{formatoCOP.format(item.subtotal)}</td>
                    <td className="text-end">
                      <button className="btn btn-outline-danger btn-sm rounded-pill px-3" onClick={() => handleEliminarItem(idx)}>Quitar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Tipo de Pago</label>
            <select className="form-select rounded-pill" value={tipoPago} onChange={(e) => setTipoPago(e.target.value)}>
              <option value="Contado">Contado</option>
              <option value="Crédito">Crédito</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Medio de Pago</label>
            <select className="form-select rounded-pill" value={medioPago} onChange={(e) => setMedioPago(e.target.value)}>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>
        </div>

        {detallesVenta.length > 0 && (
          <>
            {/* Totales y Botón de Guardar */}
            <div className="row mt-4 pt-3 border-top align-items-center">
              <div className="col-md-6">
                <p className="mb-1 text-muted">Subtotal: <span className="fw-bold text-dark">{formatoCOP.format(calcularSubtotal())}</span></p>
                <p className="mb-1 text-muted">Impuesto (19%): <span className="fw-bold text-dark">{formatoCOP.format(calcularImpuesto())}</span></p>
                <h4 className="fw-bold mt-2" style={{ color: '#003366' }}>Total a Pagar: {formatoCOP.format(calcularTotal())}</h4>
              </div>
              <div className="col-md-6 text-end">
                <button className="btn px-5 py-2" style={{ backgroundColor: '#003366', color: '#fff', borderRadius: '25px', fontWeight: '600' }} onClick={handleGuardarVenta}>
                  Finalizar Venta
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Historial de Ventas */}
      <div className="card border-0 p-4" style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#003366' }}>Historial de Ventas Registradas</h5>
        {cargando ? (
          <p className="text-muted">Cargando ventas...</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#003366', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <th className="py-3">ID</th>
                  <th className="py-3">Fecha</th>
                  <th className="py-3">Cliente</th>
                  <th className="py-3">Tipo Pago</th>
                  <th className="py-3">Medio</th>
                  <th className="py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {ventas.length > 0 ? (
                  ventas.map((v) => (
                    <tr key={v.id_venta}>
                      <td className="fw-semibold text-secondary">{v.id_venta}</td>
                      <td>{v.fecha}</td>
                      <td className="fw-bold">{v.nombre_cliente || 'Cliente General / Ocasional'}</td>
                      <td>{v.tipo_pago}</td>
                      <td>{v.medio_pago}</td>
                      <td className="fw-bold text-success">{formatoCOP.format(Number(v.total))}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">No hay ventas registradas.</td>
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

export default Ventas;