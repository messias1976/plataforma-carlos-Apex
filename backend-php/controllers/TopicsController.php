<?php
// backend-php/controllers/TopicsController.php

class TopicsController {
    private static function getDb() {
        return Database::getConnection();
    }

    public static function getAll() {
        try {
            $subjectId = getQueryParam('subject_id');
            $db = self::getDb();

            $sql = '
                SELECT id, title as name, description, data 
                FROM contents 
                WHERE type = "topic"
            ';
            $params = [];

            if ($subjectId) {
                $sql .= ' AND data->"$.subject_id" = ?';
                $params[] = $subjectId;
            }

            $sql .= ' ORDER BY id';

            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $topics = $stmt->fetchAll();

            respondSuccess($topics, 'Tópicos retrieved successfully');
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
                WHERE id = ? AND type = "topic"
            ');
            $stmt->execute([$id]);
            $topic = $stmt->fetch();

            if (!$topic) {
                respondError('Tópico não encontrado', 404);
            }

            respondSuccess($topic, 'Tópico retrieved successfully');
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }

    public static function getCount() {
        try {
            $subjectId = getQueryParam('subject_id');
            $db = self::getDb();

            if (!$subjectId) {
                // Count all topics
                $stmt = $db->query('SELECT COUNT(*) as count FROM contents WHERE type = "topic"');
            } else {
                $stmt = $db->prepare('
                    SELECT COUNT(*) as count FROM contents 
                    WHERE type = "topic" AND data->"$.subject_id" = ?
                ');
                $stmt->execute([$subjectId]);
            }

            $result = $stmt->fetch();
            respondSuccess(['count' => $result['count']], 'Contagem de tópicos');
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
                VALUES (?, "topic", ?, ?, NOW())
            ');

            $contentData = json_encode(array_diff_key($data, array_flip(['name', 'title', 'description'])));
            $stmt->execute([$title, $description, $contentData]);

            $id = $db->lastInsertId();
            respondSuccess(['id' => $id], 'Tópico criado com sucesso', 201);
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
                WHERE id = ? AND type = "topic"
            ');

            $stmt->execute([$title, $description, $contentData, $id]);

            if ($stmt->rowCount() === 0) {
                respondError('Tópico não encontrado', 404);
            }

            respondSuccess([], 'Tópico atualizado com sucesso');
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }

    public static function delete($id) {
        $user = requireAuth();

        try {
            $db = self::getDb();
            $stmt = $db->prepare('DELETE FROM contents WHERE id = ? AND type = "topic"');
            $stmt->execute([$id]);

            if ($stmt->rowCount() === 0) {
                respondError('Tópico não encontrado', 404);
            }

            respondSuccess([], 'Tópico deletado com sucesso');
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }
}

?>
