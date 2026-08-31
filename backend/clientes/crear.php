<?php
require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['nombre_completo'])) {
    $nombre = $data['nombre_completo'];
    $telefono = isset($data['telefono']) ? $data['telefono'] : '';
    $direccion = isset($data['direccion']) ? $data['direccion'] : '';

    $stmt = $conexion->prepare("INSERT INTO clientes (nombre_completo, telefono, direccion) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $nombre, $telefono, $direccion);

    if ($stmt->execute()) {
        echo json_encode(["mensaje" => "Cliente creado con éxito", "id" => $stmt->insert_id]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error al insertar cliente: " . $stmt->error]);
    }
    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(["error" => "El nombre es obligatorio"]);
}

$conexion->close();