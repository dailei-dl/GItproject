import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AppModule } from "../app.module";

describe("CRM contract API", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("creates a demo customer-to-project flow through HTTP", async () => {
    const response = await request(app.getHttpServer()).post("/crm-contract/demo-flow").expect(201);

    expect(response.body.customer.name).toBe("DEMO 客户 A");
    expect(response.body.contract.status).toBe("approved");
    expect(response.body.projectDraft.projectCode).toMatch(/^DT-DEMO-/);
  });
});
