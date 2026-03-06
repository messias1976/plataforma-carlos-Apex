-- audit-fix-study-zone-modules.sql
-- Purpose: audit and fix module mapping (topic_id/module_id) for Study Zone modules 1..7
-- Target DB: MySQL 8+

-- ============================================================
-- 0) SAFETY FIRST
-- ============================================================
-- 1) Run this in a maintenance window when possible.
-- 2) Keep a DB backup before execution.
-- 3) The script only touches rows where type in ('content','lesson').

START TRANSACTION;

-- Backup of current study content rows
DROP TABLE IF EXISTS contents_backup_study_zone_20260306;
CREATE TABLE contents_backup_study_zone_20260306 AS
SELECT *
FROM contents
WHERE type IN ('content', 'lesson');

-- ============================================================
-- 1) AUDIT BEFORE FIX
-- ============================================================
SELECT
  id,
  title,
  type,
  JSON_UNQUOTE(JSON_EXTRACT(data, '$.topic_id')) AS topic_id,
  JSON_UNQUOTE(JSON_EXTRACT(data, '$.module_id')) AS module_id,
  JSON_UNQUOTE(JSON_EXTRACT(data, '$.content_type')) AS content_type,
  created_at
FROM contents
WHERE type IN ('content', 'lesson')
ORDER BY id;

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

-- ============================================================
-- 2) HEURISTIC FIX FOR UNMAPPED CONTENT
-- ============================================================
-- Rule: only rows without topic_id and without module_id are updated.
-- Heuristic uses title/description keywords. Adjust keywords if needed.

-- Module 1: foco
UPDATE contents
SET data = JSON_SET(COALESCE(data, JSON_OBJECT()), '$.topic_id', '1', '$.module_id', '1')
WHERE type IN ('content', 'lesson')
  AND JSON_EXTRACT(COALESCE(data, JSON_OBJECT()), '$.topic_id') IS NULL
  AND JSON_EXTRACT(COALESCE(data, JSON_OBJECT()), '$.module_id') IS NULL
  AND (
    LOWER(COALESCE(title, '')) REGEXP 'modulo[[:space:]]*1|foco'
    OR LOWER(COALESCE(description, '')) REGEXP 'modulo[[:space:]]*1|foco'
  );

-- Module 2: tempo
UPDATE contents
SET data = JSON_SET(COALESCE(data, JSON_OBJECT()), '$.topic_id', '2', '$.module_id', '2')
WHERE type IN ('content', 'lesson')
  AND JSON_EXTRACT(COALESCE(data, JSON_OBJECT()), '$.topic_id') IS NULL
  AND JSON_EXTRACT(COALESCE(data, JSON_OBJECT()), '$.module_id') IS NULL
  AND (
    LOWER(COALESCE(title, '')) REGEXP 'modulo[[:space:]]*2|tempo'
    OR LOWER(COALESCE(description, '')) REGEXP 'modulo[[:space:]]*2|tempo'
  );

-- Module 3: atencao
UPDATE contents
SET data = JSON_SET(COALESCE(data, JSON_OBJECT()), '$.topic_id', '3', '$.module_id', '3')
WHERE type IN ('content', 'lesson')
  AND JSON_EXTRACT(COALESCE(data, JSON_OBJECT()), '$.topic_id') IS NULL
  AND JSON_EXTRACT(COALESCE(data, JSON_OBJECT()), '$.module_id') IS NULL
  AND (
    LOWER(COALESCE(title, '')) REGEXP 'modulo[[:space:]]*3|atencao'
    OR LOWER(COALESCE(description, '')) REGEXP 'modulo[[:space:]]*3|atencao'
  );

-- Module 4: memoria
UPDATE contents
SET data = JSON_SET(COALESCE(data, JSON_OBJECT()), '$.topic_id', '4', '$.module_id', '4')
WHERE type IN ('content', 'lesson')
  AND JSON_EXTRACT(COALESCE(data, JSON_OBJECT()), '$.topic_id') IS NULL
  AND JSON_EXTRACT(COALESCE(data, JSON_OBJECT()), '$.module_id') IS NULL
  AND (
    LOWER(COALESCE(title, '')) REGEXP 'modulo[[:space:]]*4|memoria'
    OR LOWER(COALESCE(description, '')) REGEXP 'modulo[[:space:]]*4|memoria'
  );

