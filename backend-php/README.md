# Horizons Backend API (PHP + MySQL)

Uma API RESTful moderna construída em PHP puro com MySQL para a plataforma educacional Horizons.

## Requisitos

- PHP 7.4+
- MySQL 5.7+
- Apache com mod_rewrite habilitado (ou outro servidor web com suporte a rewrite)
- Composer (opcional, para futuras dependências)

## Instalação

### 1. Clone ou configure o banco de dados

```bash
# Crie o banco de dados
mysql -u root -p < database-schema-mysql.sql
```

### 2. Configure as variáveis de ambiente

```bash
cd backend-php
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=horizons_db
DB_USER=root
DB_PASSWORD=

JWT_SECRET=sua_chave_secreta_muito_segura_aqui
JWT_EXPIRATION=86400

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
API_BASE_URL=http://localhost:8000
```

### 3. Configure o servidor web

#### Apache (recomendado)

O arquivo `.htaccess` já está configurado na pasta `public/`. Certifique-se de:

1. Ativar `mod_rewrite`:
   ```bash
   sudo a2enmod rewrite
   ```

2. Configurar o VirtualHost:
   ```apache
   <VirtualHost *:8000>
       ServerName localhost
       DocumentRoot /path/to/backend-php/public
       
       <Directory /path/to/backend-php/public>
           AllowOverride All
           Require all granted
       </Directory>
   </VirtualHost>
   ```

3. Reiniciar Apache:
   ```bash
   sudo systemctl restart apache2
   ```

#### PHP Built-in Server (desenvolvimento)

```bash
cd backend-php/public
php -S localhost:8000
```

## Estrutura do Projeto

```
backend-php/
├── public/
│   ├── index.php          # Entry point da API
│   └── .htaccess          # Rewrite rules
├── config/
│   └── database.php       # Configuração do banco
├── controllers/           # Lógica dos endpoints
│   ├── AuthController.php
│   ├── SubjectsController.php
│   ├── TopicsController.php
│   ├── TopicContentController.php
│   ├── SubscriptionsController.php
│   └── UserController.php
├── models/
│   └── User.php          # Modelo de usuário
├── helpers/
│   ├── jwt.php           # Autenticação JWT
│   └── response.php      # Formatação de respostas
├── routes/
│   └── api.php           # Definição de rotas
├── .env.example          # Exemplo de configuração
└── uploads/              # Pasta para uploads
```

## Autenticação

A API usa JWT (JSON Web Tokens) para autenticação.

### Login

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"senha123"}'
```

Resposta:
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "user_id": "...",
      "full_name": "João Silva",
      "email": "user@example.com"
    }
  }
}
```

### Usando o Token

Adicione o token no header `Authorization`:

```bash
curl -X GET http://localhost:8000/user/profile \
  -H "Authorization: Bearer eyJhbGc..."
```

## Endpoints Disponíveis

### Autenticação
- `POST /auth/login` - Fazer login
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/register/bulk` - Registrar múltiplos usuários

### Usuários
- `GET /user/profile` - Obter perfil (requer auth)
- `PUT /user/profile` - Atualizar perfil (requer auth)

### Assuntos
- `GET /subjects` - Listar todos
- `GET /subjects/{id}` - Obter por ID
- `POST /subjects` - Criar (requer auth)
- `PUT /subjects/{id}` - Atualizar (requer auth)
- `DELETE /subjects/{id}` - Deletar (requer auth)

### Tópicos
- `GET /topics` - Listar todos
- `GET /topics/{id}` - Obter por ID
- `GET /topics/count/{subject_id}` - Contar tópicos de um assunto
- `POST /topics` - Criar (requer auth)
- `PUT /topics/{id}` - Atualizar (requer auth)
- `DELETE /topics/{id}` - Deletar (requer auth)

### Conteúdo
- `GET /topic-content` - Listar todos
- `GET /topic-content/{id}` - Obter por ID
- `POST /topic-content` - Criar (requer auth)
- `PUT /topic-content/{id}` - Atualizar (requer auth)
- `DELETE /topic-content/{id}` - Deletar (requer auth)
- `DELETE /topic-content/bulk/delete` - Deletar múltiplos

### Assinaturas
- `GET /subscriptions` - Listar todas
- `GET /subscriptions/{id}` - Obter por ID
- `GET /subscriptions/user/{user_id}` - Obter do usuário
- `GET /subscriptions/stats/overview` - Estatísticas
- `POST /subscriptions` - Criar (requer auth)
- `PUT /subscriptions/{id}` - Atualizar (requer auth)

## Exemplo de Cliente (Frontend)

Já está configurado em `src/lib/api.js`:

```javascript
const API_BASE = 'http://localhost:8000';

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });
    
    return await response.json();
}
```

## Configuração do Frontend

No arquivo `.env` do frontend (raiz do projeto):

```env
VITE_API_URL=http://localhost:8000
```

## Testes

### Health Check

```bash
curl http://localhost:8000
```

Resposta esperada:
```json
{
  "success": true,
  "message": "API is healthy",
  "data": {
    "status": "API running"
  }
}
```

## Erros Comuns

### "Erro ao conectar ao banco de dados"
- Verifique se o MySQL está rodando
- Confirme as credenciais em `.env`
- Verifique se o banco `horizons_db` existe

### "Rota não encontrada"
- Verifique se o `.htaccess` está ativado
- Reinicie o servidor web
- Confirme o caminho da URL

### "Não autorizado (401)"
- Certifique-se de que o token JWT está sendo enviado
- Verifique se o token não expirou
- Configure `JWT_SECRET` corretamente no `.env`

## Deployment

### Para produção

1. Configure variáveis de ambiente seguras
2. Use HTTPS
3. Implemente rate limiting
4. Configure CORS restritivamente
5. Use um `.env` seguro com permissões 600

```bash
chmod 600 backend-php/.env
```

## Contribuição

Para mais informações, consulte a documentação do projeto.

## Licença

MIT
