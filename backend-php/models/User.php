<?php
require_once __DIR__ . '/../config/database.php';

class User {

    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function register($email, $password, $fullName) {

        $email = strtolower(trim($email));
        $hash = password_hash($password, PASSWORD_BCRYPT);
        $userId = bin2hex(random_bytes(18));

        $stmt = $this->db->prepare("
            INSERT INTO user_profiles (user_id, full_name, created_at)
            VALUES (?, ?, NOW())
        ");
        $stmt->execute([$userId, $fullName]);

        $this->storeCredentials($userId, $email, $hash);

        return $userId;
    }
    
    // Em backend-php/models/User.php

class User {
    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    // --- NOVO MÉTODO DE REGISTO ---
    public function register($email, $password, $fullName) {
        $email = strtolower(trim($email));
        
        // Inicia a transação
        $this->db->beginTransaction();

        try {
            // 1. Verifica se o email já existe
            $stmt = $this->db->prepare('SELECT id FROM users WHERE email = ? COLLATE utf8mb4_unicode_ci');
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                $this->db->rollBack(); // Desfaz a transação
                return ['success' => false, 'error' => 'Este email já está em uso.'];
            }

            // 2. Hash da senha
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            
            // 3. Gera um UUID para o novo usuário
            // (Vamos usar a função UUID() do MySQL para simplicidade aqui)

            // 4. Insere na tabela 'users'
            $stmt = $this->db->prepare("
                INSERT INTO users (id, email, password_hash, role) 
                VALUES (UUID(), ?, ?, 'aluno')
            ");
            $stmt->execute([$email, $passwordHash]);
            
            // 5. Pega o ID do usuário que acabámos de criar
            $userId = $this->db->lastInsertId();
            // NOTA: lastInsertId() com UUID() pode não ser fiável. Vamos buscar o ID.
            $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $createdUser = $stmt->fetch();
            $userId = $createdUser['id'];


            // 6. Insere na tabela 'user_profiles'
            $stmt = $this->db->prepare("
                INSERT INTO user_profiles (user_id, full_name) 
                VALUES (?, ?)
            ");
            $stmt->execute([$userId, $fullName ?: explode('@', $email)[0]]);

            // 7. Se tudo correu bem, confirma a transação
            $this->db->commit();
            
            return ['success' => true];

        } catch (Exception $e) {
            // Se algo falhar, desfaz tudo
            $this->db->rollBack();
            error_log("Register Error: " . $e->getMessage());
            return ['success' => false, 'error' => 'Erro interno do servidor ao registar.'];
        }
    }

    // O seu método login(...) continua aqui...
    public function login($email, $password) {
        // ... (código do login que já corrigimos)
    }
}


   // Em backend-php/models/User.php

public function login($email, $password) {
    // Limpa e padroniza o email
    $email = strtolower(trim($email));

    // --- VERSÃO CORRIGIDA ---

    // 1. Prepara a consulta SQL para buscar na tabela 'users'
    //    Adicionamos COLLATE para garantir que o erro de collation não aconteça.
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

    // 2. Verifica se o usuário foi encontrado
    if (!$user) {
        error_log("Login attempt failed: User not found for email " . $email);
        return null; // Retorna nulo se o email não existir
    }

    // 3. Verifica se a senha enviada corresponde ao hash salvo no banco de dados
    if (!password_verify($password, $user['password_hash'])) {
        error_log("Login attempt failed: Invalid password for email " . $email);
        return null; // Retorna nulo se a senha estiver incorreta
    }

    // 4. Se tudo estiver correto, remove o hash da senha do array por segurança
    unset($user['password_hash']);

    // 5. Busca os dados do perfil na tabela 'user_profiles'
    //    Este passo é opcional, mas bom para ter o nome do usuário
    $profileStmt = $this->db->prepare('SELECT full_name, avatar_url FROM user_profiles WHERE user_id = ?');
    $profileStmt->execute([$user['id']]);
    $profileData = $profileStmt->fetch(PDO::FETCH_ASSOC);

    // Junta os dados do usuário com os dados do perfil
    $userData = array_merge($user, $profileData ?: []);

    // Renomeia 'id' para 'user_id' para ser consistente com o AuthController
    if (isset($userData['id'])) {
        $userData['user_id'] = $userData['id'];
        unset($userData['id']);
    }

    // 6. Retorna os dados completos do usuário
    return $userData;
}

    public function getById($userId) {

        $stmt = $this->db->prepare("
            SELECT up.user_id, up.full_name, uc.email, up.xp, up.coins, up.level
            FROM user_profiles up
            LEFT JOIN user_credentials uc ON uc.user_id = up.user_id
            WHERE up.user_id = ?
        ");

        $stmt->execute([$userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    private function storeCredentials($userId, $email, $hash) {

        $check = $this->db->prepare("SELECT user_id FROM user_credentials WHERE user_id=?");
        $check->execute([$userId]);

        if ($check->fetch()) {

            $stmt = $this->db->prepare("
                UPDATE user_credentials
                SET email=?, password=?
                WHERE user_id=?
            ");
            return $stmt->execute([$email, $hash, $userId]);

        } else {

            $stmt = $this->db->prepare("
                INSERT INTO user_credentials (user_id,email,password,created_at)
                VALUES (?,?,?,NOW())
            ");
            return $stmt->execute([$userId,$email,$hash]);
        }
    }
}
