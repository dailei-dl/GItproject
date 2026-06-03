import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { App } from "./App";

vi.mock("echarts-for-react", () => ({
  default: () => React.createElement("div", { "data-testid": "trend-chart" }),
}));

describe("DesignTwin web shell", () => {
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
});
