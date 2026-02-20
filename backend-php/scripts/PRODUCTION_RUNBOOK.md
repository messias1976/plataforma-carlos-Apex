# Apex Estudos - Runbook de correção em produção

## 1) Aplicar patch de schema

1. Faça backup do banco.
2. Execute o SQL:

```bash
mysql -u SEU_USUARIO -p SEU_BANCO < backend-php/scripts/add-missing-columns-safe.sql
```

3. Valide colunas:

```sql
SHOW COLUMNS FROM user_profiles LIKE 'language_preference';
SHOW COLUMNS FROM contents LIKE 'data';
```

## 2) Garantir permissões de upload

```bash
chmod +x backend-php/scripts/fix-uploads-permissions.sh
./backend-php/scripts/fix-uploads-permissions.sh
```

Se necessário, ajuste o diretório:

```bash
UPLOAD_DIR="/caminho/real/da/api/backend-php/uploads" ./backend-php/scripts/fix-uploads-permissions.sh
```

## 3) Ajustar PHP para upload

No php.ini (FPM/Apache), confirmar:

```ini
upload_max_filesize = 100M
post_max_size = 100M
max_execution_time = 300
max_input_time = 300
memory_limit = 256M
```

Depois reinicie o serviço:

```bash
sudo systemctl restart php8.1-fpm
# ou
sudo systemctl restart apache2
```

## 4) Nginx (se aplicável)

- Definir `client_max_body_size 100M;`
- Garantir proxy correto para `/api` e, se houver WebSocket, rota `/ws` com headers `Upgrade`.

## 5) Checklist de validação

- `GET /api/user/profile` retorna JSON sem SQL error.
- `GET /api/content?moduleId=1` retorna JSON sem SQL error.
- Upload via admin retorna `201` e cria arquivo em `backend-php/uploads`.
- Abrir URL retornada do upload (`/api/uploads/{arquivo}`) com token e validar download.

## 6) Observação sobre WebSocket localhost

Erro `ws://localhost:8081` em produção indica configuração de dev no frontend/plugin. Não afeta upload, mas deve ser trocado para endpoint público (`wss://.../ws`) ou removido em build de produção.
