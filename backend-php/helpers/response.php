<?php
// backend-php/helpers/response.php

function respond($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

function respondSuccess($data, $message = 'Sucesso', $statusCode = 200) {
    respond([
        'success' => true,
        'message' => $message,
        'data' => $data
    ], $statusCode);
}

function respondError($message, $statusCode = 400, $errors = null) {
    respond([
        'success' => false,
        'error' => $message,
        'errors' => $errors
    ], $statusCode);
}

function getJsonBody() {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?? [];
}

function getQueryParam($key, $default = null) {
    return $_GET[$key] ?? $default;
}

?>
