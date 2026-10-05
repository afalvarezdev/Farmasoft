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

// Aceptar 'nombre_completo' o 'nombre'
$nombre = !empty($data['nombre_completo']) ? $data['nombre_completo'] : (!empty($data['nombre']) ? $data['nombre'] : '');
$telefono = $data['telefono'] ?? null;
$direccion = $data['direccion'] ?? null;

// Validación backend
if (empty($nombre)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "El nombre es obligatorio"
    ]);
    exit();
}

$stmt = $conexion->prepare("INSERT INTO clientes (nombre_completo, telefono, direccion) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $nombre, $telefono, $direccion);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Cliente creado correctamente",
        "id_cliente" => $stmt->insert_id
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al guardar en la base de datos: " . $stmt->error
    ]);
}

$stmt->close();
$conexion->close();