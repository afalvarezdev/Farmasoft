import { useEffect, useState } from 'react';
import { obtenerClientes, crearCliente, eliminarCliente } from '../services/api';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Estado para el formulario de cliente
  const [formData, setFormData] = useState({
    nombre_completo: '',
    telefono: '',
    direccion: ''
  });

  const cargarClientes = () => {
    setCargando(true);
    obtenerClientes()
      .then((datos) => {
        setClientes(Array.isArray(datos) ? datos : []);
        setCargando(false);
      })
      .catch(() => {
        setMensaje({ tipo: 'danger', texto: 'Error al conectar con el servidor' });
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre_completo.trim()) {
      setMensaje({ tipo: 'danger', texto: 'El nombre del cliente es obligatorio' });
      return;
    }

    crearCliente(formData)
      .then(() => {
        setMensaje({ tipo: 'success', texto: 'Cliente guardado exitosamente' });
        setFormData({ nombre_completo: '', telefono: '', direccion: '' });
        cargarClientes();
      })
      .catch(() => {
        setMensaje({ tipo: 'danger', texto: 'Error al guardar el cliente' });
      });
  };

  const handleEliminar = (id) => {
    if (!window.confirm("¿Deseas eliminar este cliente?")) return;

    eliminarCliente(id)
      .then(() => {
        setMensaje({ tipo: 'success', texto: 'Cliente eliminado correctamente' });
        cargarClientes();
      })
      .catch(() => {
        setMensaje({ tipo: 'danger', texto: 'Error al eliminar el cliente' });
      });
  };

  return (
    <div className="container-fluid p-4">
      {/* Encabezado Principal */}
      <h2 className="fw-bold mb-4" style={{ color: '#003366' }}>Gestión de Clientes</h2>

      {/* Alerta de notificación */}
      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show mb-4`} role="alert">
          {mensaje.texto}
          <button type="button" className="btn-close" onClick={() => setMensaje({ tipo: '', texto: '' })}></button>
        </div>
      )}

      {/* Tarjeta de Formulario Integrado (Pill Style) */}
      <div className="card border-0 mb-4 p-4" style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#003366' }}>Agregar Nuevo Cliente</h5>
        <form onSubmit={handleSubmit}>
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control rounded-pill px-3 py-2"
                placeholder="Nombre Completo *"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control rounded-pill px-3 py-2"
                placeholder="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control rounded-pill px-3 py-2"
                placeholder="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-2 text-end">
              <button
                type="submit"
                className="btn w-100 py-2"
                style={{ backgroundColor: '#00a859', color: '#fff', borderRadius: '25px', fontWeight: '600' }}
              >
                Guardar Cliente
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Tarjeta de Tabla de Datos */}
      <div className="card border-0 p-4" style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#003366' }}>Clientes Registrados</h5>

        {cargando ? (
          <p className="text-muted">Cargando información...</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#003366', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <th className="py-3">IDENTIFICACIÓN</th>
                  <th className="py-3">Nombre</th>
                  <th className="py-3">Teléfono</th>
                  <th className="py-3">Dirección</th>
                  <th className="py-3 text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.length > 0 ? (
                  clientes.map((cli) => (
                    <tr key={cli.id_cliente || cli.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td className="fw-semibold text-secondary">{cli.id_cliente || cli.id}</td>
                      <td className="fw-bold" style={{ color: '#0f172a' }}>{cli.nombre_completo || cli.nombre}</td>
                      <td>{cli.telefono || 'N/A'}</td>
                      <td>{cli.direccion || 'N/A'}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-outline-danger btn-sm rounded-pill px-3"
                          onClick={() => handleEliminar(cli.id_cliente || cli.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No hay clientes registrados en el sistema.
                    </td>
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

export default Clientes;