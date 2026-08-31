<?php
require_once "../config/database.php";

$sql = "SELECT id_cliente, nombre_completo, telefono, direccion FROM clientes ORDER BY id_cliente DESC";
$resultado = $conexion->query($sql);

if ($resultado) {
    $clientes = array();
    while ($fila = $resultado->fetch_assoc()) {
        $clientes[] = $fila;
    }
    echo json_encode($clientes, JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error en la consulta: " . $conexion->error]);
}

$conexion->close();