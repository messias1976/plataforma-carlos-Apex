# Migração Supabase → Backend MySQL - COMPLETA ✅

## Status: ✅ MIGRAÇÃO 100% CONCLUÍDA

**Data**: Janeiro 2025  
**Resultado**: Todas as dependências do Supabase foram removidas. O sistema agora usa 100% API backend MySQL com autenticação JWT.

---

## Resumo Executivo

### ✅ Backend API Completo
- **Setup Database**: `backend/src/setup-database.js` - Schema MySQL completo
- **Rotas Criadas**:
  - `/api/auth/login` e `/api/auth/register` - Autenticação JWT
  - `/api/auth/register/bulk` - Registro em lote (AdminSeedUsers)
  - `/api/subjects` - CRUD de matérias
  - `/api/topics` - CRUD de tópicos
  - `/api/topic-content` - CRUD de conteúdo
  - `/api/subscriptions` - Gerenciamento de assinaturas
  - `/api/user/profile` - Perfil do usuário (GET/PUT)

### ✅ Frontend API Client
- **Arquivo**: `src/lib/api.js`
- **Exports**: `api.auth`, `api.subjects`, `api.topics`, `api.topicContent`, `api.subscriptions`, `api.user`
- **Features**: Auto-auth headers (JWT), tratamento de erros HTML/JSON, configurável via `VITE_API_URL`

### ✅ Componentes Migrados (20 arquivos)

#### Contextos e Auth
1. ✅ `src/contexts/MockAuthContext.jsx` - Auth JWT (único provider ativo)
2. ✅ `src/contexts/LanguageContext.jsx` - Sincronização com backend via `api.user.updateProfile`

#### Hooks
3. ✅ `src/hooks/useSubscription.js` - `api.subscriptions`
4. ✅ `src/hooks/useStripePayment.js` - Ativação via `api.subscriptions.create`

#### Páginas
5. ✅ `src/pages/SubjectContentPage.jsx`
6. ✅ `src/pages/AdminDashboard.jsx`
7. ✅ `src/pages/AdminSeedUsers.jsx` - Usa `api.auth.registerBulk`
8. ✅ `src/pages/StripePaymentSuccess.jsx`

#### Componentes Dashboard
9. ✅ `src/components/dashboard/TopicContentViewer.jsx`
10. ✅ `src/components/dashboard/SubscriptionCards.jsx`

#### Componentes Admin
11. ✅ `src/components/admin/content/SubjectsManagement.jsx`
12. ✅ `src/components/admin/content/SubjectForm.jsx`
13. ✅ `src/components/admin/content/TopicForm.jsx` - **Field rename: `name` → `title`**
14. ✅ `src/components/admin/content/TopicsList.jsx`
15. ✅ `src/components/admin/content/SubjectSelector.jsx`
16. ✅ `src/components/admin/content/SubjectEditor.jsx` - **Field rename: `type` → `content_type`**
17. ✅ `src/components/admin/content/ContentForm.jsx`
18. ✅ `src/components/admin/content/ContentList.jsx`

#### Componentes Subscription
19. ✅ `src/components/subscription/StripeCheckout.jsx` - Usa `api.user.updateProfile`
20. ✅ `src/contexts/StripeContext.jsx`

### ✅ Arquivos Removidos
- ❌ `src/contexts/AuthContext.jsx` - Context não utilizado
- ❌ `src/contexts/SupabaseAuthContext.jsx` - Context substituído por MockAuthContext
- ❌ `src/lib/customSupabaseClient.js` - Cliente Supabase
- ❌ `src/lib/confirmEmail.js` - Funções Supabase de email
- ❌ `src/hooks/useStripeValidation.js` - Hook não utilizado
- ❌ Dependência `@supabase/supabase-js` removida do `package.json`

---

## Mudanças de Schema Importantes

| Campo Supabase | Campo MySQL | Componente Afetado |
|----------------|-------------|-------------------|
| `topics.name` | `topics.title` | TopicForm, todos relacionados a tópicos |
| `topic_content.type` | `topic_content.content_type` | SubjectEditor, ContentForm, ContentList |
| `supabase.from('x').select()` | `await api.x.getAll()` | Todos os componentes |
| `supabase.auth.signUp()` | `await api.auth.register()` | AdminSeedUsers |

---

## Endpoints Backend Disponíveis

### Auth
```
POST /api/auth/register
Body: { email, password, full_name }
Response: { message: "Usuário registrado com sucesso!" }

POST /api/auth/login
Body: { email, password }
Response: { token, user: { id, email, role } }

POST /api/auth/register/bulk
Body: { users: [{ email, password, full_name }] }
Response: { results: [{ email, status, message }] }
```

### Subjects
```
GET /api/subjects
POST /api/subjects - Body: { name, area, description }
GET /api/subjects/:id
PUT /api/subjects/:id
DELETE /api/subjects/:id
```

