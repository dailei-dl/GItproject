import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AppModule } from "./app.module";

describe("DesignTwin API", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("responds to health checks", async () => {
    const response = await request(app.getHttpServer()).get("/health").expect(200);

    expect(response.body).toEqual({ status: "ok", service: "designtwin-api" });
  });

  it("logs in demo admin through the API", async () => {
    const response = await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "admin@demo.designtwin.local", password: "Demo@123456" })
      .expect(201);

    expect(response.body.user.role).toBe("admin");
    expect(response.body.accessToken).toContain(".");
  });
});
