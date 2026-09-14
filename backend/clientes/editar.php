<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

// Validaciones
if (empty($data['id']) && empty($data['id_cliente'])) {
    echo json_encode([
        "success" => false,
        "message" => "ID requerido"
    ]);
    exit;
}

if (empty($data['nombre']) && empty($data['nombre_completo'])) {
    echo json_encode([
        "success" => false,
        "message" => "El nombre es obligatorio"
    ]);
    exit;
}

$id = $data['id'] ?? $data['id_cliente'];
$nombre = $data['nombre'] ?? $data['nombre_completo'];
$email = $data['email'] ?? null;
$telefono = $data['telefono'] ?? null;
$direccion = $data['direccion'] ?? null;

try {
    $sql = "UPDATE clientes SET 
            nombre = :nombre, 
            email = :email, 
            telefono = :telefono, 
            direccion = :direccion 
            WHERE id = :id OR id_cliente = :id";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":id"        => $id,
        ":nombre"    => $nombre,
        ":email"     => $email,
        ":telefono"  => $telefono,
        ":direccion" => $direccion
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Cliente actualizado correctamente"
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error en la base de datos: " . $e->getMessage()
    ]);
}