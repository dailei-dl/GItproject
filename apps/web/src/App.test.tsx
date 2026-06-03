import React from "react";
import { render, screen } from "@testing-library/react";
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
});
