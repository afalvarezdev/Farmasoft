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

if (!empty($data['codigo_producto']) && !empty($data['nombre'])) {
    $codigo     = $data['codigo_producto'];
    $nombre     = $data['nombre'];
    $porcentaje = isset($data['porcentaje_venta']) && $data['porcentaje_venta'] !== '' ? $data['porcentaje_venta'] : 0.00;
    $categoria  = isset($data['categorias_id_categoria']) ? $data['categorias_id_categoria'] : 1;
    $marca      = isset($data['marca']) ? $data['marca'] : '';
    $peso       = isset($data['peso']) ? $data['peso'] : '';

    $stmt = $conexion->prepare("INSERT INTO productos (codigo_producto, nombre, porcentaje_venta, categorias_id_categoria, marca, peso) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssdiss", $codigo, $nombre, $porcentaje, $categoria, $marca, $peso);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "mensaje" => "Producto registrado exitosamente",
            "id_producto" => $stmt->insert_id
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error" => "Error al guardar producto: " . $stmt->error
        ]);
    }
    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "El código y el nombre son obligatorios"
    ]);
}

$conexion->close();