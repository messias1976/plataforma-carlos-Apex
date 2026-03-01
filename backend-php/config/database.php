<?php
// backend-php/config/database.php

class Database {
    private static $connection = null;

    private static function env(string $key, ?string $default = null): ?string {
        $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);

        if ($value === false || $value === null) {
            return $default;
        }

        $value = trim((string) $value);
        return $value === '' ? $default : $value;
    }

    public static function getConnection() {
        if (self::$connection === null) {
            try {
                $host = self::env('DB_HOST');
                $port = self::env('DB_PORT', '3306');
                $database = self::env('DB_NAME');
                $user = self::env('DB_USER');
                $password = self::env('DB_PASSWORD', '');

                if (!$host || !$database || !$user) {
                    respondError('Configuração de banco incompleta. Defina DB_HOST, DB_NAME e DB_USER no arquivo .env do backend.', 500);
                    exit;
                }

                $dsn = "mysql:host=$host;port=$port;dbname=$database;charset=utf8mb4";
                
                self::$connection = new PDO($dsn, $user, $password, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
                ]);

                return self::$connection;
            } catch (PDOException $e) {
                respondError('Erro ao conectar ao banco de dados: ' . $e->getMessage(), 500);
                exit;
            }
        }

        return self::$connection;
    }
}

$db = Database::getConnection();
$pdo = $db;

?>
