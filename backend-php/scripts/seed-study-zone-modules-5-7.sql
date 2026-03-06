-- seed-study-zone-modules-5-7.sql
-- Cria conteudos de teste para os modulos 5, 6 e 7 na Study Zone.
-- Script idempotente: so insere se ainda nao houver conteudo no modulo.

START TRANSACTION;

-- Modulo 5 - Prova
INSERT INTO contents (title, type, description, data, created_at)
SELECT
  'Modulo 5 - Prova: Controle emocional',
  'content',
  'Tecnicas para nao travar na hora da prova.',
  JSON_OBJECT(
    'topic_id', '5',
    'module_id', '5',
    'content_type', 'text',
    'order_index', 1,
    'content_text', '<h2>Modulo 5 - Prova</h2><p>Respire fundo, leia todo o enunciado e comece pelas questoes mais faceis.</p>'
  ),
  NOW()
WHERE NOT EXISTS (
  SELECT 1
  FROM contents c
  WHERE c.type IN ('content', 'lesson')
    AND (
      JSON_UNQUOTE(JSON_EXTRACT(COALESCE(c.data, JSON_OBJECT()), '$.topic_id')) = '5'
      OR JSON_UNQUOTE(JSON_EXTRACT(COALESCE(c.data, JSON_OBJECT()), '$.module_id')) = '5'
    )
);

-- Modulo 6 - Constancia
INSERT INTO contents (title, type, description, data, created_at)
SELECT
  'Modulo 6 - Constancia: Rotina semanal',
  'content',
  'Como manter ritmo de estudo sem desistir.',
  JSON_OBJECT(
    'topic_id', '6',
    'module_id', '6',
    'content_type', 'text',
    'order_index', 1,
    'content_text', '<h2>Modulo 6 - Constancia</h2><p>Defina metas pequenas diarias e acompanhe seu progresso semanal.</p>'
  ),
  NOW()
WHERE NOT EXISTS (
  SELECT 1
  FROM contents c
  WHERE c.type IN ('content', 'lesson')
    AND (
      JSON_UNQUOTE(JSON_EXTRACT(COALESCE(c.data, JSON_OBJECT()), '$.topic_id')) = '6'
      OR JSON_UNQUOTE(JSON_EXTRACT(COALESCE(c.data, JSON_OBJECT()), '$.module_id')) = '6'
    )
);

-- Modulo 7 - Mentalidade
INSERT INTO contents (title, type, description, data, created_at)
SELECT
  'Modulo 7 - Mentalidade: Autoconfianca',
  'content',
  'Como parar de se sentir incapaz durante os estudos.',
  JSON_OBJECT(
    'topic_id', '7',
    'module_id', '7',
    'content_type', 'text',
    'order_index', 1,
    'content_text', '<h2>Modulo 7 - Mentalidade</h2><p>Troque a comparacao por consistencia: evolucao diaria vale mais que perfeicao.</p>'
  ),
  NOW()
WHERE NOT EXISTS (
  SELECT 1
  FROM contents c
  WHERE c.type IN ('content', 'lesson')
    AND (
      JSON_UNQUOTE(JSON_EXTRACT(COALESCE(c.data, JSON_OBJECT()), '$.topic_id')) = '7'
      OR JSON_UNQUOTE(JSON_EXTRACT(COALESCE(c.data, JSON_OBJECT()), '$.module_id')) = '7'
    )
);

-- Conferencia final
SELECT
  COALESCE(
    NULLIF(JSON_UNQUOTE(JSON_EXTRACT(data, '$.topic_id')), ''),
    NULLIF(JSON_UNQUOTE(JSON_EXTRACT(data, '$.module_id')), ''),
    '(sem_modulo)'
  ) AS module_key,
  COUNT(*) AS total
FROM contents
WHERE type IN ('content', 'lesson')
GROUP BY module_key
ORDER BY module_key;

COMMIT;

-- Se precisar desfazer antes do COMMIT:
-- ROLLBACK;
