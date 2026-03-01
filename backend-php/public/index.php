<?php
// backend-php/index.php

// Erros em JSON: loga no servidor e evita HTML no body da API
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

function requireFirstExisting(array $paths) {
    foreach ($paths as $path) {
        if (file_exists($path)) {
            require_once $path;
            return;
        }
    }

    throw new RuntimeException('Arquivo obrigatório não encontrado. Tentativas: ' . implode(', ', $paths));
}

set_error_handler(function ($severity, $message, $file, $line) {
    if (!(error_reporting() & $severity)) {
        return false;
    }
    throw new ErrorException($message, 0, $severity, $file, $line);
});

// Load environment variables
$envPath = null;
$envCandidates = [
    __DIR__ . '/.env',
    __DIR__ . '/../.env',
];

foreach ($envCandidates as $candidate) {
    if (file_exists($candidate)) {
        $envPath = $candidate;
        break;
    }
}

if ($envPath !== null) {
    $env = parse_ini_file($envPath);
    if ($env === false) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Não foi possível ler o arquivo .env em: ' . $envPath
        ]);
        exit;
    }

    foreach ($env as $key => $value) {
        $_ENV[$key] = $value;
    }
} else {
    // Se não encontrar .env, retornar erro JSON
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'error' => 'Arquivo .env não encontrado. Tentativas: ' . implode(', ', $envCandidates)
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
    requireFirstExisting([
        __DIR__ . '/helpers/response.php',
        __DIR__ . '/../helpers/response.php',
    ]);
    requireFirstExisting([
        __DIR__ . '/helpers/jwt.php',
        __DIR__ . '/../helpers/jwt.php',
    ]);
    requireFirstExisting([
        __DIR__ . '/config/database.php',
        __DIR__ . '/../config/database.php',
    ]);
    requireFirstExisting([
        __DIR__ . '/routes/api.php',
        __DIR__ . '/../routes/api.php',
    ]);
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