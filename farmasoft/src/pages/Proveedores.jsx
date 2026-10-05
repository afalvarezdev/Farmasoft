import { useEffect, useState } from 'react';
import { obtenerProveedores, crearProveedor, editarProveedor, eliminarProveedor } from '../services/api';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [editandoId, setEditandoId] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    email: ''
  });

  const cargarProveedores = () => {
    setCargando(true);
    obtenerProveedores()
      .then((datos) => {
        setProveedores(Array.isArray(datos) ? datos : []);
        setCargando(false);
      })
      .catch(() => {
        setMensaje({ tipo: 'danger', texto: 'Error al conectar con el servidor' });
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      setMensaje({ tipo: 'danger', texto: 'El nombre del proveedor es obligatorio' });
      return;
    }

    if (editandoId) {
      editarProveedor({ ...formData, id_proveedor: editandoId })
        .then(() => {
          setMensaje({ tipo: 'success', texto: 'Proveedor actualizado exitosamente' });
          limpiarFormulario();
          cargarProveedores();
        })
        .catch(() => setMensaje({ tipo: 'danger', texto: 'Error al actualizar el proveedor' }));
    } else {
      crearProveedor(formData)
        .then(() => {
          setMensaje({ tipo: 'success', texto: 'Proveedor guardado exitosamente' });
          limpiarFormulario();
          cargarProveedores();
        })
        .catch(() => setMensaje({ tipo: 'danger', texto: 'Error al guardar el proveedor' }));
    }
  };

  const handleEditar = (prov) => {
    setEditandoId(prov.id_proveedor);
    setFormData({
      nombre: prov.nombre || '',
      telefono: prov.telefono || '',
      direccion: prov.direccion || '',
      email: prov.email || ''
    });
  };

  const limpiarFormulario = () => {
    setEditandoId(null);
    setFormData({ nombre: '', telefono: '', direccion: '', email: '' });
  };

  const handleEliminar = (id) => {
    if (!window.confirm("¿Deseas eliminar este proveedor?")) return;

    eliminarProveedor(id)
      .then(() => {
        setMensaje({ tipo: 'success', texto: 'Proveedor eliminado correctamente' });
        cargarProveedores();
      })
      .catch(() => setMensaje({ tipo: 'danger', texto: 'Error al eliminar el proveedor' }));
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="fw-bold mb-4" style={{ color: '#003366' }}>Gestión de Proveedores</h2>

      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show mb-4`} role="alert">
          {mensaje.texto}
          <button type="button" className="btn-close" onClick={() => setMensaje({ tipo: '', texto: '' })}></button>
        </div>
      )}

      {/* Tarjeta de Formulario (Pill Style) */}
      <div className="card border-0 mb-4 p-4" style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#003366' }}>
          {editandoId ? 'Editar Proveedor' : 'Agregar Nuevo Proveedor'}
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="row g-3 align-items-center">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control rounded-pill px-3 py-2"
                placeholder="Nombre Proveedor *"
                name="nombre"
                value={formData.nombre}
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
            <div className="col-md-3">
              <input
                type="email"
                className="form-control rounded-pill px-3 py-2"
                placeholder="Correo Electrónico"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-12 text-end mt-3">
              {editandoId && (
                <button
                  type="button"
                  className="btn btn-secondary rounded-pill me-2 px-4 py-2"
                  onClick={limpiarFormulario}
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="btn py-2 px-4"
                style={{ backgroundColor: '#00a859', color: '#fff', borderRadius: '25px', fontWeight: '600' }}
              >
                {editandoId ? 'Actualizar Proveedor' : 'Guardar Proveedor'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Tabla de Proveedores */}
      <div className="card border-0 p-4" style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#003366' }}>Proveedores Registrados</h5>

        {cargando ? (
          <p className="text-muted">Cargando información...</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#003366', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <th className="py-3">ID</th>
                  <th className="py-3">Nombre</th>
                  <th className="py-3">Teléfono</th>
                  <th className="py-3">Dirección</th>
                  <th className="py-3">Email</th>
                  <th className="py-3 text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {proveedores.length > 0 ? (
                  proveedores.map((prov) => (
                    <tr key={prov.id_proveedor} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td className="fw-semibold text-secondary">{prov.id_proveedor}</td>
                      <td className="fw-bold" style={{ color: '#0f172a' }}>{prov.nombre}</td>
                      <td>{prov.telefono || 'N/A'}</td>
                      <td>{prov.direccion || 'N/A'}</td>
                      <td>{prov.email || 'N/A'}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-outline-warning btn-sm me-2 rounded-pill px-3"
                          onClick={() => handleEditar(prov)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm rounded-pill px-3"
                          onClick={() => handleEliminar(prov.id_proveedor)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No hay proveedores registrados en el sistema.
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

export default Proveedores;