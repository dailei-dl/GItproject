import { Inject, Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { BusinessRepository } from "./business.repository";
import type {
  AuditLog,
  BusinessSummary,
  CalculateValueInput,
  Contract,
  CreateContractInput,
  CreateCustomerInput,
  CreateFinanceEntryInput,
  CreateLeadInput,
  CreateProjectInput,
  Customer,
  FinanceEntry,
  Lead,
  Opportunity,
  Project,
  QualifyLeadInput,
  UpdateContractInput,
  UpdateCustomerInput,
  UpdateLeadInput,
  ValueSnapshot,
} from "./business.types";

@Injectable()
export class BusinessService {
  constructor(
    @Inject(BusinessRepository)
    private readonly repository: BusinessRepository
  ) {}

  listCustomers(): Customer[] {
    return this.repository.listCustomers();
  }

  createCustomer(input: CreateCustomerInput): Customer {
    requireText(input.name, "Customer name is required");
    const customer = this.repository.insertCustomer(input);
    this.audit("customer.create", "customer", customer.id, { name: customer.name });
    return customer;
  }

  updateCustomer(id: string, input: UpdateCustomerInput): Customer {
    const customer = this.repository.updateCustomer(id, clean(input));
    if (!customer) throw new NotFoundException("Customer not found");
    this.audit("customer.update", "customer", id, input);
    return customer;
  }

  deleteCustomer(id: string): { deleted: true } {
    if (this.repository.listLeads().some((lead) => lead.customerId === id)) {
      throw new UnprocessableEntityException("Customers with leads cannot be deleted");
    }
    if (!this.repository.deleteCustomer(id)) throw new NotFoundException("Customer not found");
    this.audit("customer.delete", "customer", id, {});
    return { deleted: true };
  }

  listLeads(): Lead[] {
    return this.repository.listLeads();
  }

  createLead(input: CreateLeadInput): Lead {
    this.requireCustomer(input.customerId);
    requirePositive(input.expectedAmount, "Lead expected amount must be greater than 0");
    const lead = this.repository.insertLead({ ...input, status: "new" });
    this.audit("lead.create", "lead", lead.id, { customerId: lead.customerId });
    return lead;
  }

  updateLead(id: string, input: UpdateLeadInput): Lead {
    if (input.expectedAmount !== undefined) requirePositive(input.expectedAmount, "Lead expected amount must be greater than 0");
    const lead = this.repository.updateLead(id, clean(input));
    if (!lead) throw new NotFoundException("Lead not found");
    this.audit("lead.update", "lead", id, input);
    return lead;
  }

  deleteLead(id: string): { deleted: true } {
    const lead = this.requireLead(id);
    if (lead.status === "qualified") {
      throw new UnprocessableEntityException("Qualified leads cannot be deleted");
    }
    if (!this.repository.deleteLead(id)) throw new NotFoundException("Lead not found");
    this.audit("lead.delete", "lead", id, {});
    return { deleted: true };
  }

  qualifyLead(leadId: string, input: QualifyLeadInput): Opportunity {
    requirePositive(input.expectedAmount, "Opportunity expected amount must be greater than 0");
    const lead = this.requireLead(leadId);
    if (lead.status === "closed") throw new UnprocessableEntityException("Closed leads cannot be qualified");
    if (lead.status === "qualified") throw new UnprocessableEntityException("Lead has already been qualified");
    const updatedLead = this.repository.updateLead(leadId, { status: "qualified" });
    if (!updatedLead) throw new NotFoundException("Lead not found");
    const opportunity = this.repository.insertOpportunity({
      leadId,
      customerId: lead.customerId,
      expectedAmount: input.expectedAmount,
      stage: "won",
    });
    this.audit("lead.qualify", "lead", leadId, { opportunityId: opportunity.id });
    return opportunity;
  }

  listOpportunities(): Opportunity[] {
    return this.repository.listOpportunities();
  }

  listContracts(): Contract[] {
    return this.repository.listContracts();
  }

  createContractFromOpportunity(opportunityId: string, input: CreateContractInput): Contract {
    const opportunity = this.requireOpportunity(opportunityId);
    requireText(input.contractName, "Contract name is required");
    requirePositive(input.contractAmount, "Contract amount must be greater than 0");
    const contract = this.repository.insertContract({
      opportunityId,
      customerId: opportunity.customerId,
      contractName: input.contractName,
      contractAmount: input.contractAmount,
      status: "draft",
    });
    this.audit("contract.create", "contract", contract.id, { opportunityId });
    return contract;
  }

  updateContract(id: string, input: UpdateContractInput): Contract {
    if (input.contractAmount !== undefined) requirePositive(input.contractAmount, "Contract amount must be greater than 0");
    const contract = this.requireContract(id);
    if (contract.status !== "draft") throw new UnprocessableEntityException("Only draft contracts can be edited");
    const updated = this.repository.updateContract(id, clean(input));
    if (!updated) throw new NotFoundException("Contract not found");
    this.audit("contract.update", "contract", id, input);
    return updated;
  }

  approveContract(id: string): Contract {
    const contract = this.requireContract(id);
    if (contract.status !== "draft") throw new UnprocessableEntityException("Only draft contracts can be approved");
    const approved = this.repository.updateContract(id, { status: "approved" });
    if (!approved) throw new NotFoundException("Contract not found");
    this.audit("contract.approve", "contract", id, {});
    return approved;
  }

  listProjects(): Project[] {
    return this.repository.listProjects();
  }

  createProjectFromContract(contractId: string, input: CreateProjectInput): Project {
    const contract = this.requireContract(contractId);
    if (contract.status !== "approved") {
      throw new UnprocessableEntityException("Only approved contracts can be converted to projects");
    }
    if (this.repository.findProjectByContract(contractId)) {
      throw new UnprocessableEntityException("Contract has already been converted to a project");
    }
    requireRatio(input.completionRatio, "Project completion ratio must be between 0 and 1");
    const project = this.repository.insertProject({
      contractId,
      projectCode: `DT-${String(this.repository.listProjects().length + 1).padStart(5, "0")}`,
      projectName: input.projectName,
      contractAmount: contract.contractAmount,
      completionRatio: input.completionRatio,
      status: "active",
    });
    this.audit("project.create_from_contract", "project", project.id, { contractId });
    return project;
  }

  listFinanceEntries(): FinanceEntry[] {
    return this.repository.listFinanceEntries();
  }

  createFinanceEntry(projectId: string, input: CreateFinanceEntryInput): FinanceEntry {
    this.requireProject(projectId);
    requirePositive(input.amount, "Finance amount must be greater than 0");
    const entry = this.repository.insertFinanceEntry({ projectId, ...input });
    this.audit("finance.create", "financeEntry", entry.id, { projectId, type: entry.type, amount: entry.amount });
    return entry;
  }

  calculateProjectValue(projectId: string, input: CalculateValueInput): ValueSnapshot {
    const project = this.requireProject(projectId);
    requireRatio(input.distributableRatio, "Distributable ratio must be between 0 and 1");
    const entries = this.repository.listFinanceEntries().filter((entry) => entry.projectId === projectId);
    const receiptAmount = sum(entries, "receipt");
    const costAmount =
      sum(entries, "expense") + sum(entries, "outsource") + sum(entries, "tax") + sum(entries, "management_fee");
    const netCashflow = round(receiptAmount - costAmount);
    const distributableValue = round(netCashflow * input.distributableRatio);
    const rawReceiptRatio = project.contractAmount === 0 ? 0 : receiptAmount / project.contractAmount;
    const receiptRatio = round(rawReceiptRatio, 4);
    const confirmationRatio = Math.min(rawReceiptRatio, project.completionRatio);
    const snapshot = this.repository.insertValueSnapshot({
      projectId,
      ruleVersion: "DEMO-ENTERPRISE-V1",
      receiptAmount,
      costAmount,
      netCashflow,
      distributableRatio: input.distributableRatio,
      distributableValue,
      receiptRatio,
      completionRatio: project.completionRatio,
      confirmedValue: round(distributableValue * confirmationRatio),
    });
    this.audit("value.calculate", "valueSnapshot", snapshot.id, { projectId, ruleVersion: snapshot.ruleVersion });
    return snapshot;
  }

  listValueSnapshots(): ValueSnapshot[] {
    return this.repository.listValueSnapshots();
  }

  getSummary(): BusinessSummary {
    const contracts = this.repository.listContracts();
    const financeEntries = this.repository.listFinanceEntries();
    const valueSnapshots = this.repository.listValueSnapshots();
    const latestValueByProject = new Map<string, ValueSnapshot>();
    for (const snapshot of valueSnapshots) latestValueByProject.set(snapshot.projectId, snapshot);
    const latestSnapshots = [...latestValueByProject.values()];
    const receiptAmount = sum(financeEntries, "receipt");
    const costAmount =
      sum(financeEntries, "expense") + sum(financeEntries, "outsource") + sum(financeEntries, "tax") + sum(financeEntries, "management_fee");

    return {
      customerCount: this.repository.listCustomers().length,
      leadCount: this.repository.listLeads().length,
      opportunityCount: this.repository.listOpportunities().length,
      contractCount: contracts.length,
      projectCount: this.repository.listProjects().length,
      contractAmount: round(contracts.reduce((total, contract) => total + contract.contractAmount, 0)),
      receiptAmount,
      costAmount,
      netCashflow: round(receiptAmount - costAmount),
      distributableValue: round(latestSnapshots.reduce((total, snapshot) => total + snapshot.distributableValue, 0)),
      confirmedValue: round(latestSnapshots.reduce((total, snapshot) => total + snapshot.confirmedValue, 0)),
    };
  }

  listAuditLogs(): AuditLog[] {
    return this.repository.listAuditLogs();
  }

  private requireCustomer(id: string): Customer {
    const customer = this.repository.findCustomer(id);
    if (!customer) throw new NotFoundException("Customer not found");
    return customer;
  }

  private requireLead(id: string): Lead {
    const lead = this.repository.findLead(id);
    if (!lead) throw new NotFoundException("Lead not found");
    return lead;
  }

  private requireOpportunity(id: string): Opportunity {
    const opportunity = this.repository.findOpportunity(id);
    if (!opportunity) throw new NotFoundException("Opportunity not found");
    return opportunity;
  }

  private requireContract(id: string): Contract {
    const contract = this.repository.findContract(id);
    if (!contract) throw new NotFoundException("Contract not found");
    return contract;
  }

  private requireProject(id: string): Project {
    const project = this.repository.findProject(id);
    if (!project) throw new NotFoundException("Project not found");
    return project;
  }

  private audit(action: string, targetType: string, targetId: string, metadata: Record<string, unknown>): void {
    this.repository.insertAuditLog({ action, targetType, targetId, metadata });
  }
}

function sum(entries: FinanceEntry[], type: FinanceEntry["type"]): number {
  return round(entries.filter((entry) => entry.type === type).reduce((total, entry) => total + entry.amount, 0));
}

function round(value: number, precision = 2): number {
  const factor = 10 ** precision;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function requireText(value: string, message: string): void {
  if (!value?.trim()) throw new UnprocessableEntityException(message);
}

function requirePositive(value: number, message: string): void {
  if (!Number.isFinite(value) || value <= 0) throw new UnprocessableEntityException(message);
}

function requireRatio(value: number, message: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new UnprocessableEntityException(message);
}

function clean<T extends Record<string, unknown>>(input: T): Partial<T> {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined)) as Partial<T>;
}
