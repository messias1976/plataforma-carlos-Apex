# 🚀 MIGRAÇÃO SUPABASE → MySQL - GUIA COMPLETO

## ✅ O QUE FOI FEITO AUTOMATICAMENTE

### 1. Backend - Estrutura MySQL Completa
- ✅ **Schema do banco**: [backend/src/setup-database.js](backend/src/setup-database.js)
  - Tabelas: users, user_profiles, plans, user_subscriptions
  - Tabelas de conteúdo: subjects, topics, topic_content
  - Tabelas auxiliares: user_progress, lessons

- ✅ **Rotas API criadas**:
  - [backend/src/routes/subjects.js](backend/src/routes/subjects.js) - GET/POST/PUT/DELETE matérias
  - [backend/src/routes/topics.js](backend/src/routes/topics.js) - GET/POST/PUT/DELETE tópicos
  - [backend/src/routes/topic-content.js](backend/src/routes/topic-content.js) - GET/POST/PUT/DELETE conteúdos
  - [backend/src/routes/subscriptions.js](backend/src/routes/subscriptions.js) - Gestão de assinaturas

- ✅ **Server atualizado**: [backend/src/server.js](backend/src/server.js)
  - Registra todas as rotas novas
  - CORS configurado
  - Auth JWT já funcionando

### Backend PHP (novo)
- ✅ **API PHP completa**: [backend-php/public/index.php](backend-php/public/index.php)
- ✅ **Scripts de setup**: [backend-php/scripts/setup-database.php](backend-php/scripts/setup-database.php), [backend-php/scripts/setup-admin.php](backend-php/scripts/setup-admin.php), [backend-php/scripts/setup-student.php](backend-php/scripts/setup-student.php)
- ✅ **Env de exemplo**: [backend-php/.env.example](backend-php/.env.example)

### 2. Frontend - Cliente API
- ✅ **Cliente API**: [src/lib/api.js](src/lib/api.js)
  - Helpers para todas as rotas backend
  - Auth automático via token
  - Error handling para HTML responses

- ✅ **Auth atualizado**: [src/contexts/MockAuthContext.jsx](src/contexts/MockAuthContext.jsx)
  - Usa `VITE_API_URL` configurável
  - Suporta register com full_name

- ✅ **Subscription hook**: [src/hooks/useSubscription.js](src/hooks/useSubscription.js)
  - Agora chama o backend MySQL
  - Remove dependência do Supabase

- ✅ **Stripe context**: [src/contexts/StripeContext.jsx](src/contexts/StripeContext.jsx)
  - Remove chamadas Supabase.auth
  - Usa AuthContext diretamente

- ✅ **.env.production**: [.env.production](.env.production)
  - `VITE_API_URL=https://api.apexestudos.com`

---

## ⚠️ MIGRAÇÃO MANUAL NECESSÁRIA

Os arquivos abaixo **ainda usam Supabase** e precisam ser migrados para `api.js`:

### Páginas (src/pages/)
- ❌ [SubjectContentPage.jsx](src/pages/SubjectContentPage.jsx) - `supabase.from('subjects')`, `topics`, `topic_content`
- ❌ [AdminDashboard.jsx](src/pages/AdminDashboard.jsx) - `supabase.from('user_subscriptions')`, `topic_content`, `subjects`
- ❌ [AdminSeedUsers.jsx](src/pages/AdminSeedUsers.jsx) - `supabase.auth.signUp`, insert/delete em subjects/topics

### Componentes Admin (src/components/admin/)
- ❌ [SubjectsManagement.jsx](src/components/admin/content/SubjectsManagement.jsx) - select/delete subjects/topics
- ❌ [SubjectForm.jsx](src/components/admin/content/SubjectForm.jsx) - insert/update subjects
- ❌ [TopicForm.jsx](src/components/admin/content/TopicForm.jsx) - insert/update topics
- ❌ [TopicsList.jsx](src/components/admin/content/TopicsList.jsx) - select/delete topics
- ❌ [SubjectSelector.jsx](src/components/admin/content/SubjectSelector.jsx) - select subjects
- ❌ [SubjectEditor.jsx](src/components/admin/content/SubjectEditor.jsx) - select/insert/update/delete topic_content
- ❌ [ContentForm.jsx](src/components/admin/content/ContentForm.jsx) - insert/update topic_content
- ❌ [ContentList.jsx](src/components/admin/content/ContentList.jsx) - select/delete topic_content

### Componentes Dashboard (src/components/dashboard/)
- ❌ [TopicContentViewer.jsx](src/components/dashboard/TopicContentViewer.jsx) - select topics/topic_content
- ❌ [SubscriptionCards.jsx](src/components/dashboard/SubscriptionCards.jsx) - importa `SupabaseAuthContext`

### Contextos (src/contexts/)
- ❌ [AuthContext.jsx](src/contexts/AuthContext.jsx) - **NÃO USAR** (preferir MockAuthContext)
- ❌ [SupabaseAuthContext.jsx](src/contexts/SupabaseAuthContext.jsx) - **NÃO USAR**
- ❌ [LanguageContext.jsx](src/contexts/LanguageContext.jsx) - `supabase.auth.getSession`, `updateUser`

