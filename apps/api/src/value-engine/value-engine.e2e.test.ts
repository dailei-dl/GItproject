import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AppModule } from "../app.module";

describe("Value engine API", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("returns demo value calculation trace", async () => {
    const response = await request(app.getHttpServer()).post("/value-engine/demo-flow").expect(201);

    expect(response.body.projectValuePool.confirmedValue).toBe("23600.00");
    expect(response.body.personalAllocation.personalValue).toBe("7788.00");
    expect(response.body.trace).toHaveLength(5);
  });
});
