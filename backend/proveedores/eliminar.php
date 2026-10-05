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

if (!empty($data['id_proveedor'])) {
    $id = $data['id_proveedor'];

    $stmt = $conexion->prepare("DELETE FROM proveedores WHERE id_proveedor = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Proveedor eliminado con éxito"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error al eliminar: " . $stmt->error]);
    }
    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID no proporcionado"]);
}

$conexion->close();