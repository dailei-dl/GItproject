import { describe, expect, it } from "vitest";
import { AuditService } from "./audit.service";

describe("AuditService", () => {
  it("records security-relevant events with actor, action, target, and timestamp", () => {
    const service = new AuditService();

    service.record({
      actorId: "u-admin",
      action: "auth.login",
      targetType: "user",
      targetId: "u-admin",
      metadata: { role: "admin" },
    });

    const [event] = service.list();
    expect(event?.actorId).toBe("u-admin");
    expect(event?.action).toBe("auth.login");
    expect(event?.metadata).toEqual({ role: "admin" });
    expect(event?.createdAt).toBeInstanceOf(Date);
  });
});
