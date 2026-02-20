<?php
// backend-php/controllers/AuthController.php

require_once __DIR__ . '/../models/User.php';

class AuthController {
    public static function login() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            respondError('Método não permitido', 405);
        }

        $data = getJsonBody();
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');

        if (empty($email) || empty($password)) {
            respondError('Email e senha são obrigatórios', 400);
        }

        try {
            error_log("LOGIN ATTEMPT: Email=" . $email);
            
            $user = new User();
            $userData = $user->login($email, $password);
            
            error_log("LOGIN RESULT: userData=" . json_encode($userData));

            if (!$userData) {
                error_log("LOGIN FAILED: Credenciais inválidas para " . $email);
                respondError('Email ou senha inválidos', 401);
            }

            $token = JWT::encode([
                'user_id' => $userData['user_id'],
                'email' => $email,
                'full_name' => $userData['full_name']
            ]);

            error_log("LOGIN SUCCESS: user_id=" . $userData['user_id']);
            
            respondSuccess([
                'token' => $token,
                'user' => $userData
            ], 'Login realizado com sucesso', 200);
        } catch (Exception $e) {
            error_log("LOGIN ERROR: " . $e->getMessage());
            respondError($e->getMessage(), 500);
        }
    }

    public static function register() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            respondError('Método não permitido', 405);
        }

        $data = getJsonBody();
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');
        $fullName = trim((string) ($data['full_name'] ?? ''));

        if (empty($email) || empty($password) || empty($fullName)) {
            respondError('Email, senha e nome completo são obrigatórios', 400);
        }

        if (strlen($password) < 6) {
            respondError('Senha deve ter no mínimo 6 caracteres', 400);
        }

        try {
            $user = new User();
            $userId = $user->register($email, $password, $fullName);

            if (!$userId) {
                respondError('Erro ao registrar usuário', 500);
            }

            $token = JWT::encode([
                'user_id' => $userId,
                'email' => $email,
                'full_name' => $fullName
            ]);

            $userData = $user->getById($userId);

            respondSuccess([
                'token' => $token,
                'user' => $userData
            ], 'Usuário registrado com sucesso', 201);
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }

    public static function registerBulk() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            respondError('Método não permitido', 405);
        }

        $user = requireAuth();
        $data = getJsonBody();
        $users = $data['users'] ?? [];

        if (empty($users) || !is_array($users)) {
            respondError('Array "users" é obrigatório', 400);
        }

        try {
            $userModel = new User();
            $createdUsers = [];
            $errors = [];

            foreach ($users as $index => $userData) {
                try {
                    $email = $userData['email'] ?? '';
                    $password = $userData['password'] ?? '';
                    $fullName = $userData['full_name'] ?? '';

                    if (empty($email) || empty($password) || empty($fullName)) {
                        $errors[] = "Usuário $index: Email, senha e nome completo são obrigatórios";
                        continue;
                    }

                    $userId = $userModel->register($email, $password, $fullName);
                    if ($userId) {
                        $createdUsers[] = ['user_id' => $userId, 'email' => $email];
                    }
                } catch (Exception $e) {
                    $errors[] = "Usuário $index: " . $e->getMessage();
                }
            }

            respondSuccess([
                'created' => count($createdUsers),
                'users' => $createdUsers,
                'errors' => $errors
            ], 'Registros em massa completos', 201);
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }
}

?>
