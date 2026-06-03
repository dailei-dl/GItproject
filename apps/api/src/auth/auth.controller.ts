import { Body, Controller, Inject, Post, UnauthorizedException } from "@nestjs/common";
import { AuditService } from "../audit/audit.service";
import { AuthService, type LoginInput } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(AuditService)
    private readonly auditService: AuditService
  ) {}

  @Post("login")
  async login(@Body() input: LoginInput) {
    try {
      const session = await this.authService.login(input);
      this.auditService.record({
        actorId: session.user.id,
        action: "auth.login",
        targetType: "user",
        targetId: session.user.id,
        metadata: { role: session.user.role },
      });
      return session;
    } catch {
      throw new UnauthorizedException("Invalid credentials");
    }
  }
}
