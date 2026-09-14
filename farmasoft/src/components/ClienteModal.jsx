import { useEffect, useState } from "react";
import { crearCliente, editarCliente } from "../services/api";

function ClienteModal({ clienteSeleccionado, onClienteGuardado }) {
  const [form, setForm] = useState({
    id: "",
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (clienteSeleccionado) {
      setForm({
        id: clienteSeleccionado.id_cliente || clienteSeleccionado.id || "",
        nombre: clienteSeleccionado.nombre || clienteSeleccionado.nombre_completo || "",
        email: clienteSeleccionado.email || "",
        telefono: clienteSeleccionado.telefono || "",
        direccion: clienteSeleccionado.direccion || "",
      });
    } else {
      setForm({ id: "", nombre: "", email: "", telefono: "", direccion: "" });
    }
    setError(null);
  }, [clienteSeleccionado]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    try {
      let res;
      if (form.id) {
        res = await editarCliente(form);
      } else {
        res = await crearCliente(form);
      }

      // Si PHP devuelve respuesta (o si success es true/undefined pero creó el registro)
      if (res && res.success !== false) {
        // Cerrar modal usando el atributo de Bootstrap o JS directo
        const modalElement = document.getElementById("clienteModal");
        const modalInstance = window.bootstrap?.Modal?.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        } else {
          // Si no hay instancia JS de Bootstrap, forzamos el click en cerrar
          document.getElementById("cerrarModal")?.click();
        }

        // Notificar a Clientes.jsx para recargar la lista
        if (onClienteGuardado) onClienteGuardado();

        setForm({ id: "", nombre: "", email: "", telefono: "", direccion: "" });
      } else {
        setError(res?.message || "Ocurrió un error al guardar los datos");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="modal fade" id="clienteModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {form.id ? "Editar Cliente" : "Nuevo Cliente"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="cerrarModal"
              ></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-2">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Teléfono</label>
                <input
                  type="text"
                  className="form-control"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Dirección</label>
                <input
                  type="text"
                  className="form-control"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClienteModal;