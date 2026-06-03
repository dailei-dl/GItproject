import { describe, expect, it } from "vitest";
import { PermissionService } from "./permission.service";

describe("PermissionService", () => {
  const service = new PermissionService();

  it("allows owner role to read company-scoped records", () => {
    expect(
      service.canReadRecord(
        { role: "owner", dataScope: "company", branchId: "branch-1", departmentId: "dept-1", userId: "u-owner" },
        { branchId: "branch-2", departmentId: "dept-2", projectMemberIds: [] }
      )
    ).toBe(true);
  });

  it("limits department manager to their department records", () => {
    expect(
      service.canReadRecord(
        { role: "department_manager", dataScope: "department", branchId: "branch-1", departmentId: "dept-1", userId: "u-manager" },
        { branchId: "branch-1", departmentId: "dept-1", projectMemberIds: [] }
      )
    ).toBe(true);

    expect(
      service.canReadRecord(
        { role: "department_manager", dataScope: "department", branchId: "branch-1", departmentId: "dept-1", userId: "u-manager" },
        { branchId: "branch-1", departmentId: "dept-2", projectMemberIds: [] }
      )
    ).toBe(false);
  });

  it("masks sensitive fields for employees", () => {
    const masked = service.maskSensitiveFields(
      { role: "employee", dataScope: "self", branchId: "branch-1", departmentId: "dept-1", userId: "u-employee" },
      {
        projectName: "DT-DEMO-001 总部改造",
        contractAmount: "8420000.00",
        netCashflow: "3920000.00",
        personalValue: "2352000.00",
      }
    );

    expect(masked).toEqual({
      projectName: "DT-DEMO-001 总部改造",
      contractAmount: "***",
      netCashflow: "***",
      personalValue: "2352000.00",
    });
  });
});
