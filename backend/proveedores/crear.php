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

$nombre = $data['nombre'] ?? '';
$direccion = $data['direccion'] ?? null;
$telefono = $data['telefono'] ?? null;
$email = $data['email'] ?? null;

if (empty($nombre)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "El nombre del proveedor es obligatorio"]);
    exit();
}

$stmt = $conexion->prepare("INSERT INTO proveedores (nombre, direccion, telefono, email) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $nombre, $direccion, $telefono, $email);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Proveedor creado correctamente", "id_proveedor" => $stmt->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al guardar: " . $stmt->error]);
}

$stmt->close();
$conexion->close();