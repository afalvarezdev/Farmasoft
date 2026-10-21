<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/database.php";

// Corregido a 'id_productos' en minúscula para que coincida con la base de datos
$sql = "SELECT id_productos, codigo_producto, nombre, porcentaje_venta, marca, peso FROM productos ORDER BY id_productos DESC";
$resultado = $conexion->query($sql);

$productos = array();
if ($resultado) {
    while ($fila = $resultado->fetch_assoc()) {
        $productos[] = $fila;
    }
}

echo json_encode($productos, JSON_UNESCAPED_UNICODE);
$conexion->close();