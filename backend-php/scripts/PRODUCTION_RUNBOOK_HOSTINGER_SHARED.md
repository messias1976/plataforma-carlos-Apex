# Apex Estudos - Runbook (Hostinger Shared)

Este guia é específico para **Hostinger Shared** (sem acesso root para editar Nginx/PHP-FPM diretamente).

## 1) Publicar arquivos atualizados

No Gerenciador de Arquivos da Hostinger, envie os arquivos mais recentes para o backend:

- `backend-php/public/index.php`
- `backend-php/routes/api.php`
- `backend-php/controllers/UploadsController.php`
- `backend-php/controllers/TopicContentController.php`
- `backend-php/models/User.php`

## 2) Corrigir schema do banco (phpMyAdmin)

1. Abra **hPanel > Bancos de Dados > phpMyAdmin**.
2. Selecione o banco da aplicação.
3. Execute o conteúdo de `backend-php/scripts/add-missing-columns-safe.sql`.

Validação:

```sql
SHOW COLUMNS FROM user_profiles LIKE 'language_preference';
SHOW COLUMNS FROM contents LIKE 'data';
```

## 3) Ajustar pasta de upload no File Manager

1. Garanta que exista a pasta `backend-php/uploads`.
2. Permissões recomendadas:
   - pasta `uploads`: `775`
   - arquivos dentro dela: `664`
3. Se a Hostinger não permitir `775`, use `755` e valide escrita via aplicação.

## 4) Ajustar limites de PHP no hPanel

Em **hPanel > PHP Configuration / PHP Options**, configurar:

- `upload_max_filesize = 100M`
- `post_max_size = 100M`
- `max_execution_time = 300`
- `max_input_time = 300`
- `memory_limit = 256M`

Depois salve e aguarde a aplicação das configurações.

### Validação rápida (baseado no hPanel)

Se você está em PHP 8.3 na Hostinger, estes valores estão adequados para upload:

- `maxExecutionTime = 300`
- `maxInputTime = 300`
- `memoryLimit = 512M`
- `postMaxSize = 256M`
- `uploadMaxFilesize = 256M`

Pontos críticos que precisam estar corretos para o upload funcionar:

- `fileUploads = On`
- `openBasedir` deve permitir o caminho real do projeto, incluindo a pasta `backend-php/uploads`
- `displayErrors = Off` e `logErrors = On` (evita HTML no JSON e mantém logs)

## 5) Limpar cache da Hostinger

No hPanel do site, clique em **Limpar cache**.

## 6) Checklist de validação

1. `GET https://apexestudos.com/api/user/profile` com header `Authorization: Bearer <TOKEN>` retorna JSON sem erro SQL.
2. `GET https://apexestudos.com/api/content?moduleId=1` retorna JSON sem erro SQL.
3. Upload no admin retorna `201` e cria arquivo em `backend-php/uploads`.
4. Abrir URL de arquivo (`/api/uploads/{arquivo}`) com token funciona.

Exemplos rápidos:

```bash
curl -H "Authorization: Bearer SEU_TOKEN" https://apexestudos.com/api/user/profile
curl -H "Authorization: Bearer SEU_TOKEN" "https://apexestudos.com/api/uploads/NOME_DO_ARQUIVO"
```

## 7) Observação sobre WebSocket em produção

Erro `ws://localhost:8081` é configuração de dev. Em produção:

- usar endpoint público (`wss://apexestudos.com/ws`), **ou**
- desabilitar o cliente WebSocket se não for essencial.

Em Hostinger Shared, proxy WebSocket custom no Nginx geralmente não fica disponível para edição direta.