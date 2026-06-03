import { beforeEach, describe, expect, it } from "vitest";
import { BusinessRepository } from "./business.repository";
import { BusinessService } from "./business.service";

describe("BusinessService", () => {
  let service: BusinessService;

  beforeEach(() => {
    service = new BusinessService(new BusinessRepository());
  });

  it("runs the enterprise business flow from CRM to value snapshot", () => {
    const customer = service.createCustomer({ name: "DEMO 华东设计客户", source: "referral", ownerName: "市场一部" });
    const lead = service.createLead({ customerId: customer.id, title: "总部改造设计线索", expectedAmount: 8420000 });
    const opportunity = service.qualifyLead(lead.id, { expectedAmount: 8420000 });
    const contract = service.createContractFromOpportunity(opportunity.id, {
      contractName: "总部改造设计合同",
      contractAmount: 8420000,
    });
    const approvedContract = service.approveContract(contract.id);
    const project = service.createProjectFromContract(approvedContract.id, {
      projectName: "总部改造设计项目",
      completionRatio: 0.65,
    });

    service.createFinanceEntry(project.id, { type: "receipt", amount: 5180000, note: "一期回款" });
    service.createFinanceEntry(project.id, { type: "expense", amount: 800000, note: "设计成本" });
    service.createFinanceEntry(project.id, { type: "outsource", amount: 460000, note: "外协成本" });
    service.createFinanceEntry(project.id, { type: "tax", amount: 180000, note: "税费" });
    service.createFinanceEntry(project.id, { type: "management_fee", amount: 120000, note: "管理费" });

    const snapshot = service.calculateProjectValue(project.id, { distributableRatio: 0.8 });
    const summary = service.getSummary();
    const auditLogs = service.listAuditLogs();

    expect(opportunity.stage).toBe("won");
    expect(approvedContract.status).toBe("approved");
    expect(project.contractId).toBe(approvedContract.id);
    expect(snapshot.netCashflow).toBe(3620000);
    expect(snapshot.distributableValue).toBe(2896000);
    expect(snapshot.confirmedValue).toBe(1781624.7);
    expect(summary.contractAmount).toBe(8420000);
    expect(summary.receiptAmount).toBe(5180000);
    expect(summary.netCashflow).toBe(3620000);
    expect(summary.confirmedValue).toBe(1781624.7);
    expect(auditLogs.map((log) => log.action)).toContain("contract.approve");
    expect(auditLogs.map((log) => log.action)).toContain("value.calculate");
  });

  it("rejects converting a draft contract into a project", () => {
    const customer = service.createCustomer({ name: "DEMO 客户", source: "website", ownerName: "经营部" });
    const lead = service.createLead({ customerId: customer.id, title: "产业园规划线索", expectedAmount: 500000 });
    const opportunity = service.qualifyLead(lead.id, { expectedAmount: 500000 });
    const contract = service.createContractFromOpportunity(opportunity.id, {
      contractName: "产业园规划合同",
      contractAmount: 500000,
    });

    expect(() =>
      service.createProjectFromContract(contract.id, {
        projectName: "产业园规划项目",
        completionRatio: 0.4,
      })
    ).toThrow("Only approved contracts can be converted to projects");
  });
});
