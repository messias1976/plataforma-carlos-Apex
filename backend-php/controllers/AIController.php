<?php
// backend-php/controllers/AIController.php

class AIController {
    private static function env(string $key, ?string $default = null): ?string {
        $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);

        if ($value === false || $value === null) {
            return $default;
        }

        $value = trim((string) $value);
        return $value === '' ? $default : $value;
    }

    private static function buildMessages($body): array {
        if (isset($body['messages']) && is_array($body['messages']) && count($body['messages']) > 0) {
            return $body['messages'];
        }

        if (isset($body['message']) && is_array($body['message']) && count($body['message']) > 0) {
            return $body['message'];
        }

        $message = $body['message'] ?? null;
        if (is_string($message) && trim($message) !== '') {
            return [
                [
                    'role' => 'user',
                    'content' => trim($message)
                ]
            ];
        }

        return [];
    }

    private static function callOpenAI(array $payload, string $apiKey): array {
        $url = 'https://api.openai.com/v1/chat/completions';

        if (function_exists('curl_init')) {
            $ch = curl_init($url);

            curl_setopt_array($ch, [
                CURLOPT_POST => true,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 60,
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'Authorization: Bearer ' . $apiKey,
                ],
                CURLOPT_POSTFIELDS => json_encode($payload),
            ]);

            $raw = curl_exec($ch);
            $curlError = curl_error($ch);
            $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($raw === false) {
                throw new RuntimeException('Falha ao conectar na OpenAI: ' . $curlError);
            }

            return [$status, $raw];
        }

        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/json\r\nAuthorization: Bearer {$apiKey}\r\n",
                'content' => json_encode($payload),
                'timeout' => 60,
            ],
        ]);

        $raw = @file_get_contents($url, false, $context);
        $status = 0;

        if (isset($http_response_header) && is_array($http_response_header)) {
            foreach ($http_response_header as $headerLine) {
                if (preg_match('#HTTP/\S+\s+(\d{3})#', $headerLine, $matches)) {
                    $status = (int) $matches[1];
                    break;
                }
            }
        }

        if ($raw === false) {
            throw new RuntimeException('Falha ao conectar na OpenAI.');
        }

        return [$status, $raw];
    }

    public static function chat() {
        try {
            requireAuth();

            $apiKey = self::env('OPENAI_API_KEY');
            if (!$apiKey) {
                respondError('OPENAI_API_KEY não configurada no backend.', 500);
            }

            $model = self::env('OPENAI_MODEL', 'gpt-4o-mini');
            $body = getJsonBody();
            $messages = self::buildMessages($body);

            if (count($messages) === 0) {
                respondError('Mensagem é obrigatória.', 400);
            }

            $payload = [
                'model' => $model,
                'messages' => $messages,
                'temperature' => 0.7,
            ];

            [$status, $raw] = self::callOpenAI($payload, $apiKey);
            $response = json_decode($raw, true);

            if (!is_array($response)) {
                respondError('Resposta inválida da OpenAI.', 502);
            }

            if ($status >= 400) {
                $apiError = $response['error']['message'] ?? 'Erro ao processar a requisição na OpenAI.';
                respondError($apiError, 502);
            }

            $reply = $response['choices'][0]['message']['content'] ?? null;
            if (!$reply) {
                respondError('OpenAI retornou resposta vazia.', 502);
            }

            respondSuccess([
                'reply' => $reply,
                'model' => $model,
            ], 'Resposta da IA gerada com sucesso');
        } catch (Throwable $e) {
            respondError('Erro ao processar chat da IA: ' . $e->getMessage(), 500);
        }
    }
}

?>