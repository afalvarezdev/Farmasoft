<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);
$usuarioInput = $data['usuario'] ?? '';
$contraseniaInput = $data['contrasenia'] ?? '';

if (empty($usuarioInput) || empty($contraseniaInput)) {
    http_response_code(400);
    echo json_encode(["error" => "Por favor, completa todos los campos"]);
    exit();
}

// Consulta uniendo usuarios y roles para obtener el nombre del rol
$sql = "SELECT u.id_usuarios, u.nombre, u.usuario, u.contrasenia, u.estado, r.nombre_rol 
        FROM usuarios u 
        LEFT JOIN roles r ON u.roles_id_rol = r.id_rol 
        WHERE u.usuario = ?";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $usuarioInput);
$stmt->execute();
$resultado = $stmt->get_result();

if ($fila = $resultado->fetch_assoc()) {
    // Validar si el usuario está activo (estado = 1)
    if ($fila['estado'] != 1) {
        http_response_code(403);
        echo json_encode(["error" => "Tu usuario se encuentra inactivo"]);
        exit();
    }

    // Validación de contraseña (asumiendo texto plano o password_verify si usas hash)
    if ($contraseniaInput === $fila['contrasenia']) {
        echo json_encode([
            "success" => true,
            "mensaje" => "Inicio de sesión exitoso",
            "usuario" => [
                "id" => $fila['id_usuarios'],
                "nombre" => $fila['nombre'],
                "usuario" => $fila['usuario'],
                "rol" => $fila['nombre_rol']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Contraseña incorrecta"]);
    }
} else {
    http_response_code(404);
    echo json_encode(["error" => "El usuario no existe"]);
}

$stmt->close();
$conexion->close();
?>