<?php
require_once "../config/database.php";

$sql = "SELECT Id_productos, codigo_producto, nombre, porcentaje_venta, marca, peso FROM productos ORDER BY Id_productos DESC";
$resultado = $conexion->query($sql);

$productos = array();
if ($resultado) {
    while ($fila = $resultado->fetch_assoc()) {
        $productos[] = $fila;
    }
}

echo json_encode($productos, JSON_UNESCAPED_UNICODE);
$conexion->close();