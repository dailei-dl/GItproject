import { Injectable } from "@nestjs/common";

type Project = { id: string; contractId: string; projectCode: string; name: string };
type Stage = { projectId: string; name: string; completionRatio: string };
type Member = { projectId: string; userId: string; roleWeight: string; contributionRatio: string };
type Risk = { projectId: string; title: string; level: "low" | "medium" | "high" };
type MoneyRecord = { projectId: string; amount: string };

function addMoney(records: MoneyRecord[]): string {
  const cents = records.reduce((sum, record) => {
    const [whole = "0", fraction = ""] = record.amount.split(".");
    return sum + BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0").slice(0, 2));
  }, 0n);
  return `${cents / 100n}.${(cents % 100n).toString().padStart(2, "0")}`;
}

@Injectable()
export class ProjectFinanceService {
  private projects: Project[] = [];
  private stages: Stage[] = [];
  private members: Member[] = [];
  private risks: Risk[] = [];
  private receipts: MoneyRecord[] = [];
  private invoices: MoneyRecord[] = [];
  private expenses: (MoneyRecord & { category: string })[] = [];
  private outsourcePayments: MoneyRecord[] = [];

  createProject(input: { contractId: string; projectCode: string; name: string }): Project {
    const project = { id: `project-${this.projects.length + 1}`, ...input };
    this.projects.push(project);
    return project;
  }

  addStage(projectId: string, input: { name: string; completionRatio: string }): Stage {
    this.requireProject(projectId);
    const stage = { projectId, ...input };
    this.stages.push(stage);
    return stage;
  }

  addMember(projectId: string, input: { userId: string; roleWeight: string; contributionRatio: string }): Member {
    this.requireProject(projectId);
    const member = { projectId, ...input };
    this.members.push(member);
    return member;
  }

  addRisk(projectId: string, input: { title: string; level: "low" | "medium" | "high" }): Risk {
    this.requireProject(projectId);
    const risk = { projectId, ...input };
    this.risks.push(risk);
    return risk;
  }

  addReceipt(projectId: string, input: { amount: string }) {
    this.requireProject(projectId);
    this.receipts.push({ projectId, amount: input.amount });
  }

  addInvoice(projectId: string, input: { amount: string }) {
    this.requireProject(projectId);
    this.invoices.push({ projectId, amount: input.amount });
  }

  addExpense(projectId: string, input: { amount: string; category: string }) {
    this.requireProject(projectId);
    this.expenses.push({ projectId, amount: input.amount, category: input.category });
  }

  addOutsourcePayment(projectId: string, input: { amount: string }) {
    this.requireProject(projectId);
    this.outsourcePayments.push({ projectId, amount: input.amount });
  }

  getFinanceSummary(projectId: string) {
    this.requireProject(projectId);
    const projectStages = this.stages.filter((stage) => stage.projectId === projectId);
    return {
      receivedAmount: addMoney(this.receipts.filter((item) => item.projectId === projectId)),
      invoiceAmount: addMoney(this.invoices.filter((item) => item.projectId === projectId)),
      paidCost: addMoney(this.expenses.filter((item) => item.projectId === projectId)),
      outsourceCost: addMoney(this.outsourcePayments.filter((item) => item.projectId === projectId)),
      stageCompletionRatio: projectStages.at(-1)?.completionRatio ?? "0.00",
      memberCount: this.members.filter((item) => item.projectId === projectId).length,
      riskCount: this.risks.filter((item) => item.projectId === projectId).length,
    };
  }

  runDemoFlow() {
    const project = this.createProject({
      contractId: "contract-1",
      projectCode: "DT-DEMO-001",
      name: "总部改造",
    });
    this.addStage(project.id, { name: "方案设计", completionRatio: "0.60" });
    this.addMember(project.id, { userId: "u-employee", roleWeight: "0.60", contributionRatio: "0.50" });
    this.addRisk(project.id, { title: "阶段完成低于回款比例", level: "medium" });
    this.addReceipt(project.id, { amount: "5180000.00" });
    this.addInvoice(project.id, { amount: "4200000.00" });
    this.addExpense(project.id, { amount: "980000.00", category: "paidCost" });
    this.addOutsourcePayment(project.id, { amount: "260000.00" });
    return { project, summary: this.getFinanceSummary(project.id) };
  }

  private requireProject(projectId: string): Project {
    const project = this.projects.find((item) => item.id === projectId);
    if (!project) throw new Error("Project not found");
    return project;
  }
}
