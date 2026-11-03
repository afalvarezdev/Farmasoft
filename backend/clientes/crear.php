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

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "El cuerpo de la solicitud debe ser un JSON válido"
    ]);
    exit();
}

// Aceptar 'nombre_completo' o 'nombre'
$nombre = $data['nombre_completo'] ?? $data['nombre'] ?? '';
$identificacion = $data['identificacion'] ?? null;
$correo = $data['correo'] ?? null;
$telefono = $data['telefono'] ?? '';
$direccion = $data['direccion'] ?? null;

if (!is_string($nombre) || trim($nombre) === '' || strlen(trim($nombre)) > 50) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "El nombre es obligatorio y no debe superar 50 caracteres"
    ]);
    exit();
}
$nombre = trim($nombre);

if ($identificacion !== null && !is_string($identificacion)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "La identificación no es válida"
    ]);
    exit();
}
$identificacion = $identificacion !== null ? trim($identificacion) : '';
if (strlen($identificacion) > 30 || ($identificacion !== '' && !preg_match('/^[\p{L}\p{N} .\/-]+$/u', $identificacion))) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "La identificación no es válida"
    ]);
    exit();
}
$identificacion = $identificacion !== '' ? $identificacion : null;

if ($correo !== null && !is_string($correo)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "El correo no es válido"
    ]);
    exit();
}
$correo = $correo !== null ? trim($correo) : '';
if (strlen($correo) > 254 || ($correo !== '' && filter_var($correo, FILTER_VALIDATE_EMAIL) === false)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "El correo no es válido"
    ]);
    exit();
}
$correo = $correo !== '' ? $correo : null;

if (!is_string($telefono)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "El teléfono no es válido"
    ]);
    exit();
}
$telefono = trim($telefono);
if (strlen($telefono) > 15 || ($telefono !== '' && !preg_match('/^\+?[0-9(). -]+$/D', $telefono))) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "El teléfono no es válido"
    ]);
    exit();
}

if ($direccion !== null && !is_string($direccion)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "La dirección no es válida"
    ]);
    exit();
}
$direccion = $direccion !== null ? trim($direccion) : null;
if ($direccion !== null && strlen($direccion) > 50) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "La dirección no debe superar 50 caracteres"
    ]);
    exit();
}

$stmt = $conexion->prepare("INSERT INTO clientes (nombre_completo, identificacion, correo, telefono, direccion) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $nombre, $identificacion, $correo, $telefono, $direccion);

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