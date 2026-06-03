import { describe, expect, it } from "vitest";
import { DashboardService } from "./dashboard.service";

describe("DashboardService", () => {
  it("returns MVP operating metrics and risks", () => {
    const service = new DashboardService();
    const summary = service.getDemoSummary();

    expect(summary.metrics.confirmedValue).toBe("2352000.00");
    expect(summary.valueTrace).toHaveLength(3);
    expect(summary.risks[0]?.projectCode).toBe("DT-DEMO-001");
  });
});
