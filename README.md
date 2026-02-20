# 🌟 Horizons - Plataforma Educacional com Backend PHP + MySQL

Uma plataforma educacional moderna construída com **React** no frontend e uma **API RESTful em PHP com MySQL** no backend.

---

## 🚀 Começar

### ⚡ Pressa? (5 minutos)
→ Leia **[QUICK_START.md](QUICK_START.md)**

### 📚 Explorador? (30 minutos)
→ Leia **[BACKEND_SETUP.md](BACKEND_SETUP.md)**

### 🎯 Quer um resumo?
→ Leia **[SUMMARY.md](SUMMARY.md)**

---

## 📖 Guia de Documentação

### Para Iniciantes

| Documento | O quê? | Tempo |
|-----------|--------|-------|
| 📄 [SUMMARY.md](SUMMARY.md) | O que foi criado? | 5 min |
| 📄 [QUICK_START.md](QUICK_START.md) | Como começar agora? | 5 min |
| 📄 [INSTALLATION.md](INSTALLATION.md) | Como instalar pré-requisitos? | 15 min |

### Para Desenvolvedores

| Documento | O quê? | Tempo |
|-----------|--------|-------|
| 📄 [BACKEND_SETUP.md](BACKEND_SETUP.md) | Guia completo backend + integração | 30 min |
| 📄 [API_COMPLETE.md](API_COMPLETE.md) | Referência de tudo | 60 min |
| 📄 [STRUCTURE.md](STRUCTURE.md) | Como está estruturado? | 10 min |
| 📁 [backend-php/README.md](backend-php/README.md) | Docs técnicas API PHP | 30 min |

### Para DevOps

| Documento | O quê? | Tempo |
|-----------|--------|-------|
| 📄 [INSTALLATION.md](INSTALLATION.md) | Setup de ambiente | 15-30 min |
| 📄 [BACKEND_SETUP.md](BACKEND_SETUP.md) → Deploy | Deploy para produção | 30 min |

---

## 🎯 Escolha seu caminho

### 🟩 Caminho 1: Eu quero começar AGORA

```
1. Leia: QUICK_START.md (5 min)
2. Instale: PHP + MySQL (20 min)
3. Rode: Backend + Frontend (10 min)
4. Teste: Scripts em backend-php/ (5 min)
✅ Pronto! (40 min total)
```

### 🟨 Caminho 2: Entender antes de começar

```
1. Leia: SUMMARY.md (5 min)
2. Leia: STRUCTURE.md (10 min)
3. Leia: INSTALLATION.md (15 min)
4. Leia: BACKEND_SETUP.md (30 min)
5. Configure e rode tudo (30 min)
✅ Bem preparado! (90 min total)
```

### 🟦 Caminho 3: Referência técnica completa

```
1. Leia: SUMMARY.md (5 min)
2. Leia: API_COMPLETE.md (60 min)
3. Explore: backend-php/README.md (30 min)
4. Explore: Código em backend-php/ (60 min)
✅ Especialista! (155 min total)
```

---

## 📦 O que você tem

### Frontend React
```
src/
├── components/     ✅ Componentes (Admin, Dashboard, etc)
├── pages/         ✅ Páginas
├── contexts/      ✅ Estado global
├── hooks/         ✅ Custom hooks
└── lib/api.js     ✅ Cliente HTTP (já conectado à API)
```

### Backend PHP (Novo!)
```
backend-php/
├── controllers/   ✅ Lógica (Auth, Subjects, Topics, etc)
├── models/        ✅ Banco de dados
├── helpers/       ✅ JWT, Responses
└── public/        ✅ Entry point (porta :8000)
```

### Banco de Dados (Novo!)
```
database-schema-mysql.sql
└── 15+ tabelas pronto para usar
```

---

## 🚀 Quick Commands

### Instalar & Configurar

```bash
# 1. Clone/baixe o projeto
cd horizons-site-carlos

# 2. Instale dependências-frontend
npm install

# 3. Configure banco de dados
mysql -u root -p < database-schema-mysql.sql

# 4. Configure backend
cd backend-php
cp .env.example .env
# Edite .env com suas credenciais
```

### Rodar em Desenvolvimento

```bash
# Terminal 1 - Backend
cd backend-php/public
php -S localhost:8000

# Terminal 2 - Frontend
npm run dev  # Abrirá em http://localhost:5173
```

### Testar API

```bash
# PowerShell (Windows)
.\backend-php\test-api.ps1

# Bash (Linux/Mac)
bash backend-php/test-api.sh
```

---

## 🔌 API Endpoints

### Autenticação (Publico)
```
POST /auth/login
POST /auth/register
POST /auth/register/bulk
```

### Conteúdo (Requer Token)
```
CRUD /subjects
CRUD /topics
CRUD /topic-content
```

