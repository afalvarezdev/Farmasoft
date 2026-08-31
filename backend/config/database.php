<?php
// Permite que React (Frontend) pueda realizar peticiones a PHP (Backend)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Manejo de peticiones previas (Preflight OPTIONS) de los navegadores
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "127.0.0.1"; 
$usuario = "root";
$contrasenia = "";
$base_datos = "farmasoft";
$puerto = 3306; // Puerto estándar actualizado

// Crear conexión mysqli
$conexion = new mysqli($host, $usuario, $contrasenia, $base_datos, $puerto);

// Verificar la conexión
if ($conexion->connect_error) {
    echo json_encode(["error" => "Error de conexión: " . $conexion->connect_error]);
    exit();
}

$conexion->set_charset("utf8");