<?php
require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['codigo_producto']) && !empty($data['nombre'])) {
    $codigo = $data['codigo_producto'];
    $nombre = $data['nombre'];
    $porcentaje = isset($data['porcentaje_venta']) ? $data['porcentaje_venta'] : 0.00;
    $categoria  = isset($data['categorias_id_categoria']) ? $data['categorias_id_categoria'] : 1;
    $marca      = isset($data['marca']) ? $data['marca'] : '';
    $peso       = isset($data['peso']) ? $data['peso'] : '';

    $stmt = $conexion->prepare("INSERT INTO productos (codigo_producto, nombre, porcentaje_venta, categorias_id_categoria, marca, peso) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssdiss", $codigo, $nombre, $porcentaje, $categoria, $marca, $peso);

    if ($stmt->execute()) {
        echo json_encode(["mensaje" => "Producto registrado exitosamente"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error al guardar producto: " . $stmt->error]);
    }
    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(["error" => "El código y el nombre son obligatorios"]);
}

$conexion->close();