-- Module 5: prova
UPDATE contents
SET data = JSON_SET(COALESCE(data, JSON_OBJECT()), '$.topic_id', '5', '$.module_id', '5')
WHERE type IN ('content', 'lesson')
  AND JSON_EXTRACT(COALESCE(data, JSON_OBJECT()), '$.topic_id') IS NULL
  AND JSON_EXTRACT(COALESCE(data, JSON_OBJECT()), '$.module_id') IS NULL
  AND (
    LOWER(COALESCE(title, '')) REGEXP 'modulo[[:space:]]*5|prova'
    OR LOWER(COALESCE(description, '')) REGEXP 'modulo[[:space:]]*5|prova'
  );

-- Module 6: constancia
UPDATE contents
SET data = JSON_SET(COALESCE(data, JSON_OBJECT()), '$.topic_id', '6', '$.module_id', '6')
WHERE type IN ('content', 'lesson')
  AND JSON_EXTRACT(COALESCE(data, JSON_OBJECT()), '$.topic_id') IS NULL
  AND JSON_EXTRACT(COALESCE(data, JSON_OBJECT()), '$.module_id') IS NULL
  AND (
    LOWER(COALESCE(title, '')) REGEXP 'modulo[[:space:]]*6|constancia'
    OR LOWER(COALESCE(description, '')) REGEXP 'modulo[[:space:]]*6|constancia'
  );

-- Module 7: mentalidade
UPDATE contents
SET data = JSON_SET(COALESCE(data, JSON_OBJECT()), '$.topic_id', '7', '$.module_id', '7')
WHERE type IN ('content', 'lesson')
  AND JSON_EXTRACT(COALESCE(data, JSON_OBJECT()), '$.topic_id') IS NULL
  AND JSON_EXTRACT(COALESCE(data, JSON_OBJECT()), '$.module_id') IS NULL
  AND (
    LOWER(COALESCE(title, '')) REGEXP 'modulo[[:space:]]*7|mentalidade'
    OR LOWER(COALESCE(description, '')) REGEXP 'modulo[[:space:]]*7|mentalidade'
  );

-- ============================================================
-- 3) MANUAL FIX TEMPLATE (FOR REMAINING UNMAPPED)
-- ============================================================
-- Fill this temporary table with exact content IDs for final mapping.
DROP TEMPORARY TABLE IF EXISTS study_zone_manual_map;
CREATE TEMPORARY TABLE study_zone_manual_map (
  content_id INT PRIMARY KEY,
  module_id TINYINT NOT NULL
);

-- Example:
-- INSERT INTO study_zone_manual_map (content_id, module_id) VALUES
-- (101, 1),
-- (102, 2),
-- (103, 3);

-- Current production rows observed on 2026-03-06:
-- 11 (teste doc), 12 (teste texto), 13 (teste audio), 14 (teste video)
-- Adjust these IDs if your environment differs.
INSERT INTO study_zone_manual_map (content_id, module_id) VALUES
(11, 1),
(12, 2),
(13, 3),
(14, 4)
ON DUPLICATE KEY UPDATE module_id = VALUES(module_id);

UPDATE contents c
JOIN study_zone_manual_map m ON m.content_id = c.id
SET c.data = JSON_SET(COALESCE(c.data, JSON_OBJECT()), '$.topic_id', CAST(m.module_id AS CHAR), '$.module_id', CAST(m.module_id AS CHAR))
WHERE c.type IN ('content', 'lesson');

-- Ensure content_type is present for the mapped rows (adjust as needed).
UPDATE contents c
JOIN study_zone_manual_map m ON m.content_id = c.id
SET c.data = JSON_SET(
  COALESCE(c.data, JSON_OBJECT()),
  '$.content_type',
  CASE
    WHEN m.module_id = 1 THEN 'document'
    WHEN m.module_id = 2 THEN 'text'
    WHEN m.module_id = 3 THEN 'audio'
    WHEN m.module_id = 4 THEN 'video'
    ELSE COALESCE(JSON_UNQUOTE(JSON_EXTRACT(COALESCE(c.data, JSON_OBJECT()), '$.content_type')), 'text')
  END
)
WHERE c.type IN ('content', 'lesson');

-- ============================================================
-- 4) AUDIT AFTER FIX
-- ============================================================
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

SELECT
  id,
  title,
  JSON_UNQUOTE(JSON_EXTRACT(data, '$.topic_id')) AS topic_id,
  JSON_UNQUOTE(JSON_EXTRACT(data, '$.module_id')) AS module_id,
  JSON_UNQUOTE(JSON_EXTRACT(data, '$.content_type')) AS content_type
FROM contents
WHERE type IN ('content', 'lesson')
ORDER BY id;

-- If results are good:
COMMIT;

-- If you need to revert before commit, run:
-- ROLLBACK;
