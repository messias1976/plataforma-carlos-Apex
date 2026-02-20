-- Apex Estudos: correções seguras de schema (idempotentes)
-- Execute no banco ativo da aplicação.

SET @db := DATABASE();

-- 1) user_profiles.language_preference
SELECT COUNT(*) INTO @has_user_profiles
FROM information_schema.tables
WHERE table_schema = @db AND table_name = 'user_profiles';

SELECT COUNT(*) INTO @has_lang_pref
FROM information_schema.columns
WHERE table_schema = @db
  AND table_name = 'user_profiles'
  AND column_name = 'language_preference';

SET @sql := IF(
  @has_user_profiles = 1 AND @has_lang_pref = 0,
  'ALTER TABLE user_profiles ADD COLUMN language_preference VARCHAR(10) DEFAULT ''pt-BR''',
  'SELECT ''SKIP user_profiles.language_preference'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2) contents.data (tabela usada pelo backend atual)
SELECT COUNT(*) INTO @has_contents
FROM information_schema.tables
WHERE table_schema = @db AND table_name = 'contents';

SELECT COUNT(*) INTO @has_contents_data
FROM information_schema.columns
WHERE table_schema = @db
  AND table_name = 'contents'
  AND column_name = 'data';

SET @sql := IF(
  @has_contents = 1 AND @has_contents_data = 0,
  'ALTER TABLE contents ADD COLUMN data LONGTEXT NULL',
  'SELECT ''SKIP contents.data'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3) Compatibilidade extra: content.data (caso exista tabela singular)
SELECT COUNT(*) INTO @has_content
FROM information_schema.tables
WHERE table_schema = @db AND table_name = 'content';

SELECT COUNT(*) INTO @has_content_data
FROM information_schema.columns
WHERE table_schema = @db
  AND table_name = 'content'
  AND column_name = 'data';

SET @sql := IF(
  @has_content = 1 AND @has_content_data = 0,
  'ALTER TABLE content ADD COLUMN data LONGTEXT NULL',
  'SELECT ''SKIP content.data'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'Schema patch finalizado.' AS status;
