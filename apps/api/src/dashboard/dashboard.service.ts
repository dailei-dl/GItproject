import { Injectable } from "@nestjs/common";

@Injectable()
export class DashboardService {
  getDemoSummary() {
    return {
      metrics: {
        contractAmount: "8420000.00",
        receivedAmount: "5180000.00",
        invoiceAmount: "4200000.00",
        paidCost: "1260000.00",
        netCashflow: "3920000.00",
        assignableValue: "3136000.00",
        confirmedValue: "2352000.00",
      },
      valueTrace: [
        { label: "项目净流水", formula: "回款 - 支出 - 外协 - 税费 - 管理费", result: "3920000.00" },
        { label: "可分配产值", formula: "净流水 x 0.80", result: "3136000.00" },
        { label: "确认产值", formula: "min(0.75, 0.60) x 可分配产值", result: "2352000.00" },
      ],
      risks: [
        { projectCode: "DT-DEMO-001", title: "阶段完成低于回款比例", status: "跟进中" },
        { projectCode: "DT-DEMO-009", title: "外协成本接近预算阈值", status: "待确认" },
        { projectCode: "DT-DEMO-014", title: "合同补充协议待审批", status: "已缓解" },
      ],
    };
  }
}
