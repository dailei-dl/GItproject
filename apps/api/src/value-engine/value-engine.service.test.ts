import { describe, expect, it } from "vitest";
import { ValueEngineService } from "./value-engine.service";

describe("ValueEngineService", () => {
  it("calculates a traceable value allocation from finance inputs", () => {
    const service = new ValueEngineService();

    const result = service.calculateProjectValue({
      projectId: "project-1",
      receivedAmount: "100000.00",
      paidCost: "18000.00",
      outsourceCost: "12000.00",
      taxFee: "6000.00",
      managementFee: "4000.00",
      otherApprovedCost: "1000.00",
      allocationCoefficient: "0.80",
      paymentRatio: "0.70",
      stageCompletionRatio: "0.50",
      departmentRatio: "1.00",
      roleWeight: "0.60",
      contributionRatio: "0.50",
      performanceCoefficient: "1.10",
    });

    expect(result.ruleVersion).toBe("VALUE-RULE-MVP-1");
    expect(result.projectValuePool.netCashflow).toBe("59000.00");
    expect(result.projectValuePool.assignableValue).toBe("47200.00");
    expect(result.projectValuePool.confirmedValue).toBe("23600.00");
    expect(result.personalAllocation.personalValue).toBe("7788.00");
    expect(result.trace.map((step) => step.label)).toEqual([
      "项目净流水",
      "可分配产值",
      "确认产值",
      "部门产值",
      "个人产值",
    ]);
  });
});
