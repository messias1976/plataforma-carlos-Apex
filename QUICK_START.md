# ⚡ Quick Start - API PHP + MySQL

## 📦 O que foi criado

✅ API completa em PHP com controllers, models, helpers
✅ Autenticação JWT
✅ Schema MySQL completo
✅ CORS configurado
✅ Frontend .env atualizado

---

## 🏃 5 Minutos para Começar

### 1. Instale pré-requisitos (já tem? Pule para 2)

**Opção Rápida (Windows):**
- Baixe e instale [XAMPP](https://www.apachefriends.org/) ✓

Depois:
```bash
php --version  # Deve funcionar
```

### 2. Configure Banco

```bash
# No terminal
mysql -u root -p horizons_db < database-schema-mysql.sql

# Ou em phpMyAdmin/XAMPP
# Crie DB "horizons_db" e importe database-schema-mysql.sql
```

### 3. Configure Backend

```bash
cd backend-php
cp .env.example .env

# Edite .env (abra com VS Code):
# DB_USER=root
# DB_PASSWORD=(sua senha)
```

### 4. Inicie Servidores

**Terminal 1:**
```bash
cd backend-php/public
php -S localhost:8000
```

**Terminal 2:**
```bash
# Na raiz do projeto
npm run dev
```

### 5. Teste

```bash
# Health check
curl http://localhost:8000

# Deve retornar:
# {"success":true,"message":"API is healthy","data":{"status":"API running"}}
```

✅ Pronto! Acesse [http://localhost:5173](http://localhost:5173)

---

## 📬 Endpoints Principais

```bash
# Login (publico)
POST /auth/login
  {email, password}

# Register (publico)
POST /auth/register
  {email, password, full_name}

# Profile (requer token)
GET /user/profile
  Header: Authorization: Bearer <token>

# Subjects
GET    /subjects
POST   /subjects          (requer auth)
PUT    /subjects/{id}     (requer auth)
DELETE /subjects/{id}     (requer auth)

# Topics, Content, Subscriptions...
# (Veja BACKEND_SETUP.md para lista completa)
```

---

## 🧪 Teste Rápido

```bash
# Windows PowerShell
.\backend-php\test-api.ps1

# Linux/Mac Bash
bash backend-php/test-api.sh
```

---

## 📚 Documentação

| Guia | Conteúdo |
|------|----------|
| [INSTALLATION.md](INSTALLATION.md) | Instalar PHP, MySQL, Node.js |
| [BACKEND_SETUP.md](BACKEND_SETUP.md) | Integração completa |
| [API_COMPLETE.md](API_COMPLETE.md) | Visão geral total |
| [backend-php/README.md](backend-php/README.md) | Docs API |

---

## ⚠️ Problemas Comuns

**Can't connect to database?**
```
✓ MySQL está rodando?
✓ Credenciais em backend-php/.env estão corretas?
✓ Banco "horizons_db" foi importado?
```

**401 Unauthorized?**
```
✓ Token foi passado em Authorization header?
✓ Token não expirou?
```

**404 Route Not Found?**
```
✓ Apache: ative mod_rewrite (XAMPP: já está)
✓ Reinicie servidor PHP
✓ URL está correta?
```

---

## 🚀 Próximos Passos

1. ✅ Tudo funcionando? Desenvolva!
2. 📝 Criar novos endpoints em `backend-php/controllers/`
3. 💾 Adicionar dados via API
4. 🎨 Conectar componentes React
5. 🚀 Deploy quando pronto

---

**Pronto?** [Ver guia completo →](BACKEND_SETUP.md)
