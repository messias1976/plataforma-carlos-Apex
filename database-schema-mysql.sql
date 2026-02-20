-- Estrutura adaptada para MySQL

-- Perfis de usuário
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id VARCHAR(36) PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  birthdate DATE,
  xp INT DEFAULT 0,
  coins INT DEFAULT 0,
  level INT DEFAULT 1,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Credenciais de usuário (email + password hash)
CREATE TABLE IF NOT EXISTS user_credentials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

-- Planos disponíveis
CREATE TABLE IF NOT EXISTS plans (
  id VARCHAR(32) PRIMARY KEY, -- 'free', 'standard', 'premium'
  name TEXT NOT NULL,
  price DECIMAL(10,2),
  description TEXT,
  features JSON
);

-- Assinaturas dos usuários
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36),
  plan_type VARCHAR(32),
  status TEXT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id),
  FOREIGN KEY (plan_type) REFERENCES plans(id)
);

-- Conteúdos (tópicos, aulas, provas, etc.)
CREATE TABLE IF NOT EXISTS contents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT,
  description TEXT,
  data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progresso do usuário em conteúdos
CREATE TABLE IF NOT EXISTS user_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36),
  content_id INT,
  progress DECIMAL(5,2),
  last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id),
  FOREIGN KEY (content_id) REFERENCES contents(id)
);

-- Ranking global
CREATE TABLE IF NOT EXISTS rankings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36),
  score INT DEFAULT 0,
  position INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id)
);

-- Torneios
CREATE TABLE IF NOT EXISTS tournaments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Participantes de torneios
CREATE TABLE IF NOT EXISTS tournament_participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tournament_id INT,
  user_id VARCHAR(36),
  score INT DEFAULT 0,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id)
);

-- Feedbacks
CREATE TABLE IF NOT EXISTS feedbacks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id)
);

-- Transações financeiras
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36),
  type TEXT,
  amount DECIMAL(10,2),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id)
);

-- Notificações
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36),
  title TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id)
);

-- Logs de atividades
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36),
  action TEXT,
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id)
);

-- Relacionamento de conteúdos (ex: tópicos filhos)
CREATE TABLE IF NOT EXISTS content_relations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parent_content_id INT,
  child_content_id INT,
  FOREIGN KEY (parent_content_id) REFERENCES contents(id),
  FOREIGN KEY (child_content_id) REFERENCES contents(id)
);

-- Tabela para mensagens entre usuários (opcional)
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id VARCHAR(36),
  receiver_id VARCHAR(36),
  content TEXT,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES user_profiles(user_id),
  FOREIGN KEY (receiver_id) REFERENCES user_profiles(user_id)
);

-- Tabela para conquistas (badges)
CREATE TABLE IF NOT EXISTS achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT
);

-- Conquistas dos usuários
CREATE TABLE IF NOT EXISTS user_achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36),
  achievement_id INT,
  achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id),
  FOREIGN KEY (achievement_id) REFERENCES achievements(id)
);
