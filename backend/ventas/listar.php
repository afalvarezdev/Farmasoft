<?php
ini_set('display_errors', 0);
error_reporting(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config/database.php";

$sql = "SELECT v.id_Ventas AS id_venta, v.fecha, v.subtotal, v.impuesto, v.total, v.tipo_pago, v.medio_pago,
               COALESCE(c.nombre_completo, 'Cliente General / Ocasional') AS nombre_cliente
        FROM ventas v
        LEFT JOIN clientes c ON v.CLIENTES_id_cliente = c.id_cliente
        ORDER BY v.id_Ventas DESC";

$resultado = $conexion->query($sql);

if ($resultado) {
    $ventas = array();
    while ($fila = $resultado->fetch_assoc()) {
        $ventas[] = $fila;
    }
    echo json_encode($ventas, JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error en la consulta: " . $conexion->error]);
}

$conexion->close();
?>