### Topics
```
GET /api/topics?subject_id=X
POST /api/topics - Body: { title, subject_id, description, order_index }
GET /api/topics/:id
GET /api/topics/count/:subject_id
PUT /api/topics/:id
DELETE /api/topics/:id
```

### Topic Content
```
GET /api/topic-content?topic_id=X
POST /api/topic-content - Body: { topic_id, title, content_type, url, content_text, order_index }
GET /api/topic-content/:id
PUT /api/topic-content/:id
DELETE /api/topic-content/:id
DELETE /api/topic-content/bulk/delete
```

### Subscriptions
```
GET /api/subscriptions
GET /api/subscriptions/user/:userId
GET /api/subscriptions/stats/overview
POST /api/subscriptions - Body: { user_id, plan_id, status, start_date }
PUT /api/subscriptions/:id
```

### User Profile (Autenticado)
```
GET /api/user/profile
Headers: { Authorization: "Bearer <token>" }
Response: { user_id, full_name, phone, birthdate, language_preference }

PUT /api/user/profile
Headers: { Authorization: "Bearer <token>" }
Body: { full_name?, phone?, birthdate?, language_preference? }
```

---

## Deploy para Hostinger - Passo a Passo

### 1️⃣ Preparar Backend

**Criar arquivo .env no backend:**
```bash
cd backend
cat > .env << EOF
DB_HOST=localhost
DB_USER=seu_usuario_mysql_hostinger
DB_PASSWORD=sua_senha_mysql_hostinger
DB_NAME=seu_database_hostinger
JWT_SECRET=gere_um_secret_seguro_aqui_use_openssl_rand_base64_32
PORT=4000
EOF
```

### 2️⃣ Upload Backend via FTP ou SSH

**Estrutura no Hostinger:**
```
domains/apexestudos.com/public_html/
├── api/                    ← Backend Node.js
│   ├── package.json
│   ├── .env
│   └── src/
│       ├── server.js
│       ├── db.js
│       ├── setup-database.js
│       ├── setup-admin.js
│       └── routes/
└── index.html             ← Frontend build (depois do deploy)
```

**Via SSH:**
```bash
ssh usuario@apexestudos.com
cd domains/apexestudos.com/public_html/api

# Upload dos arquivos backend (via FTP ou git)
# Após upload:
npm install --production

# Inicializar banco de dados
node src/setup-database.js

# Criar usuário admin
node src/setup-admin.js
# Email: admin@apexestudos.com
# Senha: Admin@123456
```

### 3️⃣ Configurar Node.js App no hPanel

1. Login no **hPanel Hostinger**
2. Ir em **Advanced → Node.js**
3. Criar novo aplicativo:
   - **Application Root**: `domains/apexestudos.com/public_html/api`
   - **Application URL**: `api.apexestudos.com`
   - **Application startup file**: `src/server.js`
   - **Node.js version**: 18.x ou superior
4. **Environment Variables** (copiar do .env):
   ```
   DB_HOST=localhost
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=seu_database
   JWT_SECRET=seu_secret_jwt
   PORT=4000
   ```
5. Clicar em **Start Application**
6. Verificar logs: `~/logs/nodejs/api.apexestudos.com.log`

### 4️⃣ Build e Deploy Frontend

**No computador local:**
```bash
cd /caminho/do/projeto

# Instalar dependências (se ainda não instalou)
npm install

# Criar arquivo .env.production
cat > .env.production << EOF
VITE_API_URL=https://api.apexestudos.com
EOF

# Build para produção
npm run build
# Isso gera a pasta dist/
```

**Upload via FTP:**
- Conectar ao FTP do Hostinger
- Navegar até `domains/apexestudos.com/public_html/`
- Upload de **todo o conteúdo** da pasta `dist/` (não a pasta em si, apenas o conteúdo)
  - `index.html`
  - `assets/`
  - `llms.txt`
  - etc.

### 5️⃣ Configurar React Router (.htaccess)

**Criar arquivo `.htaccess` em `public_html/`:**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Se o arquivo ou diretório existe, servir diretamente
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Caso contrário, redirecionar para index.html
  RewriteRule . /index.html [L]
</IfModule>
```

### 6️⃣ Testar Sistema

**Checklist de testes:**
- [ ] ✅ Acessar https://apexestudos.com (deve carregar landing page)
- [ ] ✅ Fazer login com credenciais de teste
- [ ] ✅ Verificar console do navegador (F12) - não deve ter erros de CORS ou 404
- [ ] ✅ Testar área administrativa (https://apexestudos.com/admin)
- [ ] ✅ Adicionar/editar matéria, tópico, conteúdo
- [ ] ✅ Verificar logs do backend: `cat ~/logs/nodejs/api.apexestudos.com.log`

**Comandos úteis SSH:**
```bash
# Ver logs do Node.js
tail -f ~/logs/nodejs/api.apexestudos.com.log

# Reiniciar aplicação Node.js (via hPanel ou SSH)
pm2 restart api

