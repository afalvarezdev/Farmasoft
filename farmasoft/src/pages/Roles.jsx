import { useEffect, useState } from 'react';
import { obtenerRoles, crearRol, editarRol, eliminarRol } from '../services/api';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [editandoId, setEditandoId] = useState(null);

  const [formData, setFormData] = useState({
    nombre_rol: '',
    descripcion: '',
    estado: 1
  });

  const cargarRoles = () => {
    setCargando(true);
    obtenerRoles()
      .then((datos) => {
        setRoles(Array.isArray(datos) ? datos : []);
        setCargando(false);
      })
      .catch(() => {
        setMensaje({ tipo: 'danger', texto: 'Error al conectar con el servidor' });
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarRoles();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? (e.target.checked ? 1 : 0) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre_rol.trim()) {
      setMensaje({ tipo: 'danger', texto: 'El nombre del rol es obligatorio' });
      return;
    }

    if (editandoId) {
      editarRol({ ...formData, id_rol: editandoId })
        .then(() => {
          setMensaje({ tipo: 'success', texto: 'Rol actualizado exitosamente' });
          limpiarFormulario();
          cargarRoles();
        })
        .catch(() => setMensaje({ tipo: 'danger', texto: 'Error al actualizar el rol' }));
    } else {
      crearRol(formData)
        .then(() => {
          setMensaje({ tipo: 'success', texto: 'Rol guardado exitosamente' });
          limpiarFormulario();
          cargarRoles();
        })
        .catch(() => setMensaje({ tipo: 'danger', texto: 'Error al guardar el rol' }));
    }
  };

  const handleEditar = (rol) => {
    setEditandoId(rol.id_rol);
    setFormData({
      nombre_rol: rol.nombre_rol || '',
      descripcion: rol.descripcion || '',
      estado: rol.estado !== undefined ? rol.estado : 1
    });
  };

  const limpiarFormulario = () => {
    setEditandoId(null);
    setFormData({ nombre_rol: '', descripcion: '', estado: 1 });
  };

  const handleEliminar = (id) => {
    if (!window.confirm("¿Deseas eliminar este rol?")) return;

    eliminarRol(id)
      .then(() => {
        setMensaje({ tipo: 'success', texto: 'Rol eliminado correctamente' });
        cargarRoles();
      })
      .catch(() => setMensaje({ tipo: 'danger', texto: 'Error al eliminar el rol' }));
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="fw-bold mb-4" style={{ color: '#003366' }}>Gestión de Roles</h2>

      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show mb-4`} role="alert">
          {mensaje.texto}
          <button type="button" className="btn-close" onClick={() => setMensaje({ tipo: '', texto: '' })}></button>
        </div>
      )}

      {/* Tarjeta de Formulario */}
      <div className="card border-0 mb-4 p-4" style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#003366' }}>
          {editandoId ? 'Editar Rol' : 'Agregar Nuevo Rol'}
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control rounded-pill px-3 py-2"
                placeholder="Nombre del Rol *"
                name="nombre_rol"
                value={formData.nombre_rol}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-5">
              <input
                type="text"
                className="form-control rounded-pill px-3 py-2"
                placeholder="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3 d-flex align-items-center">
              <div className="form-check form-switch ms-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="estadoSwitch"
                  name="estado"
                  checked={formData.estado === 1}
                  onChange={handleChange}
                />
                <label className="form-check-label fw-semibold ms-2" htmlFor="estadoSwitch">
                  {formData.estado === 1 ? 'Activo' : 'Inactivo'}
                </label>
              </div>
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
                {editandoId ? 'Actualizar Rol' : 'Guardar Rol'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Tabla de Roles */}
      <div className="card border-0 p-4" style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#003366' }}>Roles Registrados</h5>

        {cargando ? (
          <p className="text-muted">Cargando información...</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#003366', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <th className="py-3">ID</th>
                  <th className="py-3">Nombre del Rol</th>
                  <th className="py-3">Descripción</th>
                  <th className="py-3">Estado</th>
                  <th className="py-3 text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {roles.length > 0 ? (
                  roles.map((rol) => (
                    <tr key={rol.id_rol} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td className="fw-semibold text-secondary">{rol.id_rol}</td>
                      <td className="fw-bold" style={{ color: '#0f172a' }}>{rol.nombre_rol}</td>
                      <td>{rol.descripcion || 'Sin descripción'}</td>
                      <td>
                        <span className={`badge rounded-pill ${rol.estado === 1 ? 'bg-success' : 'bg-secondary'}`}>
                          {rol.estado === 1 ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-outline-warning btn-sm me-2 rounded-pill px-3"
                          onClick={() => handleEditar(rol)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm rounded-pill px-3"
                          onClick={() => handleEliminar(rol.id_rol)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No hay roles registrados en el sistema.
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

export default Roles;