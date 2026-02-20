# 📂 Estrutura de Arquivos - Backend PHP + MySQL

## 🎨 Visão Completa do que foi criado

```
horizons-site-carlos/
│
├── 📄 QUICK_START.md ................... ⚡ Comece aqui! (5 minutos)
├── 📄 INSTALLATION.md ................. 🔧 Instalar pré-requisitos
├── 📄 BACKEND_SETUP.md ................ 📖 Guia completo integração
├── 📄 API_COMPLETE.md ................. 📚 Documentação total
├── 📄 MIGRATION_COMPLETE.md ........... ✅ Status migração
│
├── .env ............................. 🔐 Configuração (ATUALIZADO)
├── .env.example ..................... 📋 Template (ATUALIZADO)
├── vite.config.js ................... ⚙️ Proxy aponta 8000 (ATUALIZADO)
│
└── backend-php/ ..................... 🚀 nova API PHP
    │
    ├── 📄 README.md .................. 📖 Docs da API
    ├── 📄 .env.example .............. 🔐 Template config backend
    ├── 📄 test-api.ps1 .............. 🧪 Teste PowerShell
    ├── 📄 test-api.sh ............... 🧪 Teste Bash
    │
    ├── public/ ...................... 📁 Entry point do servidor
    │   ├── index.php ................ 🎯 Porta: localhost:8000
    │   └── .htaccess ................ 🔀 URL rewriting para Apache
    │
    ├── config/ ...................... ⚙️ Configurações
    │   └── database.php ............. 🗄️ PDO MySQL connection
    │
    ├── controllers/ ................. 🎮 Lógica dos endpoints
    │   ├── AuthController.php ....... 🔐 Login, register
    │   ├── UserController.php ....... 👤 Perfil do usuário
    │   ├── SubjectsController.php ... 📚 Assuntos/módulos
    │   ├── TopicsController.php ..... 🏷️ Tópicos
    │   ├── TopicContentController.php 📄 Conteúdo
    │   └── SubscriptionsController.php 💳 Assinaturas
    │
    ├── models/ ....................... 📊 Modelos de dados
    │   └── User.php ................. 👥 Usuário model
    │
    ├── helpers/ ...................... 🛠️ Utilities
    │   ├── jwt.php .................. 🔑 JWT token handling
    │   └── response.php ............. 📮 JSON response helper
    │
    ├── routes/ ....................... 🛣️ Router
    │   └── api.php .................. 🚦 Definição de rotas
    │
    └── uploads/ ...................... 📦 Pasta para uploads
```

---

## 📡 Fluxo de Comunicação

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (React)                           │
│  src/lib/api.js:                                             │
│  - subjectsApi.getAll()                                      │
│  - authApi.login(email, password)                            │
│  - userApi.getProfile()                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ fetch('http://localhost:8000/subjects')
                     │ + Authorization: Bearer {token}
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 SERVIDOR (PHP + MySQL)                       │
│                                                              │
│   backend-php/public/index.php                              │
│      ↓                                                       │
│   routes/api.php (Router)                                   │
│      ↓                                                       │
│   /subjects → SubjectsController::getAll()                  │
│      ↓                                                       │
│   models/User.php (queries)                                 │
│      ↓                                                       │
│   config/database.php (PDO)                                 │
│      ↓                                                       │
│   MySQL Database: SELECT * FROM contents WHERE type='subject'
│      ↓                                                       │
│   helpers/response.php (JSON response)                      │
│                                                              │
│   JSON: {success: true, data: [...]}                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Response JSON
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              CLIENTE RECEBE RESPOSTA                         │
│  setState(data)                                              │
│  Renderiza componentes                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Autenticação (JWT Flow)

```
┌──────────────────┐
│   Login Form     │
│ (email/password) │
└────────┬─────────┘
         │
         │ POST /auth/login
         ▼
┌──────────────────────────────────────┐
│  AuthController::login()             │
│  - Busca email em user_credentials   │
│  - Valida password_hash              │
│  - Gera JWT com user_id              │
│  - Retorna token + user              │
└────────┬─────────────────────────────┘
         │
         │ {token: "eyJhbGc...", user: {...}}
         ▼
┌──────────────────────────────────────┐
│  localStorage.setItem('token', token)│
└────────┬─────────────────────────────┘
         │
         │ Em próximas requisições:
         │ GET /user/profile
         │ Authorization: Bearer eyJhbGc...
         ▼
┌──────────────────────────────────────┐
│  helpers/jwt.php::getAuthUser()      │
│  - Extrai token do header            │
│  - Verifica assinatura               │
│  - Valida expiração                  │
│  - Retorna user payload              │
└──────────────────────────────────────┘
```

