# Value Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans.

**Goal:** Add MVP value rule versioning, value pool calculation, department/person allocation, adjustment approval state, and calculation trace.

**Architecture:** `apps/api/src/value-engine` wraps shared formula helpers with auditable rule metadata and deterministic demo flow.

**Tech Stack:** NestJS, TypeScript, Vitest, Supertest.

---

## Tasks

1. Write failing tests for value pool and personal allocation.
2. Implement service and controller.
3. Register in AppModule and document endpoint.
4. Run full verification and push branch.