### Hooks (src/hooks/)
- ❌ [useStripePayment.js](src/hooks/useStripePayment.js) - usa Supabase functions
- ❌ [useStripeValidation.js](src/hooks/useStripeValidation.js) - usa Supabase functions

### Outros (src/)
- ❌ [lib/confirmEmail.js](src/lib/confirmEmail.js) - usa `supabase.rpc`
- ❌ [components/subscription/StripeCheckout.jsx](src/components/subscription/StripeCheckout.jsx) - usa `supabase.from('user_profiles')`

---

## 📝 TEMPLATE DE MIGRAÇÃO

### Antes (Supabase):
```javascript
import { supabase } from '@/lib/customSupabaseClient';

const { data, error } = await supabase
  .from('subjects')
  .select('*')
  .eq('id', subjectId)
  .single();
```

### Depois (Backend MySQL):
```javascript
import api from '@/lib/api';

const data = await api.subjects.getById(subjectId);
```

### Referência rápida api.js:
```javascript
// Subjects
api.subjects.getAll()
api.subjects.getById(id)
api.subjects.create({ name, description, area, icon_url, order_index })
api.subjects.update(id, { name, description, ... })
api.subjects.delete(id)

// Topics
api.topics.getAll(subjectId)  // subjectId opcional
api.topics.getById(id)
api.topics.getCount(subjectId)
api.topics.create({ subject_id, title, description, order_index })
api.topics.update(id, { subject_id, title, ... })
api.topics.delete(id)

// Topic Content
api.topicContent.getAll(topicId)  // topicId opcional
api.topicContent.getById(id)
api.topicContent.create({ topic_id, title, content_type, content_text, content_data, order_index })
api.topicContent.update(id, { topic_id, title, ... })
api.topicContent.delete(id)
api.topicContent.bulkDelete()

// Subscriptions
api.subscriptions.getAll()
api.subscriptions.getByUserId(userId)
api.subscriptions.getStats()
api.subscriptions.create({ user_id, plan_type, status, end_date, stripe_subscription_id })
api.subscriptions.update(id, { plan_type, status, end_date })

// Auth
api.auth.login(email, password)
api.auth.register(email, password, full_name)
```

---

## 🔧 PASSOS PARA DEPLOY

### 1. Configurar MySQL no Hostinger (PHP)
```bash
# Via terminal SSH ou File Manager, rode:
cd domains/apexestudos.com/public_html/api
php scripts/setup-database.php
php scripts/setup-admin.php
php scripts/setup-student.php  # Opcional: criar aluno de teste
```

### 2. Configurar variáveis de ambiente (backend/.env)
```env
DB_HOST=localhost
DB_USER=u123456789_apex
DB_PASSWORD=SUA_SENHA_MYSQL
DB_NAME=u123456789_apex
JWT_SECRET=sua_chave_jwt_segura_aqui
OPENAI_API_KEY=sk-...
PORT=4000
NODE_ENV=production
```

### 3. Configurar o web root do PHP
- Subdominio `api.apexestudos.com` deve apontar para `public_html/api/public`
- Nao precisa Node.js no hPanel

### 4. Build frontend com .env.production
```bash
npm run build
```

### 5. Upload dist/ para public_html/
- Extrair conteúdo de dist/ para `domains/apexestudos.com/public_html/`

### 6. Criar .htaccess para React Router
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🎯 CHECKLIST FINAL

### Backend
- [ ] Rodar `setup-database.php` no servidor
- [ ] Rodar `setup-admin.php` para criar admin
- [ ] Configurar .env com credenciais MySQL
- [ ] Iniciar Node.js App no hPanel
- [ ] Testar `https://api.apexestudos.com/health`

### Frontend
- [ ] Migrar arquivos com Supabase (ver lista acima)
- [ ] Build com `npm run build`
- [ ] Upload dist/ para public_html/
- [ ] Criar .htaccess
- [ ] Testar login em `https://apexestudos.com`

### Validação
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Admin consegue gerenciar conteúdo
- [ ] Assinaturas aparecem corretamente

---

## 🗑️ LIMPEZA OPCIONAL

Depois que tudo funcionar, você pode remover:
- `src/lib/customSupabaseClient.js`
- `src/lib/confirmEmail.js`
- `src/contexts/AuthContext.jsx` (usar só MockAuthContext)
- `src/contexts/SupabaseAuthContext.jsx`
- Dependência `@supabase/supabase-js` do package.json

---

## 📞 PROBLEMAS COMUNS

### "Unexpected token '<'"
- O frontend está chamando endpoint que retorna HTML
- Verificar se Node.js App está rodando
- Verificar se `VITE_API_URL` está correto

###  "CORS error"
- Adicionar domínio no backend CORS (server.js linha 48)

### "Table doesn't exist"
- Rodar `setup-database.js` no servidor

### "Cannot GET /dashboard"
- Criar .htaccess para React Router

---

**Status**: 70% completo - Backend pronto, frontend parcialmente migrado. Arquivos críticos atualizados, migrações manuais listadas acima.
