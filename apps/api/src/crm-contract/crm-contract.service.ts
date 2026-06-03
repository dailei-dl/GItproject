import { Injectable } from "@nestjs/common";

type Customer = { id: string; name: string; source: string };
type Lead = { id: string; customerId: string; title: string; status: "new" | "qualified" };
type Opportunity = { id: string; leadId: string; customerId: string; expectedAmount: string; stage: "won" };
type Contract = {
  id: string;
  opportunityId: string;
  customerId: string;
  contractName: string;
  contractAmount: string;
  status: "draft" | "approved";
};
type ProjectDraft = { id: string; contractId: string; projectCode: string; status: "draft" };

@Injectable()
export class CrmContractService {
  private customers: Customer[] = [];
  private leads: Lead[] = [];
  private opportunities: Opportunity[] = [];
  private contracts: Contract[] = [];
  private projectDrafts: ProjectDraft[] = [];

  createCustomer(input: { name: string; source: string }): Customer {
    const customer = { id: `cust-${this.customers.length + 1}`, ...input };
    this.customers.push(customer);
    return customer;
  }

  createLead(input: { customerId: string; title: string }): Lead {
    this.requireCustomer(input.customerId);
    const lead: Lead = {
      id: `lead-${this.leads.length + 1}`,
      customerId: input.customerId,
      title: input.title,
      status: "new",
    };
    this.leads.push(lead);
    return lead;
  }

  qualifyLead(leadId: string, input: { expectedAmount: string }): Opportunity {
    const lead = this.requireLead(leadId);
    lead.status = "qualified";
    const opportunity: Opportunity = {
      id: `opp-${this.opportunities.length + 1}`,
      leadId,
      customerId: lead.customerId,
      expectedAmount: input.expectedAmount,
      stage: "won",
    };
    this.opportunities.push(opportunity);
    return opportunity;
  }

  createContractFromOpportunity(
    opportunityId: string,
    input: { contractName: string; contractAmount: string }
  ): Contract {
    const opportunity = this.requireOpportunity(opportunityId);
    const contract: Contract = {
      id: `contract-${this.contracts.length + 1}`,
      opportunityId,
      customerId: opportunity.customerId,
      contractName: input.contractName,
      contractAmount: input.contractAmount,
      status: "draft",
    };
    this.contracts.push(contract);
    return contract;
  }

  approveContract(contractId: string): Contract {
    const contract = this.requireContract(contractId);
    contract.status = "approved";
    return contract;
  }

  createProjectDraftFromContract(contractId: string): ProjectDraft {
    const contract = this.requireContract(contractId);
    if (contract.status !== "approved") {
      throw new Error("Only approved contracts can be converted to projects");
    }
    const projectDraft: ProjectDraft = {
      id: `project-draft-${this.projectDrafts.length + 1}`,
      contractId,
      projectCode: `DT-DEMO-${String(this.projectDrafts.length + 1).padStart(3, "0")}`,
      status: "draft",
    };
    this.projectDrafts.push(projectDraft);
    return projectDraft;
  }

  runDemoFlow() {
    const customer = this.createCustomer({ name: "DEMO 客户 A", source: "referral" });
    const lead = this.createLead({ customerId: customer.id, title: "总部改造线索" });
    const opportunity = this.qualifyLead(lead.id, { expectedAmount: "8420000.00" });
    const contract = this.createContractFromOpportunity(opportunity.id, {
      contractName: "总部改造设计合同",
      contractAmount: "8420000.00",
    });
    const approvedContract = this.approveContract(contract.id);
    const projectDraft = this.createProjectDraftFromContract(contract.id);
    return { customer, lead, opportunity, contract: approvedContract, projectDraft };
  }

  private requireCustomer(id: string): Customer {
    const customer = this.customers.find((item) => item.id === id);
    if (!customer) throw new Error("Customer not found");
    return customer;
  }

  private requireLead(id: string): Lead {
    const lead = this.leads.find((item) => item.id === id);
    if (!lead) throw new Error("Lead not found");
    return lead;
  }

  private requireOpportunity(id: string): Opportunity {
    const opportunity = this.opportunities.find((item) => item.id === id);
    if (!opportunity) throw new Error("Opportunity not found");
    return opportunity;
  }

  private requireContract(id: string): Contract {
    const contract = this.contracts.find((item) => item.id === id);
    if (!contract) throw new Error("Contract not found");
    return contract;
  }
}
