<?php
// backend-php/config/database.php

class Database {
    private static $connection = null;

    public static function getConnection() {
        if (self::$connection === null) {
            try {
                $host = $_ENV['DB_HOST'] ?? 'localhost';
                $port = $_ENV['DB_PORT'] ?? '3306';
                $database = $_ENV['DB_NAME'] ?? 'horizons_db';
                $user = $_ENV['DB_USER'] ?? 'root';
                $password = $_ENV['DB_PASSWORD'] ?? '';

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