---

## 📊 Banco de Dados (MySQL)

```
horizons_db
│
├── user_profiles ................... Dados básicos do usuário
│   └── user_id, full_name, phone, ...
│
├── user_credentials ............... Email + Password hash
│   └── user_id, email, password
│
├── user_subscriptions ............. Planos/Assinaturas
│   └── user_id, plan_type, status
│
├── contents ....................... Tópicos, aulas, provas
│   └── title, type, description, data (JSON)
│
├── user_progress .................. Progresso do usuário
│   └── user_id, content_id, progress
│
├── rankings ....................... Sistema de ranking
│   └── user_id, score, position
│
├── tournaments .................... Torneios
│   └── name, description, dates
│
├── notifications .................. Notificações
│   └── user_id, title, message
│
├── transactions ................... Pagamentos/Transações
│   └── user_id, type, amount
│
└── [Mais 5+ tabelas de suporte]
```

---

## 🔌 Endpoints Criados

### 🔐 Autenticação (Publico)

```
POST /auth/login
POST /auth/register
POST /auth/register/bulk
```

### 👤 Usuário (Requer Token)

```
GET  /user/profile
PUT  /user/profile
```

### 📚 Conteúdo (CRUD)

```
GET    /subjects
GET    /subjects/{id}
POST   /subjects
PUT    /subjects/{id}
DELETE /subjects/{id}

GET    /topics?subject_id={id}
GET    /topics/{id}
GET    /topics/count/{subject_id}
POST   /topics
PUT    /topics/{id}
DELETE /topics/{id}

GET    /topic-content?topic_id={id}
GET    /topic-content/{id}
POST   /topic-content
PUT    /topic-content/{id}
DELETE /topic-content/{id}
DELETE /topic-content/bulk/delete
```

### 💳 Assinaturas

```
GET    /subscriptions
GET    /subscriptions/{id}
GET    /subscriptions/user/{userId}
GET    /subscriptions/stats/overview
POST   /subscriptions
PUT    /subscriptions/{id}
```

---

## ⚙️ Configurações

### Backend PHP (`.env`)

```
DB_HOST=localhost
DB_PORT=3306  
DB_NAME=horizons_db
DB_USER=root
DB_PASSWORD=

JWT_SECRET=chave_super_secreta
JWT_EXPIRATION=86400

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

API_BASE_URL=http://localhost:8000

STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLIC_KEY=pk_test_xxx
```

### Frontend (`.env`)

```
VITE_API_URL=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

---

## 🧪 Scripts de Teste

### PowerShell (Windows)

```bash
# Na pasta backend-php
.\test-api.ps1

# Com URL customizada
.\test-api.ps1 -ApiUrl "http://localhost:8000"
```

### Bash (Linux/Mac)

```bash
bash backend-php/test-api.sh

# Com URL customizada
bash backend-php/test-api.sh http://localhost:8000
```

---

## 🚀 Iniciar Sistema

**Terminal 1 - Backend:**
```bash
cd backend-php/public
php -S localhost:8000
```

**Terminal 2 - Frontend:**
```bash
# Na raiz
npm run dev
```

**Resultado:**
- Backend: http://localhost:8000
- Frontend: http://localhost:5173
- phpMyAdmin (XAMPP): http://localhost/phpmyadmin

---

## ✅ Checklist do Que Foi Feito

- [x] Backend PHP estruturado
- [x] Controllers criados (Auth, User, Subjects, etc)
- [x] Models implementados
- [x] JWT autenticação
- [x] CORS configurado
- [x] MySQL schema com 15+ tabelas
- [x] Nova tabela user_credentials
- [x] .env configurado no frontend
- [x] vite.config.js atualizado (porta 8000)
- [x] Documentação completa
- [x] Scripts de teste
- [x] Error handling
- [x] SQL injection protection (prepared statements)
- [x] Password hashing (bcrypt)

---

## 📞 Próximos Passos

1. **Instalar pré-requisitos**: Veja [INSTALLATION.md](INSTALLATION.md)
2. **Configurar banco**: Importe `database-schema-mysql.sql`
3. **Configurar variáveis**: Edite `backend-php/.env`
4. **Iniciar servidores**: PHP em 8000, React dev server
5. **Testar**: Execute scripts em `backend-php/test-api.ps1`
6. **Desenvolver**: Adicione novos endpoints conforme necessário
7. **Deploy**: Use Railway, Heroku, ou seu servidor preferido

---

**Tudo pronto!** 🎉 Comece com [QUICK_START.md](QUICK_START.md)
