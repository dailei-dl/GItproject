# CRM Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the MVP flow from customer lead to opportunity, approved contract, and project draft creation.

**Architecture:** `apps/api/src/crm-contract` provides an in-memory service and controller for the first business workflow. Later database branches can replace storage while preserving tested state transitions and response shapes.

**Tech Stack:** NestJS, TypeScript, Vitest, Supertest.

---

## Tasks

1. Write failing tests for customer, lead, opportunity, contract approval, and contract-to-project draft.
2. Implement `CrmContractService` and `CrmContractController`.
3. Register the module in `AppModule`.
4. Add API docs.
5. Run full verification and push `feature/crm-contract`.

