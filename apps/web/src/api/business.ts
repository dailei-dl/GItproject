export type BusinessSummary = {
  customerCount: number;
  leadCount: number;
  opportunityCount: number;
  contractCount: number;
  projectCount: number;
  contractAmount: number;
  receiptAmount: number;
  costAmount: number;
  netCashflow: number;
  distributableValue: number;
  confirmedValue: number;
};

export type Customer = {
  id: string;
  name: string;
  source: string;
  ownerName: string;
};

export type Lead = {
  id: string;
  customerId: string;
  title: string;
  expectedAmount: number;
  status: "new" | "qualified" | "closed";
};

export type Opportunity = {
  id: string;
  leadId: string;
  customerId: string;
  expectedAmount: number;
  stage: "open" | "won" | "lost";
};

export type Contract = {
  id: string;
  opportunityId: string;
  customerId: string;
  contractName: string;
  contractAmount: number;
  status: "draft" | "approved";
};

export type Project = {
  id: string;
  contractId: string;
  projectCode: string;
  projectName: string;
  contractAmount: number;
  completionRatio: number;
  status: "active" | "closed";
};

export type FinanceEntry = {
  id: string;
  projectId: string;
  type: "receipt" | "expense" | "outsource" | "tax" | "management_fee";
  amount: number;
  note: string;
};

export type ValueSnapshot = {
  id: string;
  projectId: string;
  netCashflow: number;
  distributableValue: number;
  confirmedValue: number;
  ruleVersion: string;
};

export type AuditLog = {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  createdAt: string;
};

export type BusinessData = {
  summary: BusinessSummary;
  auditLogs: AuditLog[];
  customers: Customer[];
  leads: Lead[];
  opportunities: Opportunity[];
  contracts: Contract[];
  projects: Project[];
  financeEntries: FinanceEntry[];
  valueSnapshots: ValueSnapshot[];
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function loadBusinessData(): Promise<BusinessData> {
  const [summary, auditLogs, customers, leads, opportunities, contracts, projects, financeEntries, valueSnapshots] =
    await Promise.all([
      get<BusinessSummary>("/business/summary"),
      get<AuditLog[]>("/business/audit-logs"),
      get<Customer[]>("/business/customers"),
      get<Lead[]>("/business/leads"),
      get<Opportunity[]>("/business/opportunities"),
      get<Contract[]>("/business/contracts"),
      get<Project[]>("/business/projects"),
      get<FinanceEntry[]>("/business/finance-entries"),
      get<ValueSnapshot[]>("/business/value-snapshots"),
    ]);

  return { summary, auditLogs, customers, leads, opportunities, contracts, projects, financeEntries, valueSnapshots };
}

export function createCustomer(input: { name: string; source: string; ownerName: string }) {
  return post<Customer>("/business/customers", input);
}

export function createLead(input: { customerId: string; title: string; expectedAmount: number }) {
  return post<Lead>("/business/leads", input);
}

export function qualifyLead(leadId: string, input: { expectedAmount: number }) {
  return post<Opportunity>(`/business/leads/${leadId}/qualify`, input);
}

export function createContract(opportunityId: string, input: { contractName: string; contractAmount: number }) {
  return post<Contract>(`/business/opportunities/${opportunityId}/contracts`, input);
}

export function approveContract(contractId: string) {
  return post<Contract>(`/business/contracts/${contractId}/approve`, {});
}

export function createProject(contractId: string, input: { projectName: string; completionRatio: number }) {
  return post<Project>(`/business/contracts/${contractId}/projects`, input);
}

export function createFinanceEntry(projectId: string, input: { type: FinanceEntry["type"]; amount: number; note: string }) {
  return post<FinanceEntry>(`/business/projects/${projectId}/finance-entries`, input);
}

export function calculateValue(projectId: string, input: { distributableRatio: number }) {
  return post<ValueSnapshot>(`/business/projects/${projectId}/value-snapshots`, input);
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  return readResponse<T>(response);
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return readResponse<T>(response);
}

async function readResponse<T>(response: Response): Promise<T> {
  if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
  return response.json() as Promise<T>;
}
