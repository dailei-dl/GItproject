import { describe, expect, it } from "vitest";
import { ProjectFinanceService } from "./project-finance.service";

describe("ProjectFinanceService", () => {
  it("sets up a project and calculates finance totals", () => {
    const service = new ProjectFinanceService();

    const project = service.createProject({
      contractId: "contract-1",
      projectCode: "DT-DEMO-001",
      name: "总部改造",
    });
    service.addStage(project.id, { name: "方案设计", completionRatio: "0.60" });
    service.addMember(project.id, { userId: "u-employee", roleWeight: "0.60", contributionRatio: "0.50" });
    service.addRisk(project.id, { title: "阶段完成低于回款比例", level: "medium" });
    service.addReceipt(project.id, { amount: "5180000.00" });
    service.addInvoice(project.id, { amount: "4200000.00" });
    service.addExpense(project.id, { amount: "980000.00", category: "paidCost" });
    service.addOutsourcePayment(project.id, { amount: "260000.00" });

    const summary = service.getFinanceSummary(project.id);

    expect(summary.receivedAmount).toBe("5180000.00");
    expect(summary.invoiceAmount).toBe("4200000.00");
    expect(summary.paidCost).toBe("980000.00");
    expect(summary.outsourceCost).toBe("260000.00");
    expect(summary.stageCompletionRatio).toBe("0.60");
    expect(summary.riskCount).toBe(1);
  });
});
