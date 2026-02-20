<?php

if (!class_exists('UploadsController')) {
class UploadsController {
    private static function uploadsDir() {
        return dirname(__DIR__) . '/uploads';
    }

    private static function ensureUploadsDir() {
        $dir = self::uploadsDir();
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        return $dir;
    }

    private static function getAuthUserFromQueryToken() {
        $token = $_GET['token'] ?? null;
        if (!$token) return null;
        return JWT::decode($token);
    }

    private static function requireAuthOrToken() {
        $user = getAuthUser();
        if ($user) return $user;

        $user = self::getAuthUserFromQueryToken();
        if ($user) return $user;

        respondError('Não autorizado', 401);
        exit;
    }

    public static function upload() {
        requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            respondError('Método não permitido', 405);
        }

        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            respondError('Arquivo inválido para upload', 400);
        }

        $dir = self::ensureUploadsDir();
        $file = $_FILES['file'];

        $originalName = $file['name'] ?? 'file';
        $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        $safeExt = preg_replace('/[^a-z0-9]/i', '', $ext);
        $filename = uniqid('upl_', true) . ($safeExt ? ('.' . $safeExt) : '');

        $target = $dir . '/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $target)) {
            respondError('Falha ao mover arquivo no servidor', 500);
        }

        respondSuccess([
            'url' => '/api/uploads/' . $filename,
            'filename' => $filename,
        ], 'Upload realizado com sucesso', 201);
    }

    public static function getFile($filename) {
        self::requireAuthOrToken();

        $safeFilename = basename($filename);
        $fullPath = self::uploadsDir() . '/' . $safeFilename;

        if (!is_file($fullPath)) {
            respondError('Arquivo não encontrado', 404);
        }

        $mime = mime_content_type($fullPath) ?: 'application/octet-stream';
        header('Content-Type: ' . $mime);
        header('Content-Length: ' . filesize($fullPath));
        header('Cache-Control: private, max-age=300');
        readfile($fullPath);
        exit;
    }
}
}
