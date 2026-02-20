<?php
// backend-php/routes/api.php

// Router simples
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

// DEBUG temporário
error_log("REQUEST_URI: " . $requestUri);
error_log("Path original: " . $path);

// Remover prefixos comuns
$path = str_replace('/backend-php/public', '', $path);
$path = str_replace('/backend-php', '', $path);
$path = str_replace('/api', '', $path); // Adicionar remoção de /api
$path = preg_replace('|^/|', '', $path);

error_log("Path processado: " . $path);
error_log("Method: " . $method);

// Load controllers
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/SubjectsController.php';
require_once __DIR__ . '/../controllers/TopicsController.php';
require_once __DIR__ . '/../controllers/TopicContentController.php';
require_once __DIR__ . '/../controllers/SubscriptionsController.php';
require_once __DIR__ . '/../controllers/UserController.php';
require_once __DIR__ . '/../controllers/UploadsController.php';

// Parse route
$parts = explode('/', rtrim($path, '/'));
$resource = $parts[0] ?? '';
$id = $parts[1] ?? null;
$action = $parts[2] ?? null;

// Routes
try {
    // Auth Routes
    if ($resource === 'auth') {
        if ($path === 'auth/login' && $method === 'POST') {
            AuthController::login();
        } elseif ($path === 'auth/register' && $method === 'POST') {
            AuthController::register();
        } elseif ($path === 'auth/register/bulk' && $method === 'POST') {
            AuthController::registerBulk();
        } else {
            respondError('Rota não encontrada. Path: ' . $path . ', Method: ' . $method, 404);
        }
    }
    // User Routes
    elseif ($resource === 'user') {
        if ($path === 'user/profile' && $method === 'GET') {
            UserController::getProfile();
        } elseif ($path === 'user/profile' && $method === 'PUT') {
            UserController::updateProfile();
        } else {
            respondError('Rota não encontrada', 404);
        }
    }
    // Subjects Routes
    elseif ($resource === 'subjects') {
        if ($method === 'GET' && !$id) {
            SubjectsController::getAll();
        } elseif ($method === 'GET' && $id) {
            SubjectsController::getById($id);
        } elseif ($method === 'POST') {
            SubjectsController::create();
        } elseif ($method === 'PUT' && $id) {
            SubjectsController::update($id);
        } elseif ($method === 'DELETE' && $id) {
            SubjectsController::delete($id);
        } else {
            respondError('Rota não encontrada', 404);
        }
    }
    // Topics Routes
    elseif ($resource === 'topics') {
        if ($method === 'GET' && !$id) {
            TopicsController::getAll();
        } elseif ($method === 'GET' && $id === 'count') {
            TopicsController::getCount();
        } elseif ($method === 'GET' && $id) {
            TopicsController::getById($id);
        } elseif ($method === 'POST') {
            TopicsController::create();
        } elseif ($method === 'PUT' && $id) {
            TopicsController::update($id);
        } elseif ($method === 'DELETE' && $id) {
            TopicsController::delete($id);
        } else {
            respondError('Rota não encontrada', 404);
        }
    }
    // Topic Content Routes
    elseif ($resource === 'topic-content') {
        if ($method === 'GET' && !$id) {
            TopicContentController::getAll();
        } elseif ($method === 'GET' && $id) {
            TopicContentController::getById($id);
        } elseif ($method === 'POST') {
            TopicContentController::create();
        } elseif ($method === 'PUT' && $id) {
            TopicContentController::update($id);
        } elseif ($method === 'DELETE' && $id === 'bulk') {
            TopicContentController::bulkDelete();
        } elseif ($method === 'DELETE' && $id) {
            TopicContentController::delete($id);
        } else {
            respondError('Rota não encontrada', 404);
        }
    }
    // Content Routes (alias de compatibilidade com frontend legado)
    elseif ($resource === 'content') {
        if ($method === 'GET' && !$id) {
            if (isset($_GET['moduleId']) && !isset($_GET['topic_id'])) {
                $_GET['topic_id'] = $_GET['moduleId'];
            }
            TopicContentController::getAll();
        } elseif ($method === 'GET' && $id) {
            TopicContentController::getById($id);
        } elseif ($method === 'POST') {
            TopicContentController::create();
        } elseif ($method === 'PUT' && $id) {
            TopicContentController::update($id);
        } elseif ($method === 'DELETE' && $id === 'bulk') {
            TopicContentController::bulkDelete();
        } elseif ($method === 'DELETE' && $id) {
            TopicContentController::delete($id);
        } else {
            respondError('Rota não encontrada', 404);
        }
    }
    // Subscriptions Routes
    elseif ($resource === 'subscriptions') {
        if ($method === 'GET' && !$id) {
            SubscriptionsController::getAll();
        } elseif ($method === 'GET' && $id === 'stats' && $action === 'overview') {
            SubscriptionsController::getStats();
        } elseif ($method === 'GET' && $id === 'user') {
            SubscriptionsController::getByUserId($action);
        } elseif ($method === 'GET' && $id) {
            SubscriptionsController::getById($id);
        } elseif ($method === 'POST') {
            SubscriptionsController::create();
        } elseif ($method === 'PUT' && $id) {
            SubscriptionsController::update($id);
        } else {
            respondError('Rota não encontrada', 404);
        }
    }
    // AI Routes (placeholders)
    elseif ($resource === 'ai') {
        if ($path === 'ai/generate-exam' && $method === 'POST') {
            respondSuccess([], 'Exam generation endpoint');
        } elseif ($path === 'ai/chat' && $method === 'POST') {
            respondSuccess([], 'Chat endpoint');
        } else {
            respondError('Rota não encontrada', 404);
        }
    }
    // Uploads Routes
    elseif ($resource === 'uploads') {
        if ($method === 'POST' && !$id) {
            UploadsController::upload();
        } elseif ($method === 'GET' && $id) {
            UploadsController::getFile($id);
        } else {
            respondError('Rota não encontrada', 404);
        }
    }
    // Health check
    elseif ($path === '' || $path === '/') {
        respondSuccess(['status' => 'API running'], 'API is healthy');
    }
    else {
        respondError('Rota não encontrada: ' . $path, 404);
    }
} catch (Exception $e) {
    respondError('Erro do servidor: ' . $e->getMessage(), 500);
}

?>