### Usuários & Assinaturas (Requer Token)
```
GET|PUT  /user/profile
CRUD     /subscriptions
```

*Ver [BACKEND_SETUP.md](BACKEND_SETUP.md) para lista completa*

---

## 🔑 Variáveis Importantes

### Backend (`backend-php/.env`)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=(sua senha)
JWT_SECRET=uma_chave_segura
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:8000
```

---

## ⚠️ Importante

### primeiro: Instale Pré-requisitos
- ✅ PHP 7.4+
- ✅ MySQL 5.7+
- ✅ Node.js 16+

Veja [INSTALLATION.md](INSTALLATION.md) para seu SO

### Depois: Configure Banco
```bash
mysql -u root -p < database-schema-mysql.sql
```

### Então: Rode os Servidores
```bash
# 1 terminal: Backend (porta 8000)
# 2 terminal: Frontend (porta 5173)
```

---

## 🆘 Problemas?

### "Can't connect to database"
→ Veja [BACKEND_SETUP.md](BACKEND_SETUP.md) → Troubleshooting

### "401 Unauthorized"
→ Veja [BACKEND_SETUP.md](BACKEND_SETUP.md) → Autenticação

### "Como instalo PHP?"
→ Veja [INSTALLATION.md](INSTALLATION.md) para seu SO

### "Como faço deploy?"
→ Veja [BACKEND_SETUP.md](BACKEND_SETUP.md) → Deploy

---

## 📊 Status do Projeto

| Componente | Status | Docs |
|-----------|--------|------|
| Frontend React | ✅ Completo | [src/](src/) |
| Backend PHP | ✅ Completo | [backend-php/README.md](backend-php/README.md) |
| Banco MySQL | ✅ Completo | [database-schema-mysql.sql](database-schema-mysql.sql) |
| Autenticação JWT | ✅ Completo | [backend-php/helpers/jwt.php](backend-php/helpers/jwt.php) |
| Endpoints | ✅ Completo | [BACKEND_SETUP.md](BACKEND_SETUP.md) |
| Documentação | ✅ Completo | Aqui! |

---

## 📚 Estrutura de Documentos

```
↓ COMECE AQUI ↓

    QUICK_START.md ⚡️ (5 min)
           ↓
    Quer instalar? → INSTALLATION.md 🔧 (15 min)
           ↓
    BACKEND_SETUP.md 📖 (30 min)
           ↓
    API_COMPLETE.md 📚 (60 min)
    STRUCTURE.md 📂 (10 min)
    SUMMARY.md ✅ (5 min)
           ↓
    backend-php/README.md 🎯 (30 min)
```

---

## 🎓 Aprender PHP?

Se é novo em PHP, comece com:

1. **Entender conceitos**: [BACKEND_SETUP.md](BACKEND_SETUP.md#fluxo-de-requisição)
2. **Ver código**: `backend-php/controllers/AuthController.php`
3. **Experimentar**: Crie novo endpoint em `backend-php/controllers/`
4. **Referência PHP**: [php.net](https://php.net)

---

## 🤝 Contribuir

Se quer adicionar features:

1. Crie novo controller em `backend-php/controllers/`
2. Adicione rota em `backend-php/routes/api.php`
3. Teste com script em `backend-php/test-api.ps1`
4. Documente em [backend-php/README.md](backend-php/README.md)

---

## 📞 Mais Informações

### Quick Links
- [Começar agora](QUICK_START.md) ⚡
- [Instalar requisitos](INSTALLATION.md) 🔧
- [Setup completo](BACKEND_SETUP.md) 📖
- [Todos os detalhes](API_COMPLETE.md) 📚

### Referência Rápida
- [Endpoints](BACKEND_SETUP.md#endpoints-disponíveis)
- [Banco de dados](database-schema-mysql.sql)
- [Código backend](backend-php/)
- [API PHP docs](backend-php/README.md)

---

## ✨ Highlights

- 🚀 API RESTful em PHP puro (sem frameworks pesados)
- 🔐 Autenticação JWT com password hashing
- 🗄️ MySQL com 15+ tabelas relacionadas
- 📱 Frontend React totalmente conectado
- 📚 Documentação completa e exemplos
- 🧪 Scripts de teste inclusos
- 🛡️ Proteção contra SQL injection
- ⚡ Performance otimizada

---

## 🎯 Próximos Passos

1. **Leia [QUICK_START.md](QUICK_START.md)** → 5 min
2. **Instale fré-requisitos** → 20 min
3. **Configure backend** → 10 min
4. **Rode tudo** → 5 min
5. **Teste** → 5 min

**Total: ~45 minutos até estar funcionando!** 🎉

---

*Criado com ❤️ para Horizons*  
*Última atualização: 12 de fevereiro de 2026*  
*Status: ✅ Production Ready*
