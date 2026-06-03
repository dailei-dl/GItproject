import { Controller, Inject, Post } from "@nestjs/common";
import { ValueEngineService } from "./value-engine.service";

@Controller("value-engine")
export class ValueEngineController {
  constructor(
    @Inject(ValueEngineService)
    private readonly valueEngineService: ValueEngineService
  ) {}

  @Post("demo-flow")
  runDemoFlow() {
    return this.valueEngineService.runDemoFlow();
  }
}
