<?php

if (!class_exists('UploadsController')) {
class UploadsController {
    private static function uploadErrorMessage($errorCode) {
        $messages = [
            UPLOAD_ERR_INI_SIZE => 'Arquivo excede upload_max_filesize do PHP.',
            UPLOAD_ERR_FORM_SIZE => 'Arquivo excede o tamanho máximo permitido pelo formulário.',
            UPLOAD_ERR_PARTIAL => 'Upload parcial do arquivo.',
            UPLOAD_ERR_NO_FILE => 'Nenhum arquivo foi enviado.',
            UPLOAD_ERR_NO_TMP_DIR => 'Diretório temporário do PHP não encontrado.',
            UPLOAD_ERR_CANT_WRITE => 'Falha ao escrever arquivo no disco.',
            UPLOAD_ERR_EXTENSION => 'Upload interrompido por extensão do PHP.',
        ];

        return $messages[$errorCode] ?? ('Erro desconhecido de upload (código ' . $errorCode . ').');
    }

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

        if (!isset($_FILES['file'])) {
            respondError('Arquivo inválido para upload: campo file ausente.', 400);
        }

        if (($_FILES['file']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            $uploadErrorCode = (int) ($_FILES['file']['error'] ?? UPLOAD_ERR_NO_FILE);
            respondError(self::uploadErrorMessage($uploadErrorCode), 400, [
                'code' => $uploadErrorCode,
            ]);
        }

        $dir = self::ensureUploadsDir();
        if (!is_writable($dir)) {
            respondError('Diretório de uploads sem permissão de escrita.', 500, [
                'path' => $dir,
            ]);
        }

        $file = $_FILES['file'];
        if (empty($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            respondError('Arquivo temporário inválido para upload.', 400);
        }

        $originalName = $file['name'] ?? 'file';
        $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        $safeExt = preg_replace('/[^a-z0-9]/i', '', $ext);
        $filename = uniqid('upl_', true) . ($safeExt ? ('.' . $safeExt) : '');

        $target = $dir . '/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $target)) {
            $lastError = error_get_last();
            respondError('Falha ao mover arquivo no servidor', 500, [
                'target' => $target,
                'details' => $lastError['message'] ?? null,
            ]);
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
