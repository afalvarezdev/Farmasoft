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

$proveedor_id = $data['id_proveedor'] ?? null;
$usuario_id = $data['id_usuario'] ?? 1; // ID por defecto para pruebas
$fecha = $data['fecha_compra'] ?? date('Y-m-d');
$total = $data['total_compra'] ?? 0;
$metodo_pago = $data['metodo_pago'] ?? 'Efectivo';
$detalles = $data['detalles'] ?? [];

if (empty($proveedor_id) || empty($detalles)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Proveedor y detalles son obligatorios"]);
    exit();
}

$conexion->begin_transaction();

try {
    // 1. Insertar en tabla compras
    $stmt = $conexion->prepare("INSERT INTO compras (fecha_compra, total_compra, metodo_pago, proveedores_id_proveedor, usuarios_id_usuarios) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sdsii", $fecha, $total, $metodo_pago, $proveedor_id, $usuario_id);
    $stmt->execute();
    $id_compra = $stmt->insert_id;
    $stmt->close();

    // 2. Insertar en tabla detalle_compras
    $stmtDetalle = $conexion->prepare("INSERT INTO detalle_compras (cantidad, precio_costo, subtotal, compras_id_compra, productos_id_productos, fecha_caducidad) VALUES (?, ?, ?, ?, ?, ?)");

    foreach ($detalles as $item) {
        $cantidad = $item['cantidad'];
        $precio = $item['precio_costo'];
        $subtotal = $cantidad * $precio;
        $id_producto = $item['id_producto'];
        $caducidad = !empty($item['fecha_caducidad']) ? $item['fecha_caducidad'] : date('Y-m-d');

        $stmtDetalle->bind_param("iddiis", $cantidad, $precio, $subtotal, $id_compra, $id_producto, $caducidad);
        $stmtDetalle->execute();
    }
    $stmtDetalle->close();

    $conexion->commit();
    echo json_encode(["success" => true, "message" => "Compra registrada correctamente", "id_compra" => $id_compra]);
} catch (Exception $e) {
    $conexion->rollback();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al registrar la compra: " . $e->getMessage()]);
}

$conexion->close();