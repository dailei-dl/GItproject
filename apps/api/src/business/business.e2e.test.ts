import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AppModule } from "../app.module";

describe("Business API", () => {
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

  it("runs the business flow through REST endpoints", async () => {
    const customer = await request(app.getHttpServer())
      .post("/business/customers")
      .send({ name: "DEMO 华东设计客户", source: "referral", ownerName: "市场一部" })
      .expect(201)
      .then((response) => response.body);

    const lead = await request(app.getHttpServer())
      .post("/business/leads")
      .send({ customerId: customer.id, title: "总部改造设计线索", expectedAmount: 8420000 })
      .expect(201)
      .then((response) => response.body);

    const opportunity = await request(app.getHttpServer())
      .post(`/business/leads/${lead.id}/qualify`)
      .send({ expectedAmount: 8420000 })
      .expect(201)
      .then((response) => response.body);

    const contract = await request(app.getHttpServer())
      .post(`/business/opportunities/${opportunity.id}/contracts`)
      .send({ contractName: "总部改造设计合同", contractAmount: 8420000 })
      .expect(201)
      .then((response) => response.body);

    const approvedContract = await request(app.getHttpServer())
      .post(`/business/contracts/${contract.id}/approve`)
      .expect(201)
      .then((response) => response.body);

    const project = await request(app.getHttpServer())
      .post(`/business/contracts/${approvedContract.id}/projects`)
      .send({ projectName: "总部改造设计项目", completionRatio: 0.65 })
      .expect(201)
      .then((response) => response.body);

    await request(app.getHttpServer())
      .post(`/business/projects/${project.id}/finance-entries`)
      .send({ type: "receipt", amount: 5180000, note: "一期回款" })
      .expect(201);
    await request(app.getHttpServer())
      .post(`/business/projects/${project.id}/finance-entries`)
      .send({ type: "expense", amount: 800000, note: "设计成本" })
      .expect(201);
    await request(app.getHttpServer())
      .post(`/business/projects/${project.id}/finance-entries`)
      .send({ type: "outsource", amount: 460000, note: "外协成本" })
      .expect(201);
    await request(app.getHttpServer())
      .post(`/business/projects/${project.id}/finance-entries`)
      .send({ type: "tax", amount: 180000, note: "税费" })
      .expect(201);
    await request(app.getHttpServer())
      .post(`/business/projects/${project.id}/finance-entries`)
      .send({ type: "management_fee", amount: 120000, note: "管理费" })
      .expect(201);

    const snapshot = await request(app.getHttpServer())
      .post(`/business/projects/${project.id}/value-snapshots`)
      .send({ distributableRatio: 0.8 })
      .expect(201)
      .then((response) => response.body);

    const summary = await request(app.getHttpServer()).get("/business/summary").expect(200).then((response) => response.body);
    const auditLogs = await request(app.getHttpServer())
      .get("/business/audit-logs")
      .expect(200)
      .then((response) => response.body);

    expect(snapshot.confirmedValue).toBe(1781624.7);
    expect(summary.projectCount).toBe(1);
    expect(summary.contractAmount).toBe(8420000);
    expect(summary.receiptAmount).toBe(5180000);
    expect(summary.confirmedValue).toBe(1781624.7);
    expect(auditLogs.some((log: { action: string }) => log.action === "contract.approve")).toBe(true);
    expect(auditLogs.some((log: { action: string }) => log.action === "value.calculate")).toBe(true);
  });
});
