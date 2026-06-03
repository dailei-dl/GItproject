import { describe, expect, it } from "vitest";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  it("logs in a demo admin and returns role and token claims", async () => {
    const service = new AuthService();

    const session = await service.login({
      email: "admin@demo.designtwin.local",
      password: "Demo@123456",
    });

    expect(session.user.role).toBe("admin");
    expect(session.user.dataScope).toBe("company");
    expect(session.accessToken.split(".")).toHaveLength(3);
  });

  it("rejects invalid credentials", async () => {
    const service = new AuthService();

    await expect(
      service.login({ email: "admin@demo.designtwin.local", password: "wrong" })
    ).rejects.toThrow("Invalid credentials");
  });
});
