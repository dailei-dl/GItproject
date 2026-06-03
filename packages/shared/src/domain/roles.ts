export const DESIGNTWIN_ROLES = [
  "admin",
  "owner",
  "branch_manager",
  "department_manager",
  "project_manager",
  "finance",
  "hr",
  "employee",
] as const;

export type DesignTwinRole = (typeof DESIGNTWIN_ROLES)[number];

export const DATA_SCOPES = ["company", "branch", "department", "project", "self"] as const;

export type DataScope = (typeof DATA_SCOPES)[number];

export const SENSITIVE_FIELDS = [
  "contractAmount",
  "costAmount",
  "netCashflow",
  "personalValue",
  "performanceScore",
] as const;
