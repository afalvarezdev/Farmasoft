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
// ==========================================
// MÓDULO DE PRODUCTOS / INVENTARIO
// ==========================================

// Obtener lista de productos
export async function obtenerProductos() {
  try {
    const response = await fetch(`${BASE_URL}/productos/listar.php`);
    if (!response.ok) throw new Error("Error al obtener productos");
    return await response.json();
  } catch (error) {
    console.error("Error en la petición API:", error);
    throw error;
  }
}

// Crear un nuevo producto
export async function crearProducto(producto) {
  try {
    const response = await fetch(`${BASE_URL}/productos/crear.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    });
    if (!response.ok) throw new Error("Error al crear producto");
    return await response.json();
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
}

// Editar un producto existente
export async function editarProducto(producto) {
  try {
    const response = await fetch(`${BASE_URL}/productos/editar.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto)
    });
    if (!response.ok) throw new Error("Error al editar producto");
    return await response.json();
  } catch (error) {
    console.error("Error al editar producto:", error);
    throw error;
  }
}

// Eliminar un producto por ID
export async function eliminarProducto(idProducto) {
  try {
    const response = await fetch(`${BASE_URL}/productos/eliminar.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_producto: idProducto })
    });
    if (!response.ok) throw new Error("Error al eliminar producto");
    return await response.json();
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
}

// --- PROVEEDORES ---
export async function obtenerProveedores() {
  try {
    const response = await fetch(`${BASE_URL}/proveedores/listar.php`);
    if (!response.ok) throw new Error("Error al obtener proveedores");
    return await response.json();
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    throw error;
  }
}

export async function crearProveedor(proveedor) {
  try {
    const response = await fetch(`${BASE_URL}/proveedores/crear.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proveedor),
    });
    if (!response.ok) throw new Error("Error al crear proveedor");
    return await response.json();
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    throw error;
  }
}

export async function editarProveedor(proveedor) {
  try {
    const response = await fetch(`${BASE_URL}/proveedores/editar.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proveedor),
    });
    if (!response.ok) throw new Error("Error al editar proveedor");
    return await response.json();
  } catch (error) {
    console.error("Error al editar proveedor:", error);
    throw error;
  }
}

export async function eliminarProveedor(idProveedor) {
  try {
    const response = await fetch(`${BASE_URL}/proveedores/eliminar.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_proveedor: idProveedor }),
    });
    if (!response.ok) throw new Error("Error al eliminar proveedor");
    return await response.json();
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    throw error;
  }
}

// --- COMPRAS ---
export async function obtenerCompras() {
  try {
    const response = await fetch(`${BASE_URL}/compras/listar.php`);
    if (!response.ok) throw new Error("Error al obtener compras");
    return await response.json();
  } catch (error) {
    console.error("Error al obtener compras:", error);
    throw error;
  }
}

export async function crearCompra(compra) {
  try {
    const response = await fetch(`${BASE_URL}/compras/crear.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(compra),
    });
    if (!response.ok) throw new Error("Error al registrar la compra");
    return await response.json();
  } catch (error) {
    console.error("Error al registrar la compra:", error);
    throw error;
  }
}