# Verificar status MySQL
mysql -u seu_usuario -p -e "SHOW DATABASES;"
mysql -u seu_usuario -p seu_database -e "SHOW TABLES;"
```

---

## Padrão de Autenticação

Todas as rotas protegidas (user, subscriptions, etc.) requerem header JWT:

```javascript
Authorization: Bearer <JWT_TOKEN>
```

**Frontend (automático via api.js):**
```javascript
import api from '@/lib/api';

// Login
const { token, user } = await api.auth.login(email, password);
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));

// Todas as chamadas subsequentes incluem o token automaticamente
const profile = await api.user.getProfile(); // ✅ Autenticado
```

---

## Próximos Passos Opcionais

### Melhorias de Produção

1. **Stripe Production**
   - Atualizar links de checkout em `src/components/subscription/StripeCheckout.jsx`
   - Configurar webhooks do Stripe para ativar assinaturas automaticamente

2. **Email Service**
   - Configurar SendGrid, Mailgun ou AWS SES
   - Implementar confirmação de email no registro
   - Email de recuperação de senha

3. **Upload de Arquivos**
   - Implementar upload de mídia (vídeos, PDFs) para tópicos
   - Integrar com storage (AWS S3, Cloudinary, ou Hostinger Object Storage)

4. **Monitoramento**
   - Configurar Sentry para rastreamento de erros
   - Implementar logs estruturados (Winston, Pino)
   - Configurar alertas de uptime (UptimeRobot, Pingdom)

5. **CI/CD**
   - Automatizar deploy com GitHub Actions
   - Testes automatizados (Jest, Playwright)
   - Preview deployments (Netlify, Vercel)

6. **Performance**
   - Implementar cache (Redis)
   - CDN para assets estáticos (Cloudflare)
   - Compressão gzip/brotli
   - Lazy loading de componentes React

---

## Estrutura Final do Projeto

```
horizons-site-carlos/
├── backend/
│   ├── src/
│   │   ├── server.js              ✅ Express server
│   │   ├── db.js                  ✅ MySQL connection pool
│   │   ├── setup-database.js      ✅ Schema completo
│   │   ├── setup-admin.js         ✅ Create admin user
│   │   └── routes/
│   │       ├── auth.js            ✅ Login, register, bulk register
│   │       ├── subjects.js        ✅ CRUD matérias
│   │       ├── topics.js          ✅ CRUD tópicos
│   │       ├── topic-content.js   ✅ CRUD conteúdo
│   │       ├── subscriptions.js   ✅ Assinaturas
│   │       └── user.js            ✅ Profile management
│   ├── package.json
│   └── .env                       ⚠️ Configurar no servidor
├── src/
│   ├── lib/
│   │   └── api.js                 ✅ Frontend API client
│   ├── contexts/
│   │   ├── MockAuthContext.jsx    ✅ JWT Auth (único ativo)
│   │   └── LanguageContext.jsx    ✅ Migrado para backend
│   ├── hooks/
│   │   ├── useSubscription.js     ✅ Backend API
│   │   └── useStripePayment.js    ✅ Backend API
│   ├── components/                ✅ Todos migrados
│   └── pages/                     ✅ Todos migrados
├── .env.production                ✅ VITE_API_URL=https://api.apexestudos.com
├── package.json                   ✅ @supabase/supabase-js REMOVIDO
└── MIGRATION_COMPLETE.md          📄 Este arquivo
```

---

## Troubleshooting

### Erro: "Unexpected token '<'"
**Causa**: Backend não está respondendo, servidor retorna HTML 404/500 em vez de JSON  
**Solução**:
- Verificar se Node.js App está rodando no hPanel
- Checar logs: `tail -f ~/logs/nodejs/api.apexestudos.com.log`
- Confirmar que `VITE_API_URL` está correto no frontend

### Erro: "CORS policy"
**Causa**: Backend não permite requisições do frontend  
**Solução**: Adicionar em `backend/src/server.js`:
```javascript
app.use(cors({
  origin: ['https://apexestudos.com', 'http://localhost:3000'],
  credentials: true
}));
```

### Erro: "401 Unauthorized"
**Causa**: Token JWT inválido ou expirado  
**Solução**:
- Fazer logout e login novamente
- Verificar se `localStorage.getItem('token')` existe
- Conferir se `JWT_SECRET` é o mesmo no .env do servidor

### Erro: "ER_ACCESS_DENIED_ERROR"
**Causa**: Credenciais MySQL incorretas  
**Solução**:
- Verificar `.env` no servidor com credenciais do hPanel → MySQL
- Garantir que usuário MySQL tem permissões (GRANT ALL)

---

## Conclusão

✅ **Migração 100% Completa**  
✅ **Zero Dependências Supabase**  
✅ **Backend API REST Completo**  
✅ **Frontend Atualizado**  
✅ **Pronto para Deploy em Produção**

**Próximo Passo**: Deploy no Hostinger seguindo as instruções acima.

---

**Documentação Criada**: Janeiro 2025  
**Versão**: 1.0  
**Status**: ✅ Production Ready
