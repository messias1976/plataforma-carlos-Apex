-- =====================================
-- RESETAR USUÁRIOS E CRIAR NOVAMENTE
-- =====================================

-- 1. LIMPAR DADOS EXISTENTES
DELETE FROM user_subscriptions WHERE user_id IN (SELECT id FROM users WHERE email IN ('messiasmachado1976@gmail.com', 'aluno@teste.com'));
DELETE FROM user_credentials WHERE email IN ('messiasmachado1976@gmail.com', 'aluno@teste.com');
DELETE FROM user_profiles WHERE user_id IN (SELECT id FROM users WHERE email IN ('messiasmachado1976@gmail.com', 'aluno@teste.com'));
DELETE FROM users WHERE email IN ('messiasmachado1976@gmail.com', 'aluno@teste.com');

-- 2. CRIAR USUÁRIO ADMIN
-- Email: messiasmachado1976@gmail.com
-- Senha: messias123
INSERT INTO users (id, email, password_hash, created_at, is_admin) VALUES
('admin-messias-2026', 'messiasmachado1976@gmail.com', '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhqe', NOW(), 1);

INSERT INTO user_credentials (user_id, email, password) VALUES
('admin-messias-2026', 'messiasmachado1976@gmail.com', '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhqe');

INSERT INTO user_profiles (user_id, full_name) VALUES
('admin-messias-2026', 'Messias Machado');

-- 3. CRIAR USUÁRIO ALUNO COM PLANO PREMIUM
-- Email: aluno@teste.com
-- Senha: aluno123
INSERT INTO users (id, email, password_hash, created_at, is_admin) VALUES
('aluno-premium-2026', 'aluno@teste.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), 0);

INSERT INTO user_credentials (user_id, email, password) VALUES
('aluno-premium-2026', 'aluno@teste.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO user_profiles (user_id, full_name) VALUES
('aluno-premium-2026', 'Aluno Teste Premium');

-- 4. CRIAR ASSINATURA PREMIUM PARA O ALUNO
INSERT INTO user_subscriptions (user_id, plan_type, status, start_date, end_date) VALUES
('aluno-premium-2026', 'premium', 'active', NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR));

-- 5. VERIFICAR CRIAÇÃO
SELECT 'USUARIOS' as tabela, id, email, is_admin FROM users WHERE email IN ('messiasmachado1976@gmail.com', 'aluno@teste.com')
UNION ALL
SELECT 'CREDENTIALS', user_id, email, 'senha-ok' FROM user_credentials WHERE email IN ('messiasmachado1976@gmail.com', 'aluno@teste.com')
UNION ALL
SELECT 'PROFILES', user_id, full_name, '-' FROM user_profiles WHERE user_id IN ('admin-messias-2026', 'aluno-premium-2026')
UNION ALL
SELECT 'SUBSCRIPTIONS', user_id, plan_type, status FROM user_subscriptions WHERE user_id = 'aluno-premium-2026';

-- =====================================
-- CREDENCIAIS PARA LOGIN:
-- =====================================
-- ADMIN:
--   Email: messiasmachado1976@gmail.com
--   Senha: messias123
--
-- ALUNO:
--   Email: aluno@teste.com  
--   Senha: aluno123
--   Plano: Premium (válido por 1 ano)
-- =====================================
