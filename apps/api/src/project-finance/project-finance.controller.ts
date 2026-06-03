import { Controller, Inject, Post } from "@nestjs/common";
import { ProjectFinanceService } from "./project-finance.service";

@Controller("project-finance")
export class ProjectFinanceController {
  constructor(
    @Inject(ProjectFinanceService)
    private readonly projectFinanceService: ProjectFinanceService
  ) {}

  @Post("demo-flow")
  runDemoFlow() {
    return this.projectFinanceService.runDemoFlow();
  }
}
