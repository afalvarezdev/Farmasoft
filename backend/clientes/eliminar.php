<?php
require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['id_cliente'])) {
    $id = $data['id_cliente'];

    $stmt = $conexion->prepare("DELETE FROM clientes WHERE id_cliente = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["mensaje" => "Cliente eliminado con éxito"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error al eliminar: " . $stmt->error]);
    }
    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(["error" => "ID no proporcionado"]);
}

$conexion->close();