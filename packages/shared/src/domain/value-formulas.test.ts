import { describe, expect, it } from "vitest";
import {
  calculateAssignableValue,
  calculateConfirmedValue,
  calculateNetCashflow,
  calculatePersonalValue,
} from "./value-formulas";

describe("value formulas", () => {
  it("calculates project net cashflow after approved cost deductions", () => {
    const result = calculateNetCashflow({
      receivedAmount: "100000.00",
      paidCost: "18000.00",
      outsourceCost: "12000.00",
      taxFee: "6000.00",
      managementFee: "4000.00",
      otherApprovedCost: "1000.00",
    });

    expect(result).toBe("59000.00");
  });

  it("calculates assignable value from net cashflow and allocation coefficient", () => {
    expect(calculateAssignableValue("59000.00", "0.80")).toBe("47200.00");
  });

  it("confirms value by the lower of payment ratio and stage completion ratio", () => {
    expect(
      calculateConfirmedValue({
        assignableValue: "47200.00",
        paymentRatio: "0.70",
        stageCompletionRatio: "0.50",
      })
    ).toBe("23600.00");
  });

  it("calculates personal value from department value, role weight, contribution, and performance coefficient", () => {
    expect(
      calculatePersonalValue({
        departmentValue: "23600.00",
        roleWeight: "0.60",
        contributionRatio: "0.50",
        performanceCoefficient: "1.10",
      })
    ).toBe("7788.00");
  });

  it("rejects negative money values", () => {
    expect(() =>
      calculateNetCashflow({
        receivedAmount: "-1.00",
        paidCost: "0.00",
        outsourceCost: "0.00",
        taxFee: "0.00",
        managementFee: "0.00",
        otherApprovedCost: "0.00",
      })
    ).toThrow("Money value cannot be negative");
  });
});
