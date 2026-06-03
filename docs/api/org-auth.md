# Org Auth API

## Health

```http
GET /health
```

Response:

```json
{
  "status": "ok",
  "service": "designtwin-api"
}
```

## Login

```http
POST /auth/login
```

Demo request:

```json
{
  "email": "admin@demo.designtwin.local",
  "password": "Demo@123456"
}
```

Response:

```json
{
  "accessToken": "<jwt>",
  "user": {
    "id": "u-admin",
    "email": "admin@demo.designtwin.local",
    "name": "演示管理员",
    "role": "admin",
    "dataScope": "company",
    "branchId": "branch-demo-1",
    "departmentId": "dept-admin"
  }
}
```

## Permission Rules

- `admin` and `owner` can read company-scoped demo records.
- `branch_manager`, `finance`, and `hr` are limited to their branch by default.
- `department_manager` is limited to their department.
- `project_manager` and `employee` are limited to projects where their user id is a member.
- Sensitive fields are masked by the API layer unless the actor role is authorized.

## Audit Events

The API records security-relevant events with:

```text
actorId, action, targetType, targetId, metadata, createdAt
```

The current branch stores audit records in memory for tested behavior. Later database integration will persist them through the Prisma `AuditLog` model.
