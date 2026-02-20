<?php
// backend-php/index.php

// Enable error reporting for debugging (REMOVER EM PRODUÇÃO)
error_reporting(E_ALL);
ini_set('display_errors', '1');

// Load environment variables
if (file_exists(__DIR__ . '/.env')) {
    $env = parse_ini_file(__DIR__ . '/.env');
    foreach ($env as $key => $value) {
        $_ENV[$key] = $value;
    }
} else {
    // Se não encontrar .env, retornar erro JSON
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'error' => 'Arquivo .env não encontrado em: ' . __DIR__ . '/.env'
    ]);
    exit;
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

$allowedOrigins = array_map('trim', explode(',', $_ENV['CORS_ALLOWED_ORIGINS'] ?? 'http://localhost:5173'));

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH");

// espelha os headers pedidos pelo browser
if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
    header("Access-Control-Allow-Headers: " . $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']);
} else {
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
}

header('Vary: Origin');
header('Content-Type: application/json; charset=utf-8');

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    require_once __DIR__ . '/helpers/response.php';
    require_once __DIR__ . '/helpers/jwt.php';
    require_once __DIR__ . '/config/database.php';
    require_once __DIR__ . '/routes/api.php';
} catch (Throwable $e) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erro ao carregar arquivos: ' . $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
    exit;
}