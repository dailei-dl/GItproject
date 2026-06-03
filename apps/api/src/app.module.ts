import { Module } from "@nestjs/common";
import { AuditService } from "./audit/audit.service";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { CrmContractController } from "./crm-contract/crm-contract.controller";
import { CrmContractService } from "./crm-contract/crm-contract.service";
import { DashboardController } from "./dashboard/dashboard.controller";
import { DashboardService } from "./dashboard/dashboard.service";
import { HealthController } from "./health.controller";
import { PermissionService } from "./permissions/permission.service";
import { ProjectFinanceController } from "./project-finance/project-finance.controller";
import { ProjectFinanceService } from "./project-finance/project-finance.service";
import { ValueEngineController } from "./value-engine/value-engine.controller";
import { ValueEngineService } from "./value-engine/value-engine.service";

@Module({
  controllers: [AuthController, CrmContractController, DashboardController, HealthController, ProjectFinanceController, ValueEngineController],
  providers: [AuditService, AuthService, CrmContractService, DashboardService, PermissionService, ProjectFinanceService, ValueEngineService],
})
export class AppModule {}
