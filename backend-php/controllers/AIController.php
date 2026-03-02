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

    private static function normalizeQuestions($questions): array {
        if (!is_array($questions)) {
            return [];
        }

        $normalized = [];

        foreach ($questions as $item) {
            if (!is_array($item)) {
                continue;
            }

            $question = trim((string) ($item['question'] ?? ''));
            $options = $item['options'] ?? [];
            $correct = $item['correct'] ?? null;

            if ($question === '' || !is_array($options) || count($options) !== 4) {
                continue;
            }

            $cleanOptions = [];
            foreach ($options as $opt) {
                $text = trim((string) $opt);
                if ($text === '') {
                    $cleanOptions = [];
                    break;
                }
                $cleanOptions[] = $text;
            }

            if (count($cleanOptions) !== 4) {
                continue;
            }

            $correctIndex = is_numeric($correct) ? (int) $correct : -1;
            if ($correctIndex < 0 || $correctIndex > 3) {
                continue;
            }

            $normalized[] = [
                'question' => $question,
                'options' => $cleanOptions,
                'correct' => $correctIndex,
            ];
        }

        return $normalized;
    }

    public static function generateExam() {
        try {
            requireAuth();

            $apiKey = self::env('OPENAI_API_KEY');
            if (!$apiKey) {
                respondError('OPENAI_API_KEY não configurada no backend.', 500);
            }

            $model = self::env('OPENAI_MODEL', 'gpt-4o-mini');
            $body = getJsonBody();

            $disciplina = trim((string) ($body['disciplina'] ?? 'Geral'));
            $tema = trim((string) ($body['tema'] ?? ''));
            $nivel = trim((string) ($body['nivel'] ?? 'médio'));

            if ($tema === '') {
                respondError('Tema é obrigatório para gerar a prova.', 400);
            }

            $systemPrompt = 'Você é um professor especialista em elaboração de provas. Responda apenas com JSON válido no formato solicitado.';
            $userPrompt = "Gere exatamente 5 questões de múltipla escolha sobre o tema '{$tema}', disciplina '{$disciplina}', nível '{$nivel}'. Cada questão deve ter 4 alternativas e um índice correto (0 a 3).";

            $payload = [
                'model' => $model,
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $userPrompt],
                ],
                'temperature' => 0.5,
                'response_format' => [
                    'type' => 'json_schema',
                    'json_schema' => [
                        'name' => 'exam_questions',
                        'schema' => [
                            'type' => 'object',
                            'properties' => [
                                'questions' => [
                                    'type' => 'array',
                                    'minItems' => 5,
                                    'maxItems' => 5,
                                    'items' => [
                                        'type' => 'object',
                                        'properties' => [
                                            'question' => ['type' => 'string'],
                                            'options' => [
                                                'type' => 'array',
                                                'minItems' => 4,
                                                'maxItems' => 4,
                                                'items' => ['type' => 'string']
                                            ],
                                            'correct' => ['type' => 'integer', 'minimum' => 0, 'maximum' => 3]
                                        ],
                                        'required' => ['question', 'options', 'correct'],
                                        'additionalProperties' => false
                                    ]
                                ]
                            ],
                            'required' => ['questions'],
                            'additionalProperties' => false
                        ]
                    ]
                ]
            ];

            [$status, $raw] = self::callOpenAI($payload, $apiKey);
            $response = json_decode($raw, true);

            if (!is_array($response)) {
                respondError('Resposta inválida da OpenAI.', 502);
            }

            if ($status >= 400) {
                $apiError = $response['error']['message'] ?? 'Erro ao processar a geração da prova na OpenAI.';
                respondError($apiError, 502);
            }

            $content = $response['choices'][0]['message']['content'] ?? '';
            if (!is_string($content) || trim($content) === '') {
                respondError('OpenAI retornou conteúdo vazio para a prova.', 502);
            }

            $decoded = json_decode($content, true);
            if (!is_array($decoded)) {
                respondError('OpenAI retornou JSON inválido para a prova.', 502);
            }

            $questions = self::normalizeQuestions($decoded['questions'] ?? []);
            if (count($questions) < 5) {
                respondError('A IA não retornou questões válidas suficientes.', 502);
            }

            respondSuccess([
                'questions' => array_slice($questions, 0, 5),
                'topic' => $tema,
                'subject' => $disciplina,
                'level' => $nivel,
                'model' => $model,
            ], 'Prova gerada com sucesso');
        } catch (Throwable $e) {
            respondError('Erro ao gerar prova com IA: ' . $e->getMessage(), 500);
        }
    }

    public static function chat() {
        try {
            requireAuth();

            $apiKey = self::env('OPENAI_API_KEY');
            error_log('[AI] OPENAI_API_KEY loaded: ' . ($apiKey ? 'yes' : 'no'));
            if (!$apiKey) {
                respondError('OPENAI_API_KEY não configurada no backend.', 500);
            }

            $model = self::env('OPENAI_MODEL', 'gpt-4o-mini');
            error_log('[AI] Model: ' . $model . ' | curl: ' . (function_exists('curl_init') ? 'enabled' : 'disabled'));
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
            error_log('[AI] OpenAI HTTP status: ' . $status);
            $response = json_decode($raw, true);

            if (!is_array($response)) {
                respondError('Resposta inválida da OpenAI.', 502);
            }

            if ($status >= 400) {
                error_log('[AI] OpenAI error payload: ' . substr((string) $raw, 0, 500));
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