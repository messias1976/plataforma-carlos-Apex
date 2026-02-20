<?php
// backend-php/controllers/TopicContentController.php

class TopicContentController {
    private static function getDb() {
        return Database::getConnection();
    }

    public static function getAll() {
        try {
            $topicId = getQueryParam('topic_id');
            $db = self::getDb();

            $sql = '
                SELECT id, title, description, data 
                FROM contents 
                WHERE type = "lesson" OR type = "content"
            ';
            $params = [];

            if ($topicId) {
                $sql .= ' AND data->"$.topic_id" = ?';
                $params[] = $topicId;
            }

            $sql .= ' ORDER BY id';

            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $contents = $stmt->fetchAll();

            respondSuccess($contents, 'Conteúdos retrieved successfully');
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }

    public static function getById($id) {
        try {
            $db = self::getDb();
            $stmt = $db->prepare('
                SELECT id, title, description, data 
                FROM contents 
                WHERE id = ? AND (type = "lesson" OR type = "content")
            ');
            $stmt->execute([$id]);
            $content = $stmt->fetch();

            if (!$content) {
                respondError('Conteúdo não encontrado', 404);
            }

            respondSuccess($content, 'Conteúdo retrieved successfully');
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }

    public static function create() {
        $user = requireAuth();

        try {
            $data = getJsonBody();
            $title = $data['title'] ?? '';
            $description = $data['description'] ?? '';

            if (empty($title)) {
                respondError('Título é obrigatório', 400);
            }

            $db = self::getDb();
            $stmt = $db->prepare('
                INSERT INTO contents (title, type, description, data, created_at)
                VALUES (?, "content", ?, ?, NOW())
            ');

            $contentData = json_encode(array_diff_key($data, array_flip(['title', 'description'])));
            $stmt->execute([$title, $description, $contentData]);

            $id = $db->lastInsertId();
            respondSuccess(['id' => $id], 'Conteúdo criado com sucesso', 201);
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }

    public static function update($id) {
        $user = requireAuth();

        try {
            $data = getJsonBody();
            $title = $data['title'] ?? '';
            $description = $data['description'] ?? '';

            if (empty($title)) {
                respondError('Título é obrigatório', 400);
            }

            $db = self::getDb();
            $contentData = json_encode(array_diff_key($data, array_flip(['title', 'description'])));
            
            $stmt = $db->prepare('
                UPDATE contents 
                SET title = ?, description = ?, data = ?
                WHERE id = ? AND (type = "lesson" OR type = "content")
            ');

            $stmt->execute([$title, $description, $contentData, $id]);

            if ($stmt->rowCount() === 0) {
                respondError('Conteúdo não encontrado', 404);
            }

            respondSuccess([], 'Conteúdo atualizado com sucesso');
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
                WHERE id = ? AND (type = "lesson" OR type = "content")
            ');
            $stmt->execute([$id]);

            if ($stmt->rowCount() === 0) {
                respondError('Conteúdo não encontrado', 404);
            }

            respondSuccess([], 'Conteúdo deletado com sucesso');
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }

    public static function bulkDelete() {
        $user = requireAuth();

        try {
            $data = getJsonBody();
            $ids = $data['ids'] ?? [];

            if (empty($ids) || !is_array($ids)) {
                respondError('Array de IDs é obrigatório', 400);
            }

            $db = self::getDb();
            $placeholders = implode(',', array_fill(0, count($ids), '?'));
            
            $stmt = $db->prepare("
                DELETE FROM contents 
                WHERE id IN ($placeholders) AND (type = 'lesson' OR type = 'content')
            ");

            $stmt->execute($ids);

            respondSuccess(['deleted' => $stmt->rowCount()], 'Conteúdos deletados com sucesso');
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }
}

?>
