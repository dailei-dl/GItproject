# CRM Contract API

## Demo Flow

```http
POST /crm-contract/demo-flow
```

This endpoint creates a deterministic demo flow:

```text
customer -> lead -> opportunity -> contract approval -> project draft
```

The project draft is blocked unless the contract status is `approved`.

