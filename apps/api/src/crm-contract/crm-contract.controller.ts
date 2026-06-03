import { Controller, Inject, Post } from "@nestjs/common";
import { CrmContractService } from "./crm-contract.service";

@Controller("crm-contract")
export class CrmContractController {
  constructor(
    @Inject(CrmContractService)
    private readonly crmContractService: CrmContractService
  ) {}

  @Post("demo-flow")
  runDemoFlow() {
    return this.crmContractService.runDemoFlow();
  }
}
