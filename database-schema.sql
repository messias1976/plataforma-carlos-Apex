-- Estrutura completa para plataforma educacional (Supabase/PostgreSQL)

-- Usuários (auth.users já existe no Supabase)

-- Perfis de usuário
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  birthdate DATE,
  xp INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Planos disponíveis
CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY, -- 'free', 'standard', 'premium'
  name TEXT NOT NULL,
  price NUMERIC,
  description TEXT,
  features JSONB
);

-- Assinaturas dos usuários
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT REFERENCES plans(id),
  status TEXT, -- 'active', 'expired', etc.
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Conteúdos (tópicos, aulas, provas, etc.)
CREATE TABLE IF NOT EXISTS contents (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT, -- 'topic', 'exam', 'lesson', etc.
  description TEXT,
  data JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Progresso do usuário em conteúdos
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id INTEGER REFERENCES contents(id) ON DELETE CASCADE,
  progress NUMERIC, -- 0 a 1 ou percentual
  last_accessed TIMESTAMP DEFAULT now()
);

-- Ranking global
CREATE TABLE IF NOT EXISTS rankings (
  id SERIAL PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  position INTEGER,
  updated_at TIMESTAMP DEFAULT now()
);

-- Torneios
CREATE TABLE IF NOT EXISTS tournaments (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Participantes de torneios
CREATE TABLE IF NOT EXISTS tournament_participants (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  joined_at TIMESTAMP DEFAULT now()
);

-- Feedbacks
CREATE TABLE IF NOT EXISTS feedbacks (
  id SERIAL PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Transações financeiras
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT, -- 'payment', 'refund', etc.
  amount NUMERIC,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Notificações
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  message TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- Logs de atividades
CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT,
  details JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Relacionamento de conteúdos (ex: tópicos filhos)
CREATE TABLE IF NOT EXISTS content_relations (
  id SERIAL PRIMARY KEY,
  parent_content_id INTEGER REFERENCES contents(id) ON DELETE CASCADE,
  child_content_id INTEGER REFERENCES contents(id) ON DELETE CASCADE
);

-- Tabela para mensagens entre usuários (opcional)
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  sent_at TIMESTAMP DEFAULT now()
);

-- Tabela para conquistas (badges)
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT
);

-- Conquistas dos usuários
CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
  achieved_at TIMESTAMP DEFAULT now()
);
