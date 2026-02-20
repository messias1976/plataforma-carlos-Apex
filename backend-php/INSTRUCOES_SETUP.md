# 🚀 PASSOS PARA CONFIGURAR O BANCO DE DADOS

## 1️⃣ Gerar Hashes das Senhas

**Opção A - No servidor:**
1. Faça upload do arquivo `gerar-hash.php` para a pasta `api/` no servidor
2. Acesse: `https://api.apexestudos.com/gerar-hash.php`
3. Copie os hashes gerados

**Opção B - Localmente (se tiver PHP instalado):**
1. Execute localmente: `php -S localhost:8000 gerar-hash.php`
2. Abra: `http://localhost:8000/gerar-hash.php`
3. Copie os hashes gerados

## 2️⃣ Criar Tabelas no Banco de Dados

1. Acesse o **painel do Hostinger** → **Bancos de Dados** → **phpMyAdmin**
2. Selecione o banco: `u301359873_databaseSchema`
3. Clique em **SQL** no menu superior
4. Copie todo o conteúdo do arquivo `SETUP_DATABASE.sql`
5. Cole na área de texto e clique em **Executar**

## 3️⃣ Atualizar Senhas dos Usuários

Depois de criar as tabelas, atualize as senhas com os hashes gerados:

```sql
-- Substitua 'HASH_AQUI' pelos hashes que você copiou no passo 1

-- Senha do admin: messias1976
UPDATE user_credentials 
SET password = 'HASH_AQUI' 
WHERE email = 'messiasmachado1976@gmail.com';

-- Senha do aluno: aluno123
UPDATE user_credentials 
SET password = 'HASH_AQUI' 
WHERE email = 'aluno@teste.com';
```

## 4️⃣ Testar o Login

Abra `https://apexestudos.com` e tente fazer login com:

**Admin:**
- Email: `messiasmachado1976@gmail.com`
- Senha: `messias1976`

**Aluno:**
- Email: `aluno@teste.com`
- Senha: `aluno123`

## ⚠️ IMPORTANTE

Depois que tudo funcionar, **REMOVA** o arquivo `gerar-hash.php` do servidor por segurança!

---

## 🔍 Verificar se Deu Certo

Execute no phpMyAdmin para verificar:

```sql
-- Ver usuários criados
SELECT * FROM user_profiles;

-- Ver credenciais
SELECT user_id, email FROM user_credentials;

-- Ver assinaturas
SELECT * FROM user_subscriptions;
```
