<?php
// backend-php/controllers/TopicsController.php

class TopicsController {
    private static function getDb() {
        return Database::getConnection();
    }

    private static function hasColumn($table, $column) {
        $db = self::getDb();
        $stmt = $db->prepare("SHOW COLUMNS FROM `{$table}` LIKE ?");
        $stmt->execute([$column]);
        return (bool) $stmt->fetchColumn();
    }

    private static function tableExists($table) {
        $db = self::getDb();
        $stmt = $db->prepare('SHOW TABLES LIKE ?');
        $stmt->execute([$table]);
        return (bool) $stmt->fetchColumn();
    }

    public static function getAll() {
        try {
            $subjectId = getQueryParam('subject_id');
            $db = self::getDb();
            $hasDataColumn = self::hasColumn('contents', 'data');
            $hasSubjectIdColumn = self::hasColumn('contents', 'subject_id');

            $sql = $hasDataColumn
                ? 'SELECT id, title as name, description, data FROM contents WHERE type = "topic"'
                : 'SELECT id, title as name, description FROM contents WHERE type = "topic"';
            $params = [];

            if ($subjectId) {
                if ($hasDataColumn) {
                    $sql .= ' AND JSON_UNQUOTE(JSON_EXTRACT(data, "$.subject_id")) = ?';
                    $params[] = (string) $subjectId;
                } elseif ($hasSubjectIdColumn) {
                    $sql .= ' AND subject_id = ?';
                    $params[] = $subjectId;
                }
            }

            $sql .= ' ORDER BY id';

            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $topics = $stmt->fetchAll();

            $normalized = array_map(function ($row) {
                $data = [];
                if (!empty($row['data'])) {
                    $decoded = json_decode($row['data'], true);
                    if (is_array($decoded)) {
                        $data = $decoded;
                    }
                }

                return array_merge($row, $data);
            }, $topics);

            if (empty($normalized) && self::tableExists('topics')) {
                $legacySql = 'SELECT id, title as name, description, subject_id FROM topics';
                $legacyParams = [];
                if ($subjectId) {
                    $legacySql .= ' WHERE subject_id = ?';
                    $legacyParams[] = $subjectId;
                }
                $legacySql .= ' ORDER BY id';

                $legacyStmt = $db->prepare($legacySql);
                $legacyStmt->execute($legacyParams);
                $legacyTopics = $legacyStmt->fetchAll();

                $normalized = array_map(function ($row) {
                    return [
                        'id' => $row['id'],
                        'name' => $row['name'],
                        'title' => $row['name'],
                        'description' => $row['description'] ?? null,
                        'subject_id' => $row['subject_id'] ?? null,
                    ];
                }, $legacyTopics);
            }

            respondSuccess($normalized, 'Tópicos retrieved successfully');
        } catch (Exception $e) {
            respondError($e->getMessage(), 500);
        }
    }

    public static function getById($id) {
        try {
            $db = self::getDb();
            $hasDataColumn = self::hasColumn('contents', 'data');
            $sql = $hasDataColumn
                ? 'SELECT id, title as name, description, data FROM contents WHERE id = ? AND type = "topic"'
                : 'SELECT id, title as name, description FROM contents WHERE id = ? AND type = "topic"';

            $stmt = $db->prepare($sql);
            $stmt->execute([$id]);
            $topic = $stmt->fetch();

            if (!$topic && self::tableExists('topics')) {
                $legacyStmt = $db->prepare('SELECT id, title as name, description, subject_id FROM topics WHERE id = ? LIMIT 1');
                $legacyStmt->execute([$id]);
                $legacyTopic = $legacyStmt->fetch();

                if ($legacyTopic) {
                    $topic = [
                        'id' => $legacyTopic['id'],
                        'name' => $legacyTopic['name'],
                        'title' => $legacyTopic['name'],
                        'description' => $legacyTopic['description'] ?? null,
                        'subject_id' => $legacyTopic['subject_id'] ?? null,
                    ];
                }
            }

            if (!$topic) {
                respondError('Tópico não encontrado', 404);
            }

            if (!empty($topic['data'])) {
                $decoded = json_decode($topic['data'], true);
                if (is_array($decoded)) {
                    $topic = array_merge($topic, $decoded);
                }
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
            $hasDataColumn = self::hasColumn('contents', 'data');
            $hasSubjectIdColumn = self::hasColumn('contents', 'subject_id');

            if (!$subjectId) {
                // Count all topics
                $stmt = $db->query('SELECT COUNT(*) as count FROM contents WHERE type = "topic"');
            } else {
                if ($hasDataColumn) {
                    $stmt = $db->prepare('
                        SELECT COUNT(*) as count FROM contents 
                        WHERE type = "topic" AND JSON_UNQUOTE(JSON_EXTRACT(data, "$.subject_id")) = ?
                    ');
                    $stmt->execute([(string) $subjectId]);
                } elseif ($hasSubjectIdColumn) {
                    $stmt = $db->prepare('
                        SELECT COUNT(*) as count FROM contents 
                        WHERE type = "topic" AND subject_id = ?
                    ');
                    $stmt->execute([$subjectId]);
                } else {
                    $stmt = $db->query('SELECT 0 as count');
                }
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
            $hasDataColumn = self::hasColumn('contents', 'data');

            if ($hasDataColumn) {
                $stmt = $db->prepare('
                    INSERT INTO contents (title, type, description, data, created_at)
                    VALUES (?, "topic", ?, ?, NOW())
                ');

                $contentData = json_encode(array_diff_key($data, array_flip(['name', 'title', 'description'])));
                $stmt->execute([$title, $description, $contentData]);
            } else {
                $stmt = $db->prepare('
                    INSERT INTO contents (title, type, description, created_at)
                    VALUES (?, "topic", ?, NOW())
                ');
                $stmt->execute([$title, $description]);
            }

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
            $hasDataColumn = self::hasColumn('contents', 'data');

            if ($hasDataColumn) {
                $contentData = json_encode(array_diff_key($data, array_flip(['name', 'title', 'description'])));

                $stmt = $db->prepare('
                    UPDATE contents 
                    SET title = ?, description = ?, data = ?
                    WHERE id = ? AND type = "topic"
                ');

                $stmt->execute([$title, $description, $contentData, $id]);
            } else {
                $stmt = $db->prepare('
                    UPDATE contents 
                    SET title = ?, description = ?
                    WHERE id = ? AND type = "topic"
                ');

                $stmt->execute([$title, $description, $id]);
            }

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
