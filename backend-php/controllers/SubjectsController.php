<?php
// backend-php/controllers/SubjectsController.php

class SubjectsController {
    private static function getDb() {
        return Database::getConnection();
    }

    private static function hasColumn($table, $column) {
        $db = self::getDb();
        $stmt = $db->prepare("SHOW COLUMNS FROM `{$table}` LIKE ?");
        $stmt->execute([$column]);
        return (bool) $stmt->fetchColumn();
    }

    public static function getAll() {
        try {
            $db = self::getDb();
            $hasDataColumn = self::hasColumn('contents', 'data');

            $sql = $hasDataColumn
                ? 'SELECT id, title as name, description, data FROM contents WHERE type = "subject" OR type = "module" ORDER BY id'
                : 'SELECT id, title as name, description FROM contents WHERE type = "subject" OR type = "module" ORDER BY id';

            $stmt = $db->query($sql);
            $subjects = $stmt->fetchAll();

            $normalized = array_map(function ($row) {
                $data = [];
                if (!empty($row['data'])) {
                    $decoded = json_decode($row['data'], true);
                    if (is_array($decoded)) {
                        $data = $decoded;
                    }
                }

                return array_merge($row, $data);
            }, $subjects);

            respondSuccess($normalized, 'Assuntos retrieved successfully');
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }

    public static function getById($id) {
        try {
            $db = self::getDb();
            $hasDataColumn = self::hasColumn('contents', 'data');
            $sql = $hasDataColumn
                ? 'SELECT id, title as name, description, data FROM contents WHERE id = ? AND (type = "subject" OR type = "module")'
                : 'SELECT id, title as name, description FROM contents WHERE id = ? AND (type = "subject" OR type = "module")';

            $stmt = $db->prepare($sql);
            $stmt->execute([$id]);
            $subject = $stmt->fetch();

            if (!$subject) {
                respondError('Assunto não encontrado', 404);
            }

            if (!empty($subject['data'])) {
                $decoded = json_decode($subject['data'], true);
                if (is_array($decoded)) {
                    $subject = array_merge($subject, $decoded);
                }
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
            $hasDataColumn = self::hasColumn('contents', 'data');

            if ($hasDataColumn) {
                $stmt = $db->prepare('
                    INSERT INTO contents (title, type, description, data, created_at)
                    VALUES (?, "subject", ?, ?, NOW())
                ');

                $contentData = json_encode(array_diff_key($data, array_flip(['name', 'title', 'description'])));
                $stmt->execute([$title, $description, $contentData]);
            } else {
                $stmt = $db->prepare('
                    INSERT INTO contents (title, type, description, created_at)
                    VALUES (?, "subject", ?, NOW())
                ');
                $stmt->execute([$title, $description]);
            }

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
            $hasDataColumn = self::hasColumn('contents', 'data');

            if ($hasDataColumn) {
                $contentData = json_encode(array_diff_key($data, array_flip(['name', 'title', 'description'])));

                $stmt = $db->prepare('
                    UPDATE contents 
                    SET title = ?, description = ?, data = ?
                    WHERE id = ? AND (type = "subject" OR type = "module")
                ');

                $stmt->execute([$title, $description, $contentData, $id]);
            } else {
                $stmt = $db->prepare('
                    UPDATE contents 
                    SET title = ?, description = ?
                    WHERE id = ? AND (type = "subject" OR type = "module")
                ');

                $stmt->execute([$title, $description, $id]);
            }

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
