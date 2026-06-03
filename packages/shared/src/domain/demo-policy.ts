export const DEMO_DATA_POLICY = {
  organizationCount: 1,
  branchCount: 1,
  departmentCount: 3,
  employeeCount: 100,
  projectCount: 20,
  label: "demo",
} as const;

export const FORBIDDEN_REPOSITORY_ARTIFACTS = [
  ".env",
  ".pem",
  ".key",
  ".pfx",
  ".sql",
  ".dump",
  ".bak",
  ".sqlite",
] as const;
