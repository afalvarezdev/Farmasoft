import { useEffect, useState } from 'react';
import { obtenerClientes, eliminarCliente } from '../services/api';
import ClienteModal from '../components/ClienteModal';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

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
      {/* Encabezado con Botón Modal */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Clientes</h2>
        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#clienteModal"
          onClick={() => setClienteSeleccionado(null)}
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* Alerta Bootstrap de notificación */}
      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show mt-3`} role="alert">
          {mensaje.texto}
          <button type="button" className="btn-close" onClick={() => setMensaje({ tipo: '', texto: '' })}></button>
        </div>
      )}

      {/* Componente Modal reutilizable */}
      <ClienteModal
        clienteSeleccionado={clienteSeleccionado}
        onClienteGuardado={() => {
          cargarClientes();
          setClienteSeleccionado(null);
        }}
      />

      {/* Tabla de Clientes */}
      {cargando ? (
        <p>Cargando información...</p>
      ) : (
        <table className="table table-bordered table-striped mt-3 align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length > 0 ? (
              clientes.map((cli) => (
                <tr key={cli.id_cliente || cli.id}>
                  <td>{cli.id_cliente || cli.id}</td>
                  <td>{cli.nombre || cli.nombre_completo}</td>
                  <td>{cli.email || 'N/A'}</td>
                  <td>{cli.telefono || 'N/A'}</td>
                  <td>{cli.direccion || 'N/A'}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#clienteModal"
                      onClick={() => setClienteSeleccionado(cli)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEliminar(cli.id_cliente || cli.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No hay clientes registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Clientes;