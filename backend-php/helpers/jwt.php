<?php
// backend-php/helpers/jwt.php

class JWT {
    private static $algorithm = 'HS256';

    public static function encode($data) {
        $header = self::base64UrlEncode(json_encode([
            'alg' => self::$algorithm,
            'typ' => 'JWT'
        ]));

        $payload = self::base64UrlEncode(json_encode(array_merge(
            $data,
            ['iat' => time(), 'exp' => time() + ($_ENV['JWT_EXPIRATION'] ?? 86400)]
        )));

        $signature = self::base64UrlEncode(self::sign($header . '.' . $payload));

        return $header . '.' . $payload . '.' . $signature;
    }

    public static function decode($token) {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return null;
        }

        [$header, $payload, $signature] = $parts;

        // Verify signature
        $expectedSignature = self::base64UrlEncode(self::sign($header . '.' . $payload));
        if (!hash_equals($expectedSignature, $signature)) {
            return null;
        }

        $data = json_decode(self::base64UrlDecode($payload), true);

        // Check expiration
        if (isset($data['exp']) && $data['exp'] < time()) {
            return null;
        }

        return $data;
    }

    private static function sign($message) {
        return hash_hmac('sha256', $message, $_ENV['JWT_SECRET'] ?? 'secret', true);
    }

    private static function base64UrlEncode($data) {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }

    private static function base64UrlDecode($data) {
        $padding = strlen($data) % 4;
        if ($padding) {
            $data .= str_repeat('=', 4 - $padding);
        }
        return base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
    }
}

function getAuthUser() {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? '';

    if (empty($auth) || !preg_match('/Bearer\s+(.+)/i', $auth, $matches)) {
        return null;
    }

    $token = $matches[1];
    return JWT::decode($token);
}

function requireAuth() {
    $user = getAuthUser();
    if (!$user) {
        respondError('Não autorizado', 401);
        exit;
    }
    return $user;
}

?>
