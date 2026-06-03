export type LeadStatus = "new" | "qualified" | "closed";
export type OpportunityStage = "open" | "won" | "lost";
export type ContractStatus = "draft" | "approved";
export type ProjectStatus = "active" | "closed";
export type FinanceEntryType = "receipt" | "expense" | "outsource" | "tax" | "management_fee";

export type Customer = {
  id: string;
  name: string;
  source: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
};

export type Lead = {
  id: string;
  customerId: string;
  title: string;
  expectedAmount: number;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
};

export type Opportunity = {
  id: string;
  leadId: string;
  customerId: string;
  expectedAmount: number;
  stage: OpportunityStage;
  createdAt: string;
  updatedAt: string;
};

export type Contract = {
  id: string;
  opportunityId: string;
  customerId: string;
  contractName: string;
  contractAmount: number;
  status: ContractStatus;
  createdAt: string;
  updatedAt: string;
};

export type Project = {
  id: string;
  contractId: string;
  projectCode: string;
  projectName: string;
  contractAmount: number;
  completionRatio: number;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
};

export type FinanceEntry = {
  id: string;
  projectId: string;
  type: FinanceEntryType;
  amount: number;
  note: string;
  createdAt: string;
};

export type ValueSnapshot = {
  id: string;
  projectId: string;
  ruleVersion: string;
  receiptAmount: number;
  costAmount: number;
  netCashflow: number;
  distributableRatio: number;
  distributableValue: number;
  receiptRatio: number;
  completionRatio: number;
  confirmedValue: number;
  createdAt: string;
};

export type AuditLog = {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

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

export type BusinessState = {
  customers: Customer[];
  leads: Lead[];
  opportunities: Opportunity[];
  contracts: Contract[];
  projects: Project[];
  financeEntries: FinanceEntry[];
  valueSnapshots: ValueSnapshot[];
  auditLogs: AuditLog[];
};

export type CreateCustomerInput = Pick<Customer, "name" | "source" | "ownerName">;
export type UpdateCustomerInput = Partial<CreateCustomerInput>;
export type CreateLeadInput = Pick<Lead, "customerId" | "title" | "expectedAmount">;
export type UpdateLeadInput = Partial<Pick<Lead, "title" | "expectedAmount" | "status">>;
export type QualifyLeadInput = Pick<Opportunity, "expectedAmount">;
export type CreateContractInput = Pick<Contract, "contractName" | "contractAmount">;
export type UpdateContractInput = Partial<Pick<Contract, "contractName" | "contractAmount">>;
export type CreateProjectInput = Pick<Project, "projectName" | "completionRatio">;
export type CreateFinanceEntryInput = Pick<FinanceEntry, "type" | "amount" | "note">;
export type CalculateValueInput = Pick<ValueSnapshot, "distributableRatio">;
