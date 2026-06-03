import { Module } from "@nestjs/common";
import { AuditService } from "./audit/audit.service";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { HealthController } from "./health.controller";
import { PermissionService } from "./permissions/permission.service";

@Module({
  controllers: [AuthController, HealthController],
  providers: [AuditService, AuthService, PermissionService],
})
export class AppModule {}
