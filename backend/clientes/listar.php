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

$sql = "SELECT id_cliente, identificacion, nombre_completo, correo, telefono, direccion FROM clientes ORDER BY id_cliente DESC";
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