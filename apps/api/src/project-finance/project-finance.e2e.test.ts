import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AppModule } from "../app.module";

describe("Project finance API", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("returns a demo project finance summary", async () => {
    const response = await request(app.getHttpServer()).post("/project-finance/demo-flow").expect(201);

    expect(response.body.project.projectCode).toBe("DT-DEMO-001");
    expect(response.body.summary.receivedAmount).toBe("5180000.00");
    expect(response.body.summary.riskCount).toBe(1);
  });
});
