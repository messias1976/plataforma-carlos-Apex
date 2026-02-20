<?php
require_once __DIR__ . '/../config/database.php';

class User {
    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    private function tableExists($tableName) {
        $stmt = $this->db->prepare('SHOW TABLES LIKE ?');
        $stmt->execute([$tableName]);
        return (bool) $stmt->fetchColumn();
    }

    private function generateUuid() {
        $stmt = $this->db->query('SELECT UUID() as id');
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['id'];
    }

    private function upsertCredentials($userId, $email, $passwordHash) {
        if (!$this->tableExists('user_credentials')) {
            return true;
        }

        $check = $this->db->prepare('SELECT user_id FROM user_credentials WHERE user_id = ?');
        $check->execute([$userId]);

        if ($check->fetch()) {
            $stmt = $this->db->prepare('UPDATE user_credentials SET email = ?, password = ? WHERE user_id = ?');
            return $stmt->execute([$email, $passwordHash, $userId]);
        }

        $stmt = $this->db->prepare('INSERT INTO user_credentials (user_id, email, password, created_at) VALUES (?, ?, ?, NOW())');
        return $stmt->execute([$userId, $email, $passwordHash]);
    }

    public function register($email, $password, $fullName) {
        $email = strtolower(trim($email));
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        $this->db->beginTransaction();

        try {
            $checkStmt = $this->db->prepare('SELECT id FROM users WHERE email = ? COLLATE utf8mb4_unicode_ci');
            $checkStmt->execute([$email]);

            if ($checkStmt->fetch()) {
                $this->db->rollBack();
                return false;
            }

            $userId = $this->generateUuid();

            $insertUser = $this->db->prepare('INSERT INTO users (id, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, NOW())');
            $insertUser->execute([$userId, $email, $passwordHash, 'student']);

            if ($this->tableExists('user_profiles')) {
                $insertProfile = $this->db->prepare('INSERT INTO user_profiles (user_id, full_name, created_at) VALUES (?, ?, NOW())');
                $insertProfile->execute([$userId, $fullName ?: explode('@', $email)[0]]);
            }

            $this->upsertCredentials($userId, $email, $passwordHash);

            $this->db->commit();
            return $userId;
        } catch (Exception $e) {
            $this->db->rollBack();
            error_log('Register Error: ' . $e->getMessage());
            return false;
        }
    }

    public function login($email, $password) {
        $email = strtolower(trim($email));

        $sql = '
            SELECT
                id,
                email,
                password_hash,
                role,
                created_at
            FROM users
            WHERE email = ? COLLATE utf8mb4_unicode_ci
            LIMIT 1
        ';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            return null;
        }

        if (!password_verify($password, $user['password_hash'])) {
            return null;
        }

        unset($user['password_hash']);

        $profileData = [];
        if ($this->tableExists('user_profiles')) {
            $profileStmt = $this->db->prepare('SELECT full_name, avatar_url, xp, coins, level, phone, birthdate, language_preference FROM user_profiles WHERE user_id = ?');
            $profileStmt->execute([$user['id']]);
            $profileData = $profileStmt->fetch(PDO::FETCH_ASSOC) ?: [];
        }

        $userData = array_merge($user, $profileData);
        $userData['user_id'] = $userData['id'];
        $userData['is_admin'] = ($userData['role'] ?? '') === 'admin';

        return $userData;
    }

    public function getById($userId) {
        $sql = '
            SELECT
                u.id as user_id,
                u.email,
                u.role,
                u.created_at,
                up.full_name,
                up.avatar_url,
                up.phone,
                up.birthdate,
                up.language_preference,
                up.xp,
                up.coins,
                up.level
            FROM users u
            LEFT JOIN user_profiles up ON up.user_id = u.id
            WHERE u.id = ?
            LIMIT 1
        ';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return null;
        }

        $row['is_admin'] = ($row['role'] ?? '') === 'admin';
        return $row;
    }

    public function update($userId, $updateData) {
        if (!$this->tableExists('user_profiles')) {
            return false;
        }

        $allowedFields = ['full_name', 'phone', 'birthdate', 'avatar_url', 'xp', 'coins', 'level', 'language_preference'];
        $fields = [];
        $params = [];

        foreach ($updateData as $field => $value) {
            if (in_array($field, $allowedFields, true)) {
                $fields[] = "$field = ?";
                $params[] = $value;
            }
        }

        if (empty($fields)) {
            return false;
        }

        $params[] = $userId;

        $sql = 'UPDATE user_profiles SET ' . implode(', ', $fields) . ' WHERE user_id = ?';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return true;
    }
}
