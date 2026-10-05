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

$id = $data['id_proveedor'] ?? $data['id'] ?? null;
$nombre = $data['nombre'] ?? null;
$direccion = $data['direccion'] ?? null;
$telefono = $data['telefono'] ?? null;
$email = $data['email'] ?? null;

if (empty($id) || empty($nombre)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID y nombre son obligatorios"]);
    exit();
}

$stmt = $conexion->prepare("UPDATE proveedores SET nombre = ?, direccion = ?, telefono = ?, email = ? WHERE id_proveedor = ?");
$stmt->bind_param("ssssi", $nombre, $direccion, $telefono, $email, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Proveedor actualizado correctamente"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al actualizar: " . $stmt->error]);
}

$stmt->close();
$conexion->close();