import { Module } from "@nestjs/common";
import { AuditService } from "./audit/audit.service";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { CrmContractController } from "./crm-contract/crm-contract.controller";
import { CrmContractService } from "./crm-contract/crm-contract.service";
import { HealthController } from "./health.controller";
import { PermissionService } from "./permissions/permission.service";
import { ProjectFinanceController } from "./project-finance/project-finance.controller";
import { ProjectFinanceService } from "./project-finance/project-finance.service";

@Module({
  controllers: [AuthController, CrmContractController, HealthController, ProjectFinanceController],
  providers: [AuditService, AuthService, CrmContractService, PermissionService, ProjectFinanceService],
})
export class AppModule {}
