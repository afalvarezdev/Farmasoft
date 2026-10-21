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

$id = $data['id_rol'] ?? null;
$nombre_rol = $data['nombre_rol'] ?? null;
$descripcion = $data['descripcion'] ?? null;
$estado = isset($data['estado']) ? (int)$data['estado'] : 1;

if (empty($id) || empty($nombre_rol)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID y nombre del rol son obligatorios"]);
    exit();
}

$stmt = $conexion->prepare("UPDATE roles SET nombre_rol = ?, descripcion = ?, estado = ? WHERE id_rol = ?");
$stmt->bind_param("ssii", $nombre_rol, $descripcion, $estado, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Rol actualizado correctamente"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al actualizar: " . $stmt->error]);
}

$stmt->close();
$conexion->close();