# Project Finance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add MVP project setup and finance recording for stages, members, risks, receipts, invoices, expenses, and outsource payments.

**Architecture:** `apps/api/src/project-finance` provides tested in-memory workflow behavior and a demo endpoint. Later persistence can replace storage without changing the business contract.

**Tech Stack:** NestJS, TypeScript, Vitest, Supertest.

---

## Tasks

1. Write failing tests for project setup and finance totals.
2. Implement service and controller.
3. Register service/controller in `AppModule`.
4. Add docs and run full verification.

