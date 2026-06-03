# Enterprise Business CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a real, test-covered DesignTwin business flow from customer creation through value calculation and dashboard aggregation.

**Architecture:** Add enterprise domain models to Prisma, introduce a focused `business` API module with a repository-backed service, and connect the React shell to the API with forms and business actions. The first implementation uses an in-process repository for deterministic tests and local development, while the schema and API contract are persistent-database ready.

**Tech Stack:** NestJS, TypeScript, Prisma schema, React, Ant Design, Vitest, Testing Library, Supertest.

---

## File Structure

- Modify `prisma/schema.prisma`: add CRM, contract, project, finance, value snapshot enums and models.
- Create `apps/api/src/business/business.types.ts`: shared backend DTO/domain types for the business flow.
- Create `apps/api/src/business/business.repository.ts`: in-process repository with clear persistence boundary.
- Create `apps/api/src/business/business.service.ts`: validation, state transitions, calculations, audit writes.
- Create `apps/api/src/business/business.controller.ts`: REST endpoints under `/business`.
- Create `apps/api/src/business/business.service.test.ts`: service-level business flow tests.
- Create `apps/api/src/business/business.e2e.test.ts`: API-level business flow tests.
- Modify `apps/api/src/app.module.ts`: register business controller/service/repository.
- Create `apps/web/src/api/business.ts`: typed frontend API client with local fallback base URL.
- Refactor `apps/web/src/App.tsx`: load real data, show forms/actions, bind module pages to API.
- Modify `apps/web/src/App.test.tsx`: verify create/transition flow from the UI.
- Modify `apps/web/src/styles.css`: layout for action bars, forms, and business summaries.

## Task 1: Backend Business Domain

- [ ] Step 1: Write `business.service.test.ts` for the full flow.
- [ ] Step 2: Run `npm test --workspace @designtwin/api -- business.service.test.ts` and verify RED because the module does not exist.
- [ ] Step 3: Implement `business.types.ts`, `business.repository.ts`, and `business.service.ts`.
- [ ] Step 4: Run the service test and verify GREEN.
- [ ] Step 5: Commit `feat: add enterprise business service flow`.

## Task 2: Backend REST API

- [ ] Step 1: Write `business.e2e.test.ts` that calls create customer, create lead, qualify lead, create contract, approve contract, convert project, add finance entries, calculate value, and fetch summary/audit logs.
- [ ] Step 2: Run `npm test --workspace @designtwin/api -- business.e2e.test.ts` and verify RED because controller routes do not exist.
- [ ] Step 3: Implement `business.controller.ts` and register it in `app.module.ts`.
- [ ] Step 4: Run API e2e tests and verify GREEN.
- [ ] Step 5: Commit `feat: expose enterprise business api`.

## Task 3: Prisma Enterprise Models

- [ ] Step 1: Extend `prisma/schema.prisma` with business enums and models that match the API contract.
- [ ] Step 2: Run `npx prisma validate --schema prisma/schema.prisma` and verify schema validity.
- [ ] Step 3: Commit `feat: add enterprise business prisma models`.

## Task 4: Frontend API And Operations

- [ ] Step 1: Write React tests that mock `fetch`, create a customer and lead, qualify the lead, approve a contract, convert a project, and verify dashboard/audit refresh.
- [ ] Step 2: Run `npm test --workspace @designtwin/web` and verify RED because UI actions are not wired.
- [ ] Step 3: Implement `apps/web/src/api/business.ts`.
- [ ] Step 4: Refactor `App.tsx` to call the API, show forms, and trigger real business actions.
- [ ] Step 5: Run web tests and verify GREEN.
- [ ] Step 6: Commit `feat: connect web modules to business api`.

## Task 5: Verification And Publish

- [ ] Step 1: Run `npm run test`.
- [ ] Step 2: Run `npm run check`.
- [ ] Step 3: Run `npm run build --workspace @designtwin/api`.
- [ ] Step 4: Run `npm run build --workspace @designtwin/web`.
- [ ] Step 5: Run `npm run security:files`.
- [ ] Step 6: Browser-test `http://localhost:5173` against the local API.
- [ ] Step 7: Push `feature/business-crud-flow`, fast-forward merge to `main`, and push `main`.

## Self Review

- Spec coverage: the plan covers data model, API, frontend operations, business logic, audit, tests, and verification.
- Placeholder scan: no placeholder task remains; each task has concrete files and commands.
- Type consistency: the business module owns shared backend types and the frontend API client mirrors the REST contract.
