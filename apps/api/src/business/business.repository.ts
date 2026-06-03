import { Injectable } from "@nestjs/common";
import type {
  AuditLog,
  BusinessState,
  Contract,
  Customer,
  FinanceEntry,
  Lead,
  Opportunity,
  Project,
  ValueSnapshot,
} from "./business.types";

type BusinessCollection = keyof BusinessState;
type BusinessRecord = BusinessState[BusinessCollection][number];

@Injectable()
export class BusinessRepository {
  private state: BusinessState = {
    customers: [],
    leads: [],
    opportunities: [],
    contracts: [],
    projects: [],
    financeEntries: [],
    valueSnapshots: [],
    auditLogs: [],
  };

  listCustomers(): Customer[] {
    return [...this.state.customers];
  }

  listLeads(): Lead[] {
    return [...this.state.leads];
  }

  listOpportunities(): Opportunity[] {
    return [...this.state.opportunities];
  }

  listContracts(): Contract[] {
    return [...this.state.contracts];
  }

  listProjects(): Project[] {
    return [...this.state.projects];
  }

  listFinanceEntries(): FinanceEntry[] {
    return [...this.state.financeEntries];
  }

  listValueSnapshots(): ValueSnapshot[] {
    return [...this.state.valueSnapshots];
  }

  listAuditLogs(): AuditLog[] {
    return [...this.state.auditLogs].reverse();
  }

  getState(): BusinessState {
    return {
      customers: this.listCustomers(),
      leads: this.listLeads(),
      opportunities: this.listOpportunities(),
      contracts: this.listContracts(),
      projects: this.listProjects(),
      financeEntries: this.listFinanceEntries(),
      valueSnapshots: this.listValueSnapshots(),
      auditLogs: [...this.state.auditLogs],
    };
  }

  findCustomer(id: string): Customer | undefined {
    return this.state.customers.find((item) => item.id === id);
  }

  findLead(id: string): Lead | undefined {
    return this.state.leads.find((item) => item.id === id);
  }

  findOpportunity(id: string): Opportunity | undefined {
    return this.state.opportunities.find((item) => item.id === id);
  }

  findContract(id: string): Contract | undefined {
    return this.state.contracts.find((item) => item.id === id);
  }

  findProject(id: string): Project | undefined {
    return this.state.projects.find((item) => item.id === id);
  }

  findProjectByContract(contractId: string): Project | undefined {
    return this.state.projects.find((item) => item.contractId === contractId);
  }

  insertCustomer(record: Omit<Customer, "id" | "createdAt" | "updatedAt">): Customer {
    return this.insert("customers", record) as Customer;
  }

  insertLead(record: Omit<Lead, "id" | "createdAt" | "updatedAt">): Lead {
    return this.insert("leads", record) as Lead;
  }

  insertOpportunity(record: Omit<Opportunity, "id" | "createdAt" | "updatedAt">): Opportunity {
    return this.insert("opportunities", record) as Opportunity;
  }

  insertContract(record: Omit<Contract, "id" | "createdAt" | "updatedAt">): Contract {
    return this.insert("contracts", record) as Contract;
  }

  insertProject(record: Omit<Project, "id" | "createdAt" | "updatedAt">): Project {
    return this.insert("projects", record) as Project;
  }

  insertFinanceEntry(record: Omit<FinanceEntry, "id" | "createdAt">): FinanceEntry {
    const createdAt = now();
    const financeEntry = { id: this.nextId("finance"), createdAt, ...record };
    this.state.financeEntries.push(financeEntry);
    return financeEntry;
  }

  insertValueSnapshot(record: Omit<ValueSnapshot, "id" | "createdAt">): ValueSnapshot {
    const createdAt = now();
    const snapshot = { id: this.nextId("value"), createdAt, ...record };
    this.state.valueSnapshots.push(snapshot);
    return snapshot;
  }

  insertAuditLog(record: Omit<AuditLog, "id" | "createdAt">): AuditLog {
    const createdAt = now();
    const auditLog = { id: this.nextId("audit"), createdAt, ...record };
    this.state.auditLogs.push(auditLog);
    return auditLog;
  }

  updateCustomer(id: string, changes: Partial<Customer>): Customer | undefined {
    return this.update("customers", id, changes) as Customer | undefined;
  }

  updateLead(id: string, changes: Partial<Lead>): Lead | undefined {
    return this.update("leads", id, changes) as Lead | undefined;
  }

  updateContract(id: string, changes: Partial<Contract>): Contract | undefined {
    return this.update("contracts", id, changes) as Contract | undefined;
  }

  deleteCustomer(id: string): boolean {
    return this.delete("customers", id);
  }

  deleteLead(id: string): boolean {
    return this.delete("leads", id);
  }

  private insert(collection: BusinessCollection, record: Record<string, unknown>): BusinessRecord {
    const timestamp = now();
    const item = {
      id: this.nextId(collection),
      createdAt: timestamp,
      updatedAt: timestamp,
      ...record,
    } as BusinessRecord;
    this.state[collection].push(item as never);
    return item;
  }

  private update(collection: BusinessCollection, id: string, changes: Record<string, unknown>): BusinessRecord | undefined {
    const items = this.state[collection] as Array<BusinessRecord>;
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return undefined;
    const updated = { ...items[index], ...changes, updatedAt: now() } as BusinessRecord;
    items[index] = updated;
    return updated;
  }

  private delete(collection: BusinessCollection, id: string): boolean {
    const items = this.state[collection] as Array<BusinessRecord>;
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return false;
    items.splice(index, 1);
    return true;
  }

  private nextId(prefix: string): string {
    const key = prefixToCollection(prefix);
    const count = this.state[key].length + 1;
    return `${prefix}-${String(count).padStart(4, "0")}`;
  }
}

function prefixToCollection(prefix: string): BusinessCollection {
  const map: Record<string, BusinessCollection> = {
    customers: "customers",
    leads: "leads",
    opportunities: "opportunities",
    contracts: "contracts",
    projects: "projects",
    finance: "financeEntries",
    value: "valueSnapshots",
    audit: "auditLogs",
  };
  return map[prefix] ?? (prefix as BusinessCollection);
}

function now(): string {
  return new Date().toISOString();
}
