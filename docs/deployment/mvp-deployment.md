# MVP Deployment

## Local Compose

```powershell
docker compose up -d --build
```

Expected URLs:

```text
http://localhost
http://localhost/api/health
http://localhost/api/auth/login
http://localhost:9001
```

## Secrets

The Compose file uses demo-only values. Production must inject secrets through the deployment platform or an untracked `.env` file.

Do not commit:

- Production `JWT_SECRET`
- Production database passwords
- Server addresses
- TLS private keys
- Database backups

## Rollback

1. Keep the previous image tag.
2. Stop the new deployment.
3. Restart the previous image tag.
4. Verify `/api/health`.
5. Review audit logs and deployment logs.
