import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iniciarSesion } from '../services/api';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });
    setCargando(true);

    try {
      const respuesta = await iniciarSesion({ usuario, contrasenia });
      if (respuesta.success) {
        localStorage.setItem('usuarioLogueado', JSON.stringify(respuesta.usuario));
        navigate('/productos');
      } else {
        setMensaje({ tipo: 'danger', texto: respuesta.error || 'Credenciales inválidas' });
      }
    } catch (error) {
      setMensaje({ tipo: 'danger', texto: 'Error de conexión con el servidor' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center p-3" 
      style={{ 
        background: 'linear-gradient(135deg, #1d4ed8 0%, #10b981 50%, #1e40af 100%)' 
      }}
    >
      {/* // Contenedor principal con el degradado azul rey y verde claro. */}
      <div className="card border-0 shadow-lg p-4 p-md-5" style={{ width: '100%', maxWidth: '420px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.98)' }}>
        
        {/* // Logo de la empresa; se carga desde la ruta estática /logo.png de public. */}
        <div className="text-center mb-4">
          <div className="mb-3">
            <img 
              src="/logo.png" 
              alt="Logo Farmasoft" 
              className="img-fluid shadow-sm" 
              style={{ maxHeight: '95px', objectFit: 'contain', borderRadius: '12px' }} 
            />
          </div>
          {/* // Título y descripción del sistema. */}
          <h4 className="fw-bold tracking-tight mb-1" style={{ color: '#1d4ed8' }}>FARMASOFT</h4>
          <p className="text-muted small mb-0">Control integral con calidad profesional</p>
        </div>

        {/* // Alertas para mostrar mensajes de error o éxito de autenticación. */}
        {mensaje.texto && (
          <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show py-2 small`} role="alert">
            {mensaje.texto}
          </div>
        )}

        {/* // Formulario general de autenticación y envío del login. */}
        <form onSubmit={handleSubmit}>
          {/* // Campo de entrada para el nombre de usuario. */}
          <div className="mb-3">
            <label className="form-label text-secondary small fw-semibold">Usuario</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 rounded-start-pill ps-3 text-muted">👤</span>
              <input 
                type="text" 
                className="form-control bg-light border-start-0 rounded-end-pill py-2 px-3 shadow-none" 
                placeholder="Ingresa tu usuario"
                value={usuario} 
                onChange={(e) => setUsuario(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* // Campo de entrada para la contraseña. */}
          <div className="mb-4">
            <label className="form-label text-secondary small fw-semibold">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 rounded-start-pill ps-3 text-muted">🔒</span>
              <input 
                type="password" 
                className="form-control bg-light border-start-0 rounded-end-pill py-2 px-3 shadow-none" 
                placeholder="Ingresa tu contraseña"
                value={contrasenia} 
                onChange={(e) => setContrasenia(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* // Botón para enviar el formulario; muestra el spinner mientras carga. */}
          <button 
            type="submit" 
            className="btn w-100 py-2 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 text-white"
            style={{ backgroundColor: '#1d4ed8', borderColor: '#1d4ed8', transition: 'all 0.3s ease' }}
            disabled={cargando}
          >
            {cargando ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Ingresando...</span>
              </>
            ) : (
              <span>Ingresar al Sistema</span>
            )}
          </button>
        </form>

        {/* // Pie de página con el año y los derechos reservados. */}
        <div className="text-center mt-4">
          <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>&copy; 2026 Farmasoft ERP. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;