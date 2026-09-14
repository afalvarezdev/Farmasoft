const BASE_URL = "http://localhost/farmasoft/backend";

// Obtener lista de clientes
export async function obtenerClientes() {
  try {
    const response = await fetch(`${BASE_URL}/clientes/listar.php`);
    if (!response.ok) throw new Error("Error al obtener clientes");
    return await response.json();
  } catch (error) {
    console.error("Error en la petición API:", error);
    throw error;
  }
}

// Crear un nuevo cliente
export async function crearCliente(cliente) {
  try {
    const response = await fetch(`${BASE_URL}/clientes/crear.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    });
    if (!response.ok) throw new Error("Error al crear cliente");
    return await response.json();
  } catch (error) {
    console.error("Error al crear cliente:", error);
    throw error;
  }
}

// Editar un cliente existente
export async function editarCliente(cliente) {
  try {
    const response = await fetch(`${BASE_URL}/clientes/editar.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    });
    if (!response.ok) throw new Error("Error al editar cliente");
    return await response.json();
  } catch (error) {
    console.error("Error al editar cliente:", error);
    throw error;
  }
}

// Eliminar un cliente por ID
export async function eliminarCliente(idCliente) {
  try {
    const response = await fetch(`${BASE_URL}/clientes/eliminar.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_cliente: idCliente })
    });
    if (!response.ok) throw new Error("Error al eliminar cliente");
    return await response.json();
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    throw error;
  }
}