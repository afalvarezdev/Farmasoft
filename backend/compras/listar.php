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

$sql = "SELECT c.id_compra, c.fecha_compra, c.total_compra, c.metodo_pago, 
               p.nombre AS nombre_proveedor
        FROM compras c
        INNER JOIN proveedores p ON c.proveedores_id_proveedor = p.id_proveedor
        ORDER BY c.id_compra DESC";

$resultado = $conexion->query($sql);

if ($resultado) {
    $compras = array();
    while ($fila = $resultado->fetch_assoc()) {
        $compras[] = $fila;
    }
    echo json_encode($compras, JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error en la consulta: " . $conexion->error]);
}

$conexion->close();