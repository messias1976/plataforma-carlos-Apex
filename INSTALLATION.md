# Pré-requisitos e Instalação

## ✅ Requisitos da Sistema

Antes de começar, certifique-se de que tem:

- **PHP 7.4+** (com PDO e extensões MySQL)
- **MySQL 5.7+** ou **MariaDB 10.3+**
- **Node.js 16+** (para o frontend)
- **npm** ou **yarn**

## 🪟 Instalação no Windows

### 1. PHP

#### Opção A: XAMPP (Recomendado)

1. Baixe [XAMPP](https://www.apachefriends.org/) (inclui PHP 7.4+, MySQL, Apache)
2. Instale em `C:\xampp`
3. Inicie o painel XAMPP
4. Ative **Apache** e **MySQL**

```bash
# Verifique a instalação
# Adicione C:\xampp\php ao PATH do Windows
php --version
```

#### Opção B: PHP Standalone

1. Baixe PHP de [php.net](https://windows.php.net/download/)
2. Extraia em `C:\php`
3. Copie `php.ini-development` para `php.ini`
4. Ative extensões em `php.ini`:

```ini
extension=pdo
extension=pdo_mysql
extension=json
```

5. Adicione `C:\php` ao PATH do Windows
6. Reinicie o terminal

### 2. MySQL

Opção A: Com XAMPP (já incluso)

Opção B: Instalar separadamente

1. Baixe [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
2. Instale com installer
3. Configure root password
4. Inicie o serviço MySQL:

```bash
# PowerShell com Admin
Start-Service MySQL80  # Ajuste número da versão
```

### 3. Node.js

1. Baixe de [nodejs.org](https://nodejs.org/)
2. Instale a versão LTS
3. Verifique:

```bash
node --version
npm --version
```

## 🐧 Instalação no Linux (Ubuntu/Debian)

### 1. PHP

```bash
sudo apt-get update
sudo apt-get install php php-cli php-mysql php-pdo php-json
sudo apt-get install apache2 libapache2-mod-php
```

Ative mod_rewrite:

```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### 2. MySQL

```bash
sudo apt-get install mysql-server
sudo mysql_secure_installation
sudo systemctl start mysql
```

### 3. Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 🍎 Instalação no macOS

### 1. PHP

```bash
# Via Homebrew
brew install php
brew install mysql
```

Ou use MAMP (similar ao XAMPP):

1. Baixe [MAMP](https://www.mamp.info/)
2. Instale e inicie
3. Configure no seu editor

### 2. MySQL

```bash
brew install mysql
brew services start mysql
```

### 3. Node.js

```bash
brew install node
```

## 📋 Verificação de Instalação

Após instalar, execute os comandos abaixo para verificar:

```bash
# Verificar PHP
php -v

# Verificar MySQL
mysql --version

# Verificar Node.js
node -v
npm -v
```

## 🗄️ Criar Banco de Dados

### Windows (XAMPP)

1. Abra **phpMyAdmin** em `http://localhost/phpmyadmin`
2. Crie nova database: `horizons_db`
3. Importe arquivo `database-schema-mysql.sql`:
   - Selecione `horizons_db`
   - Clique em "Importar"
   - Selecione `database-schema-mysql.sql`
   - Clique "Executar"

### Terminal (Todos OS)

```bash
# Conecte ao MySQL
mysql -u root -p

# Dentro do MySQL:
CREATE DATABASE horizons_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE horizons_db;
SOURCE /path/to/database-schema-mysql.sql;
EXIT;
```

Ou:

```bash
mysql -u root -p horizons_db < database-schema-mysql.sql
```

## 🚀 Iniciar Desenvolvimento

### Terminal 1 - Backend

```bash
# Navegue até a pasta
cd backend-php

# Configure ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Inicie servidor PHP
cd public
php -S localhost:8000
```

### Terminal 2 - Frontend

```bash
# Na raiz do projeto
npm install  # Se não tiver feito ainda
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173)

## ✅ Validação

Após iniciar, teste:

```bash
# Health check
curl http://localhost:8000

# Deve retornar JSON com mensagem de sucesso
```

## 🆘 Troubleshooting

### "Can't connect to MySQL"

```bash
# Verifique se MySQL está rodando
sudo systemctl status mysql  # Linux/Mac
# ou Start-Service MySQL80  # Windows

# Verifique credenciais
mysql -u root -p  # Digite a senha
```

### "Port 8000 already in use"

```bash
# Mude a porta
cd backend-php/public
php -S localhost:9000

# Atualize .env:
# API_BASE_URL=http://localhost:9000
# CORS_ALLOWED_ORIGINS=...localhost:9000...
```

### "mod_rewrite not enabled"

```bash
# Linux
sudo a2enmod rewrite
sudo systemctl restart apache2

# Windows - Configure Apache em XAMPP
```

---

✅ Pronto! Você está configurado para desenvolver.
