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

$tipo = $_GET['tipo'] ?? 'ventas';
$fecha_inicio = $_GET['fecha_inicio'] ?? date('Y-m-01'); // Primer día del mes actual por defecto
$fecha_fin = $_GET['fecha_fin'] ?? date('Y-m-d');        // Día de hoy por defecto
$id_proveedor = $_GET['id_proveedor'] ?? '';

try {
    if ($tipo === 'ventas') {
        $sql = "SELECT v.id_Ventas, v.fecha, COALESCE(c.nombre, 'Cliente General / Ocasional') AS cliente, 
                       v.tipo_pago, v.medio_pago, v.total
                FROM ventas v
                LEFT JOIN clientes c ON v.CLIENTES_id_cliente = c.id_cliente
                WHERE DATE(v.fecha) BETWEEN ? AND ?
                ORDER BY v.fecha DESC";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("ss", $fecha_inicio, $fecha_fin);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $datos = $resultado->fetch_all(MYSQLI_ASSOC);

    } elseif ($tipo === 'compras') {
        $sql = "SELECT c.id_Compras, c.fecha, p.nombre AS proveedor, c.total
                FROM compras c
                INNER JOIN proveedores p ON c.proveedores_id_proveedores = p.id_proveedores
                WHERE DATE(c.fecha) BETWEEN ? AND ?
                ORDER BY c.fecha DESC";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("ss", $fecha_inicio, $fecha_fin);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $datos = $resultado->fetch_all(MYSQLI_ASSOC);

    } elseif ($tipo === 'inventario') {
        if (!empty($id_proveedor)) {
            $sql = "SELECT pr.id_productos, pr.nombre, pr.precio, pr.stock, p.nombre AS proveedor
                    FROM productos pr
                    INNER JOIN proveedores p ON pr.proveedores_id_proveedores = p.id_proveedores
                    WHERE pr.proveedores_id_proveedores = ?
                    ORDER BY pr.nombre ASC";
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("i", $id_proveedor);
        } else {
            $sql = "SELECT pr.id_productos, pr.nombre, pr.precio, pr.stock, p.nombre AS proveedor
                    FROM productos pr
                    LEFT JOIN proveedores p ON pr.proveedores_id_proveedores = p.id_proveedores
                    ORDER BY pr.nombre ASC";
            $stmt = $conexion->prepare($sql);
        }
        $stmt->execute();
        $resultado = $stmt->get_result();
        $datos = $resultado->fetch_all(MYSQLI_ASSOC);
    } else {
        $datos = [];
    }

    echo json_encode(["success" => true, "data" => $datos]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al generar reporte: " . $e->getMessage()]);
}

$conexion->close();