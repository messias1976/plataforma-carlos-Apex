<?php
// backend-php/controllers/UserController.php

require_once __DIR__ . '/../models/User.php';

class UserController {
    public static function getProfile() {
        $user = requireAuth();

        try {
            $userModel = new User();
            $userData = $userModel->getById($user['user_id']);

            if (!$userData) {
                respondError('Usuário não encontrado', 404);
            }

            respondSuccess($userData, 'Perfil retrieved successfully');
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }

    public static function updateProfile() {
        $user = requireAuth();

        try {
            $data = getJsonBody();
            
            // Define which fields can be updated
            $allowedFields = ['full_name', 'phone', 'birthdate', 'avatar_url', 'xp', 'coins', 'level'];
            $updateData = [];

            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $updateData[$field] = $data[$field];
                }
            }

            if (empty($updateData)) {
                respondError('Nenhum campo para atualizar', 400);
            }

            $userModel = new User();
            $result = $userModel->update($user['user_id'], $updateData);

            if (!$result) {
                respondError('Erro ao atualizar perfil', 500);
            }

            $userData = $userModel->getById($user['user_id']);
            respondSuccess($userData, 'Perfil atualizado com sucesso');
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }
}

?>
