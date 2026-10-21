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

$nombre_rol = $data['nombre_rol'] ?? '';
$descripcion = $data['descripcion'] ?? null;
$estado = isset($data['estado']) ? (int)$data['estado'] : 1;

if (empty($nombre_rol)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "El nombre del rol es obligatorio"]);
    exit();
}

$stmt = $conexion->prepare("INSERT INTO roles (nombre_rol, descripcion, estado) VALUES (?, ?, ?)");
$stmt->bind_param("ssi", $nombre_rol, $descripcion, $estado);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Rol creado correctamente", "id_rol" => $stmt->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al guardar: " . $stmt->error]);
}

$stmt->close();
$conexion->close();