# Guia de Integração Backend PHP + MySQL

## 🎯 Visão Geral

O projeto foi migrado de uma arquitetura sem backend dedicado para uma **API RESTful em PHP com MySQL**. Todos os dados agora passam por esta API PHP.

## 📋 O que foi criado

### Backend PHP

```
backend-php/
├── public/
│   ├── index.php          ← Entry point
│   └── .htaccess          ← URL rewriting
├── config/
│   └── database.php       ← Conexão MySQL
├── controllers/           ← Lógica dos endpoints
├── models/               ← Modelos de dados
├── helpers/              ← JWT e response utilities
├── routes/               ← Definição de rotas
└── .env.example          ← Configuração
```

### Banco de Dados

- ✅ `database-schema-mysql.sql` - Schema completo
- ✅ Nova tabela: `user_credentials` para armazenar email + password

## 🚀 Configuração Rápida

### Passo 1: Criar banco de dados

```bash
# Acesse MySQL
mysql -u root -p

# Crie o banco
CREATE DATABASE horizons_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Importe o schema
mysql -u root -p horizons_db < database-schema-mysql.sql
```

### Passo 2: Configurar Backend PHP

```bash
cd backend-php

# Copie o arquivo de configuração
cp .env.example .env

# Edite .env com suas credenciais MySQL
nano .env  # ou use seu editor preferido
```

Exemplo de `.backend-php/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=horizons_db
DB_USER=root
DB_PASSWORD=sua_senha

JWT_SECRET=uma_chave_muito_segura_para_producao

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:8000
API_BASE_URL=http://localhost:8000
```

### Passo 3: Configurar Frontend

O arquivo `.env` na raiz já foi atualizado para:

```env
VITE_API_URL=http://localhost:8000
```

### Passo 4: Iniciar Servidores

#### Terminal 1 - Backend PHP

```bash
cd backend-php/public
php -S localhost:8000
```

Ou se estiver usando Apache:

```bash
# Configure no Apache e reinicie
sudo systemctl restart apache2
```

#### Terminal 2 - Frontend React

```bash
npm run dev
```

## 📡 Fluxo de Requisições

```
[Cliente React]
     ↓ (fetch + Authorization header)
[http://localhost:8000/api/...]
     ↓
[PHP Router em api.php]
     ↓
[AuthController/SubjectsController/etc]
     ↓
[Database.php conecta ao MySQL]
     ↓ (query)
[MySQL Database]
     ↓ (retorna dados)
[Controller formata resposta JSON]
     ↓
[Cliente React recebe dados]
```

## 🔐 Autenticação

### Fluxo de Login

1. **Frontend enviá credenciais**

```javascript
// src/lib/api.js já faz isso
const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
});
```

2. **Backend verifica no MySQL**

```php
// AuthController.php processa
// 1. Busca email em user_credentials
// 2. Valida password com password_verify()
// 3. Retorna JWT token
```

3. **Frontend armazena token**

```javascript
localStorage.setItem('token', response.data.token);
```

4. **Frontend inclui token em requisições subsequentes**

```javascript
headers['Authorization'] = `Bearer ${token}`;
```

## 📚 Endpoints Disponíveis

Todos os endpoints esperam JSON e retornam JSON.

### Autenticação (publico)

```
POST /auth/login
POST /auth/register
POST /auth/register/bulk
```

### User (requer autenticação)

```
GET  /user/profile
PUT  /user/profile
```

### Subjects (conteúdo principal)

```
GET    /subjects          # Listar todos
GET    /subjects/{id}     # Por ID
POST   /subjects          # Criar (requer auth)
PUT    /subjects/{id}     # Atualizar (requer auth)
DELETE /subjects/{id}     # Deletar (requer auth)
```

### Topics

```
GET    /topics            # Listar todos
GET    /topics/{id}       # Por ID
GET    /topics/count/{subjectId}  # Contar
POST   /topics            # Criar (requer auth)
PUT    /topics/{id}       # Atualizar (requer auth)
DELETE /topics/{id}       # Deletar (requer auth)
```

### Topic Content

```
GET    /topic-content     # Listar todos
GET    /topic-content/{id}  # Por ID
POST   /topic-content     # Criar (requer auth)
PUT    /topic-content/{id}  # Atualizar (requer auth)
DELETE /topic-content/{id}  # Deletar (requer auth)
DELETE /topic-content/bulk/delete  # Múltiplos (requer auth)
```

### Subscriptions

```
GET  /subscriptions       # Listar todos
GET  /subscriptions/{id}  # Por ID
GET  /subscriptions/user/{userId}  # Do usuário
GET  /subscriptions/stats/overview  # Estatísticas
POST /subscriptions       # Criar (requer auth)
PUT  /subscriptions/{id}  # Atualizar (requer auth)
```

## 🧪 Testes Rápidos

### Health Check

```bash
curl http://localhost:8000
```

Esperado:

```json
{
  "success": true,
  "message": "API is healthy",
  "data": { "status": "API running" }
}
```

### Registrar Usuário

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"teste@example.com",
    "password":"senha123",
    "full_name":"Teste User"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"teste@example.com",
    "password":"senha123"
  }'
```

Salve o token retornado e use em:

### Obter Perfil (com token)

```bash
curl -X GET http://localhost:8000/user/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🔄 Componentes React que usam a API

Os componentes já estão configurados para usar a API. Exemplo:

```javascript
// src/contexts/MockAuthContext.jsx
const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
});

// src/lib/api.js
export const subjectsApi = {
    getAll: () => apiRequest('/subjects'),
    getById: (id) => apiRequest(`/subjects/${id}`),
    // ...
};
```

## ⚠️ Possíveis Problemas

### "Could not connect to database"

```bash
# Verifique se MySQL está rodando
sudo systemctl status mysql

# Verifique credenciais em backend-php/.env
# Testecom: mysql -u root -p horizons_db
```

### "404 - Rota não encontrada"

```bash
# Se usar Apache, ative mod_rewrite:
sudo a2enmod rewrite
sudo systemctl restart apache2

# Se usar PHP built-in, URL base deve ser:
# http://localhost:8000/auth/login (com trailing slash é opcional)
```

### CORS errors

```bash
# Atualize CORS_ALLOWED_ORIGINS em backend-php/.env
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Reinicie o servidor PHP
```

### Token expirado

```bash
# JWT expira em 24h (86400 segundos)
# Altere JWT_EXPIRATION em backend-php/.env se necessário
```

## 📝 Estrutura de Resposta Padrão

### Sucesso (2xx)

```json
{
  "success": true,
  "message": "Descrição da ação",
  "data": { /* dados retornados */ }
}
```

### Erro (4xx, 5xx)

```json
{
  "success": false,
  "error": "Mensagem de erro",
  "errors": { /* detalhes opcionais */ }
}
```

## 🚢 Deploy para Produção

### Checklist

- [ ] Alterar `JWT_SECRET` para uma chave segura
- [ ] Usar HTTPS em CORS_ALLOWED_ORIGINS
- [ ] Definir DB_PASSWORD com credenciais seguras
- [ ] Remover `VITE_STRIPE_PUBLIC_KEY` de teste
- [ ] Configurar `.env` com permissões `600`
- [ ] Usar um serviço como Vercel, Railway ou Heroku para hospedar

## 📞 Suporte

Para dúvidas sobre:

- **PHP Backend**: Veja [backend-php/README.md](backend-php/README.md)
- **Frontend React**: Veja a estrutura em `src/`
- **Banco de Dados**: Veja o schema em `database-schema-mysql.sql`

---

✅ **Pronto!** A aplicação agora usa uma API PHP + MySQL funcional.
