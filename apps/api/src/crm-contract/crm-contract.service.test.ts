import { describe, expect, it } from "vitest";
import { CrmContractService } from "./crm-contract.service";

describe("CrmContractService", () => {
  it("runs customer lead opportunity contract and project draft flow", () => {
    const service = new CrmContractService();

    const customer = service.createCustomer({ name: "DEMO 客户 A", source: "referral" });
    const lead = service.createLead({ customerId: customer.id, title: "总部改造线索" });
    const opportunity = service.qualifyLead(lead.id, { expectedAmount: "8420000.00" });
    const contract = service.createContractFromOpportunity(opportunity.id, {
      contractName: "总部改造设计合同",
      contractAmount: "8420000.00",
    });
    const approved = service.approveContract(contract.id);
    const projectDraft = service.createProjectDraftFromContract(contract.id);

    expect(customer.name).toBe("DEMO 客户 A");
    expect(lead.status).toBe("qualified");
    expect(opportunity.stage).toBe("won");
    expect(approved.status).toBe("approved");
    expect(projectDraft.contractId).toBe(contract.id);
    expect(projectDraft.projectCode).toMatch(/^DT-DEMO-/);
  });

  it("blocks project draft creation before contract approval", () => {
    const service = new CrmContractService();

    const customer = service.createCustomer({ name: "DEMO 客户 B", source: "website" });
    const lead = service.createLead({ customerId: customer.id, title: "园区设计线索" });
    const opportunity = service.qualifyLead(lead.id, { expectedAmount: "1200000.00" });
    const contract = service.createContractFromOpportunity(opportunity.id, {
      contractName: "园区设计合同",
      contractAmount: "1200000.00",
    });

    expect(() => service.createProjectDraftFromContract(contract.id)).toThrow(
      "Only approved contracts can be converted to projects"
    );
  });
});
