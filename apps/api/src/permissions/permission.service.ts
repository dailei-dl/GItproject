import { Injectable } from "@nestjs/common";
import { SENSITIVE_FIELDS, type DataScope, type DesignTwinRole } from "@designtwin/shared";

export type ActorContext = {
  role: DesignTwinRole;
  dataScope: DataScope;
  branchId: string;
  departmentId: string;
  userId: string;
};

export type RecordScope = {
  branchId: string;
  departmentId: string;
  projectMemberIds: string[];
};

const COMPANY_ROLES = new Set<DesignTwinRole>(["admin", "owner"]);
const BRANCH_ROLES = new Set<DesignTwinRole>(["branch_manager", "finance", "hr"]);
const DEPARTMENT_ROLES = new Set<DesignTwinRole>(["department_manager"]);

@Injectable()
export class PermissionService {
  canReadRecord(actor: ActorContext, record: RecordScope): boolean {
    if (COMPANY_ROLES.has(actor.role)) return true;
    if (BRANCH_ROLES.has(actor.role)) return record.branchId === actor.branchId;
    if (DEPARTMENT_ROLES.has(actor.role)) return record.departmentId === actor.departmentId;
    if (actor.role === "project_manager") return record.projectMemberIds.includes(actor.userId);
    return record.projectMemberIds.includes(actor.userId);
  }

  maskSensitiveFields<T extends Record<string, unknown>>(actor: ActorContext, record: T): T {
    if (COMPANY_ROLES.has(actor.role) || actor.role === "finance" || actor.role === "hr") {
      return { ...record };
    }

    const masked: Record<string, unknown> = { ...record };
    for (const field of SENSITIVE_FIELDS) {
      if (field === "personalValue" && actor.role === "employee") continue;
      if (field in masked) masked[field] = "***";
    }
    return masked as T;
  }
}
