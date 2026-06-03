# Project Finance API

## Demo Flow

```http
POST /project-finance/demo-flow
```

Creates a demo project with stage, member, risk, receipt, invoice, expense, and outsource payment records.

The summary returns:

```text
receivedAmount, invoiceAmount, paidCost, outsourceCost, stageCompletionRatio, memberCount, riskCount
```

