<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

// Si no se selecciona cliente, se guarda como NULL (Cliente General / Ocasional)
$id_cliente = !empty($data['id_cliente']) ? $data['id_cliente'] : null;
$id_usuario = $data['id_usuario'] ?? 1; 
$tipo_pago = $data['tipo_pago'] ?? 'Contado';
$medio_pago = $data['medio_pago'] ?? 'Efectivo';
$subtotal = $data['subtotal'] ?? 0;
$impuesto = $data['impuesto'] ?? 0;
$total = $data['total'] ?? 0;
$detalles = $data['detalles'] ?? [];

if (empty($detalles)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Debes agregar al menos un producto a la venta"]);
    exit();
}

$conexion->begin_transaction();

try {
    // 1. Insertar la cabecera de la venta (CLIENTES_id_cliente puede ser NULL)
    $stmt = $conexion->prepare("INSERT INTO ventas (subtotal, impuesto, total, tipo_pago, medio_pago, CLIENTES_id_cliente, usuarios_id_usuarios) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    // Usamos tipos dinámicos o i/NULL para el cliente
    if ($id_cliente === null) {
        // Nota: en mysqli bind_param para null requiere cuidado, asegurémonos de pasar la variable correcta
    }
    
    // Forma segura universal con bind_param manejando null en PHP:
    $stmt->close();
    
    $stmt = $conexion->prepare("INSERT INTO ventas (subtotal, impuesto, total, tipo_pago, medio_pago, CLIENTES_id_cliente, usuarios_id_usuarios) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("dddsdii", $subtotal, $impuesto, $total, $tipo_pago, $medio_pago, $id_cliente, $id_usuario);
    $stmt->execute();
    $id_venta = $stmt->insert_id;
    $stmt->close();

    // 2. Insertar el detalle de la venta (Usando 'precio_unitario' y 'subtotal_item' acorde a tu base de datos)[cite: 6]
    $stmtDetalle = $conexion->prepare("INSERT INTO detalle_ventas (cantidad, precio_unitario, subtotal_item, ventas_id_Ventas, productos_id_productos) VALUES (?, ?, ?, ?, ?)");

    foreach ($detalles as $item) {
        $cantidad = $item['cantidad'];
        $precio = $item['precio_venta'];
        $subtotal_item = $cantidad * $precio;
        $id_producto = $item['id_producto'];

        $stmtDetalle->bind_param("iddii", $cantidad, $precio, $subtotal_item, $id_venta, $id_producto);
        $stmtDetalle->execute();
    }
    $stmtDetalle->close();

    $conexion->commit();
    echo json_encode(["success" => true, "message" => "Venta registrada con éxito", "id_venta" => $id_venta]);
} catch (Exception $e) {
    $conexion->rollback();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al registrar la venta: " . $e->getMessage()]);
}

$conexion->close();