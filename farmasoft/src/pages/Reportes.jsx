import { useEffect, useState } from 'react';
import { obtenerReporte, obtenerProveedores } from '../services/api';

const Reportes = () => {
  const [tipoReporte, setTipoReporte] = useState('ventas');
  const [fechaInicio, setFechaInicio] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0]);
  const [idProveedor, setIdProveedor] = useState('');
  
  const [proveedores, setProveedores] = useState([]);
  const [datosReporte, setDatosReporte] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    obtenerProveedores()
      .then(res => setProveedores(Array.isArray(res) ? res : []))
      .catch(err => console.error("Error al cargar proveedores:", err));
  }, []);

  const cargarReporte = () => {
    setCargando(true);
    const params = {};
    
    if (tipoReporte === 'ventas' || tipoReporte === 'compras') {
      params.fecha_inicio = fechaInicio;
      params.fecha_fin = fechaFin;
    } else if (tipoReporte === 'inventario') {
      if (idProveedor) params.id_proveedor = idProveedor;
    }

    obtenerReporte(tipoReporte, params)
      .then(data => {
        setDatosReporte(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al obtener reporte:", err);
        setDatosReporte([]);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarReporte();
  }, [tipoReporte]);

  const calcularTotalSuma = () => {
    if (tipoReporte === 'ventas' || tipoReporte === 'compras') {
      return datosReporte.reduce((acc, item) => acc + parseFloat(item.total || 0), 0);
    }
    return 0;
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="fw-bold mb-4" style={{ color: '#003366' }}>Módulo Unificado de Reportes</h2>

      {/* Controles y Filtros */}
      <div className="card border-0 mb-4 p-4" style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div className="row g-3 align-items-end">
          
          {/* Selección de Tipo de Reporte */}
          <div className="col-md-4">
            <label className="form-label fw-semibold">Tipo de Reporte</label>
            <select 
              className="form-select rounded-pill" 
              value={tipoReporte} 
              onChange={(e) => setTipoReporte(e.target.value)}
            >
              <option value="ventas">📊 Reporte de Ventas</option>
              <option value="compras">🛒 Reporte de Compras</option>
              <option value="inventario">📦 Reporte de Inventario / Stock</option>
            </select>
          </div>

          {/* Filtros dinámicos según el reporte */}
          {(tipoReporte === 'ventas' || tipoReporte === 'compras') && (
            <>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Fecha Inicio</label>
                <input 
                  type="date" 
                  className="form-control rounded-pill" 
                  value={fechaInicio} 
                  onChange={(e) => setFechaInicio(e.target.value)} 
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Fecha Fin</label>
                <input 
                  type="date" 
                  className="form-control rounded-pill" 
                  value={fechaFin} 
                  onChange={(e) => setFechaFin(e.target.value)} 
                />
              </div>
            </>
          )}

          {tipoReporte === 'inventario' && (
            <div className="col-md-6">
              <label className="form-label fw-semibold">Filtrar por Proveedor (Opcional)</label>
              <select 
                className="form-select rounded-pill" 
                value={idProveedor} 
                onChange={(e) => setIdProveedor(e.target.value)}
              >
                <option value="">Todos los Proveedores</option>
                {proveedores.map(p => (
                  <option key={p.id_proveedores} value={p.id_proveedores}>{p.nombre}</option>
                ))}
              </select>
            </div>
          )}

          <div className="col-md-2">
            <button 
              className="btn w-100" 
              style={{ backgroundColor: '#00a859', color: '#fff', borderRadius: '25px', fontWeight: '600' }}
              onClick={cargarReporte}
            >
              Generar
            </button>
          </div>

        </div>
      </div>

      {/* Resultado del Reporte */}
      <div className="card border-0 p-4" style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold m-0" style={{ color: '#003366' }}>
            Resultados - {tipoReporte === 'ventas' ? 'Ventas' : tipoReporte === 'compras' ? 'Compras' : 'Inventario'}
          </h5>
          {(tipoReporte === 'ventas' || tipoReporte === 'compras') && (
            <span className="badge bg-light text-dark fs-6 border p-2">
              Total Periodo: <strong className="text-success">${calcularTotalSuma().toLocaleString()}</strong>
            </span>
          )}
        </div>

        {cargando ? (
          <p className="text-muted">Cargando reporte...</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#003366', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  {tipoReporte === 'ventas' && (
                    <>
                      <th>ID Venta</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Tipo Pago</th>
                      <th>Medio Pago</th>
                      <th>Total</th>
                    </>
                  )}
                  {tipoReporte === 'compras' && (
                    <>
                      <th>ID Compra</th>
                      <th>Fecha</th>
                      <th>Proveedor</th>
                      <th>Total</th>
                    </>
                  )}
                  {tipoReporte === 'inventario' && (
                    <>
                      <th>ID Producto</th>
                      <th>Producto</th>
                      <th>Proveedor</th>
                      <th>Precio Venta</th>
                      <th>Stock Actual</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {datosReporte.length > 0 ? (
                  datosReporte.map((item, idx) => (
                    <tr key={idx}>
                      {tipoReporte === 'ventas' && (
                        <>
                          <td className="fw-semibold text-secondary">{item.id_Ventas}</td>
                          <td>{item.fecha}</td>
                          <td className="fw-bold">{item.cliente}</td>
                          <td>{item.tipo_pago}</td>
                          <td>{item.medio_pago}</td>
                          <td className="fw-bold text-success">${parseFloat(item.total).toLocaleString()}</td>
                        </>
                      )}
                      {tipoReporte === 'compras' && (
                        <>
                          <td className="fw-semibold text-secondary">{item.id_Compras}</td>
                          <td>{item.fecha}</td>
                          <td className="fw-bold">{item.proveedor}</td>
                          <td className="fw-bold text-primary">${parseFloat(item.total).toLocaleString()}</td>
                        </>
                      )}
                      {tipoReporte === 'inventario' && (
                        <>
                          <td className="fw-semibold text-secondary">{item.id_productos}</td>
                          <td className="fw-bold">{item.nombre}</td>
                          <td>{item.proveedor || 'Sin Asignar'}</td>
                          <td>${parseFloat(item.precio).toLocaleString()}</td>
                          <td>
                            <span className={`badge ${item.stock <= 10 ? 'bg-danger' : 'bg-success'}`}>
                              {item.stock} unidades
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">No se encontraron registros para los filtros seleccionados.</td>
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

export default Reportes;