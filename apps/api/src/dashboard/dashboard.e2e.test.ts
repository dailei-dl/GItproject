import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AppModule } from "../app.module";

describe("Dashboard API", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("returns demo dashboard summary", async () => {
    const response = await request(app.getHttpServer()).get("/dashboard/demo-summary").expect(200);

    expect(response.body.metrics.contractAmount).toBe("8420000.00");
    expect(response.body.risks).toHaveLength(3);
  });
});
