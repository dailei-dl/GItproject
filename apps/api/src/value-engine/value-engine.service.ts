import { Injectable } from "@nestjs/common";
import {
  calculateAssignableValue,
  calculateConfirmedValue,
  calculateNetCashflow,
  calculatePersonalValue,
} from "@designtwin/shared";

type ValueInput = {
  projectId: string;
  receivedAmount: string;
  paidCost: string;
  outsourceCost: string;
  taxFee: string;
  managementFee: string;
  otherApprovedCost: string;
  allocationCoefficient: string;
  paymentRatio: string;
  stageCompletionRatio: string;
  departmentRatio: string;
  roleWeight: string;
  contributionRatio: string;
  performanceCoefficient: string;
};

function multiplyMoney(amount: string, ratio: string): string {
  const [whole = "0", fraction = ""] = amount.split(".");
  const cents = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0").slice(0, 2));
  const [ratioWhole = "0", ratioFraction = ""] = ratio.split(".");
  const scaledRatio = BigInt(ratioWhole) * 10000n + BigInt(ratioFraction.padEnd(4, "0").slice(0, 4));
  const result = (cents * scaledRatio) / 10000n;
  return `${result / 100n}.${(result % 100n).toString().padStart(2, "0")}`;
}

@Injectable()
export class ValueEngineService {
  calculateProjectValue(input: ValueInput) {
    const netCashflow = calculateNetCashflow(input);
    const assignableValue = calculateAssignableValue(netCashflow, input.allocationCoefficient);
    const confirmedValue = calculateConfirmedValue({
      assignableValue,
      paymentRatio: input.paymentRatio,
      stageCompletionRatio: input.stageCompletionRatio,
    });
    const departmentValue = multiplyMoney(confirmedValue, input.departmentRatio);
    const personalValue = calculatePersonalValue({
      departmentValue,
      roleWeight: input.roleWeight,
      contributionRatio: input.contributionRatio,
      performanceCoefficient: input.performanceCoefficient,
    });

    return {
      ruleVersion: "VALUE-RULE-MVP-1",
      projectId: input.projectId,
      projectValuePool: { netCashflow, assignableValue, confirmedValue },
      departmentAllocation: { departmentValue, departmentRatio: input.departmentRatio },
      personalAllocation: { personalValue },
      adjustment: { status: "none" },
      trace: [
        { label: "项目净流水", result: netCashflow },
        { label: "可分配产值", result: assignableValue },
        { label: "确认产值", result: confirmedValue },
        { label: "部门产值", result: departmentValue },
        { label: "个人产值", result: personalValue },
      ],
    };
  }

  runDemoFlow() {
    return this.calculateProjectValue({
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
  }
}
