-- ============================================
-- EXECUTE ESTE SCRIPT NO PHPMYADMIN DO HOSTINGER
-- Database: u301359873_databaseSchema
-- ============================================

-- 1. Tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id VARCHAR(36) PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  birthdate DATE,
  xp INT DEFAULT 0,
  coins INT DEFAULT 0,
  level INT DEFAULT 1,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de credenciais (email + senha)
CREATE TABLE IF NOT EXISTS user_credentials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

-- 3. Planos disponíveis
CREATE TABLE IF NOT EXISTS plans (
  id VARCHAR(32) PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2),
  description TEXT,
  features JSON
);

-- 4. Assinaturas dos usuários
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36),
  plan_type VARCHAR(32) DEFAULT 'free',
  status VARCHAR(20) DEFAULT 'active',
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  FOREIGN KEY (plan_type) REFERENCES plans(id)
);

-- 5. Matérias
CREATE TABLE IF NOT EXISTS subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tópicos
CREATE TABLE IF NOT EXISTS topics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- 7. Conteúdo dos tópicos
CREATE TABLE IF NOT EXISTS topic_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  topic_id INT NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  video_url TEXT,
  audio_url TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

-- 8. Progresso do usuário
CREATE TABLE IF NOT EXISTS user_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36),
  topic_id INT,
  content_id INT,
  completed BOOLEAN DEFAULT FALSE,
  progress DECIMAL(5,2) DEFAULT 0,
  last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
  FOREIGN KEY (content_id) REFERENCES topic_content(id) ON DELETE CASCADE
);

-- ============================================
-- DADOS INICIAIS
-- ============================================

-- Inserir planos
INSERT INTO plans (id, name, price, description, features) VALUES
('free', 'Gratuito', 0.00, 'Plano gratuito', '["Acesso básico"]'),
('standard', 'Padrão', 29.90, 'Plano padrão', '["Acesso completo"]'),
('premium', 'Premium', 49.90, 'Plano premium', '["Acesso total"]')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- IMPORTANTE: Gere as senhas com bcrypt primeiro!
-- Você precisa executar PHP para gerar os hashes:
-- password_hash('messias1976', PASSWORD_BCRYPT)
-- password_hash('aluno123', PASSWORD_BCRYPT)

-- Por enquanto, use senhas temporárias (TROCAR DEPOIS!)
-- Hash BCrypt de 'password123': $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

-- Usuário Admin
INSERT INTO user_profiles (user_id, full_name, is_admin, created_at) VALUES
('admin-001', 'Messias Machado', TRUE, NOW())
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

INSERT INTO user_credentials (user_id, email, password, created_at) VALUES
('admin-001', 'messiasmachado1976@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW())
ON DUPLICATE KEY UPDATE password=VALUES(password);

-- Usuário Aluno
INSERT INTO user_profiles (user_id, full_name, is_admin, created_at) VALUES
('aluno-001', 'Aluno Teste', FALSE, NOW())
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

INSERT INTO user_credentials (user_id, email, password, created_at) VALUES
('aluno-001', 'aluno@teste.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW())
ON DUPLICATE KEY UPDATE password=VALUES(password);

INSERT INTO user_subscriptions (user_id, plan_type, status, start_date, end_date) VALUES
('aluno-001', 'premium', 'active', NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR))
ON DUPLICATE KEY UPDATE end_date=VALUES(end_date);

-- ============================================
-- FIM DO SCRIPT
-- ============================================
