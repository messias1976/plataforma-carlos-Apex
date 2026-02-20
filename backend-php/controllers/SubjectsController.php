<?php
// backend-php/controllers/SubjectsController.php

class SubjectsController {
    private static function getDb() {
        return Database::getConnection();
    }

    public static function getAll() {
        try {
            $db = self::getDb();
            $stmt = $db->query('
                SELECT id, title as name, description, data 
                FROM contents 
                WHERE type = "subject" OR type = "module"
                ORDER BY id
            ');
            $subjects = $stmt->fetchAll();
            respondSuccess($subjects, 'Assuntos retrieved successfully');
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }

    public static function getById($id) {
        try {
            $db = self::getDb();
            $stmt = $db->prepare('
                SELECT id, title as name, description, data 
                FROM contents 
                WHERE id = ? AND (type = "subject" OR type = "module")
            ');
            $stmt->execute([$id]);
            $subject = $stmt->fetch();

            if (!$subject) {
                respondError('Assunto não encontrado', 404);
            }

            respondSuccess($subject, 'Assunto retrieved successfully');
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }

    public static function create() {
        $user = requireAuth();

        try {
            $data = getJsonBody();
            $title = $data['name'] ?? $data['title'] ?? '';
            $description = $data['description'] ?? '';

            if (empty($title)) {
                respondError('Título é obrigatório', 400);
            }

            $db = self::getDb();
            $stmt = $db->prepare('
                INSERT INTO contents (title, type, description, data, created_at)
                VALUES (?, "subject", ?, ?, NOW())
            ');

            $contentData = json_encode(array_diff_key($data, array_flip(['name', 'title', 'description'])));
            $stmt->execute([$title, $description, $contentData]);

            $id = $db->lastInsertId();

            respondSuccess(['id' => $id], 'Assunto criado com sucesso', 201);
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }

    public static function update($id) {
        $user = requireAuth();

        try {
            $data = getJsonBody();
            $title = $data['name'] ?? $data['title'] ?? '';
            $description = $data['description'] ?? '';

            if (empty($title)) {
                respondError('Título é obrigatório', 400);
            }

            $db = self::getDb();
            $contentData = json_encode(array_diff_key($data, array_flip(['name', 'title', 'description'])));
            
            $stmt = $db->prepare('
                UPDATE contents 
                SET title = ?, description = ?, data = ?
                WHERE id = ? AND (type = "subject" OR type = "module")
            ');

            $stmt->execute([$title, $description, $contentData, $id]);

            if ($stmt->rowCount() === 0) {
                respondError('Assunto não encontrado', 404);
            }

            respondSuccess([], 'Assunto atualizado com sucesso');
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }

    public static function delete($id) {
        $user = requireAuth();

        try {
            $db = self::getDb();
            $stmt = $db->prepare('
                DELETE FROM contents 
                WHERE id = ? AND (type = "subject" OR type = "module")
            ');

            $stmt->execute([$id]);

            if ($stmt->rowCount() === 0) {
                respondError('Assunto não encontrado', 404);
            }

            respondSuccess([], 'Assunto deletado com sucesso');
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }
}

?>
