import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

vi.mock("echarts-for-react", () => ({
  default: () => React.createElement("div", { "data-testid": "trend-chart" }),
}));

const emptySummary = {
  customerCount: 0,
  leadCount: 0,
  opportunityCount: 0,
  contractCount: 0,
  projectCount: 0,
  contractAmount: 0,
  receiptAmount: 0,
  costAmount: 0,
  netCashflow: 0,
  distributableValue: 0,
  confirmedValue: 0,
};

function mockBusinessApi() {
  const state = {
    customers: [] as Array<Record<string, unknown>>,
    leads: [] as Array<Record<string, unknown>>,
    opportunities: [] as Array<Record<string, unknown>>,
    contracts: [] as Array<Record<string, unknown>>,
    projects: [] as Array<Record<string, unknown>>,
    financeEntries: [] as Array<Record<string, unknown>>,
    valueSnapshots: [] as Array<Record<string, unknown>>,
    auditLogs: [] as Array<Record<string, unknown>>,
    summary: { ...emptySummary },
  };

  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? "GET";
    const body = init?.body ? JSON.parse(String(init.body)) : {};
    const path = url.replace("http://localhost:3000", "");

    if (method === "POST" && path === "/business/customers") {
      const customer = { id: "customers-0001", ...body };
      state.customers.push(customer);
      state.summary.customerCount = state.customers.length;
      return json(customer);
    }
    if (method === "POST" && path === "/business/leads") {
      const lead = { id: "leads-0001", status: "new", ...body };
      state.leads.push(lead);
      state.summary.leadCount = state.leads.length;
      return json(lead);
    }
    if (method === "POST" && path === "/business/leads/leads-0001/qualify") {
      const lead = state.leads[0];
      if (lead) lead.status = "qualified";
      const opportunity = { id: "opportunities-0001", leadId: "leads-0001", customerId: "customers-0001", stage: "won", ...body };
      state.opportunities.push(opportunity);
      state.summary.opportunityCount = 1;
      return json(opportunity);
    }

    const collectionMap: Record<string, unknown> = {
      "/business/summary": state.summary,
      "/business/audit-logs": state.auditLogs,
      "/business/customers": state.customers,
      "/business/leads": state.leads,
      "/business/opportunities": state.opportunities,
      "/business/contracts": state.contracts,
      "/business/projects": state.projects,
      "/business/finance-entries": state.financeEntries,
      "/business/value-snapshots": state.valueSnapshots,
    };
    return json(collectionMap[path] ?? {});
  });

  vi.stubGlobal("fetch", fetchMock);
  return { fetchMock, state };
}

function json(body: unknown) {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body),
  } as Response);
}

describe("DesignTwin web shell", () => {
  beforeEach(() => {
    mockBusinessApi();
  });

  it("renders the enterprise dashboard shell", () => {
    render(<App />);

    expect(screen.getByText("DesignTwin")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "经营驾驶舱" })).toBeInTheDocument();
    expect(screen.getByText("CRM")).toBeInTheDocument();
    expect(screen.getByText("合同管理")).toBeInTheDocument();
    expect(screen.getByText("产值管理")).toBeInTheDocument();
    expect(screen.getAllByText("可分配产值").length).toBeGreaterThan(0);
    expect(screen.getAllByText("确认产值").length).toBeGreaterThan(0);
    expect(screen.getByText("计算链路")).toBeInTheDocument();
    expect(screen.getByTestId("trend-chart")).toBeInTheDocument();
  });

  it("shows the MVP value formula used by the dashboard", () => {
    render(<App />);

    expect(
      screen.getByText("确认产值 = min(回款比例, 阶段完成比例) x 可分配产值")
    ).toBeInTheDocument();
  });

  it("switches module pages from the sidebar navigation", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText("CRM"));
    expect(screen.getByRole("heading", { name: "CRM 工作台" })).toBeInTheDocument();
    expect(screen.getByText("客户、联系人、线索、机会转化漏斗")).toBeInTheDocument();

    await user.click(screen.getByText("合同管理"));
    expect(screen.getByRole("heading", { name: "合同管理" })).toBeInTheDocument();
    expect(screen.getByText("合同审批、补充协议、合同转项目")).toBeInTheDocument();
  });

  it("creates customers and leads through the business API", async () => {
    const { fetchMock } = mockBusinessApi();
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText("CRM"));
    await user.type(screen.getByLabelText("客户名称"), "DEMO 新客户");
    await user.type(screen.getByLabelText("客户来源"), "referral");
    await user.type(screen.getByLabelText("负责人"), "市场一部");
    await user.click(screen.getByRole("button", { name: "保存客户" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/business/customers",
      expect.objectContaining({ method: "POST", body: expect.stringContaining("DEMO 新客户") })
    ));
    await waitFor(() => expect(screen.getByText("DEMO 新客户")).toBeInTheDocument());

    await user.type(screen.getByLabelText("线索标题"), "总部改造线索");
    await user.type(screen.getByLabelText("预计金额"), "8420000");
    await user.click(screen.getByRole("button", { name: "保存线索" }));

    await waitFor(() => expect(screen.getByText("总部改造线索")).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/business/leads",
      expect.objectContaining({ method: "POST" })
    );
  });
});
