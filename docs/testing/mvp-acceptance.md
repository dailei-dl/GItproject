# MVP Acceptance Checklist

## Verified In This Repository

- `npm run security:files`
- `npm run check`
- `npm test`
- `npm run build --workspace @designtwin/api`
- `npm run build --workspace @designtwin/web`
- Prisma schema validation with demo `DATABASE_URL`

## Manual Runtime Checks

- Open web dashboard.
- Call `GET /api/health`.
- Call `POST /api/auth/login` with demo admin.
- Call demo flow endpoints:
  - `/api/crm-contract/demo-flow`
  - `/api/project-finance/demo-flow`
  - `/api/value-engine/demo-flow`
  - `/api/dashboard/demo-summary`

## Docker Check

Docker is required for final container verification:

```powershell
docker compose up -d --build
docker compose ps
```

This machine did not have Docker CLI available during this pass.
