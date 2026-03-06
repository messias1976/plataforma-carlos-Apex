# Study Zone Fix - Deploy Checklist

Date: 2026-03-06

## Scope
- Frontend now always shows modules 1..7 in Study Zone.
- Module viewer now handles text/video/audio/document types robustly.
- SQL audit/fix script prepared for mapping content rows to modules 1..7.

## 1) Deploy frontend build
1. Upload `dist-study-zone-fix-20260306.zip` to hosting.
2. Extract into the web root (same location currently serving `index.html`).
3. Ensure `.htaccess` rewrite rules remain present for SPA routes.
4. Clear CDN/cache (if any).

## 2) Apply DB mapping script
Run in MySQL (phpMyAdmin or CLI):

```sql
SOURCE backend-php/scripts/audit-fix-study-zone-modules.sql;
```

Notes:
- Script creates backup table: `contents_backup_study_zone_20260306`.
- Script applies heuristic mapping only when `topic_id/module_id` are missing.
- Fill `study_zone_manual_map` section to map remaining rows manually.

## 3) Validate in production
1. API health:

```bash
curl https://apexestudos.com/api
```

2. Login test (premium user):

```bash
curl -X POST https://apexestudos.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"premium@apexestudos.com","password":"NovaSenhaPremium!2026"}'
```

3. Open `https://apexestudos.com/study-zone` while logged in and confirm:
- Modules 1 to 7 are visible.
- Clicking each module opens `/topic/{id}`.
- Content types render correctly (text/video/audio/document).

## Current live diagnosis
- API is healthy.
- Premium login works.
- Current content rows are unmapped (`(sem_modulo)`), so DB mapping step is required for module pages to show content.
