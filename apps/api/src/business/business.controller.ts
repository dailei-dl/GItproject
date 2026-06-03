import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from "@nestjs/common";
import { BusinessService } from "./business.service";
import type {
  CalculateValueInput,
  CreateContractInput,
  CreateCustomerInput,
  CreateFinanceEntryInput,
  CreateLeadInput,
  CreateProjectInput,
  QualifyLeadInput,
  UpdateContractInput,
  UpdateCustomerInput,
  UpdateLeadInput,
} from "./business.types";

@Controller("business")
export class BusinessController {
  constructor(
    @Inject(BusinessService)
    private readonly businessService: BusinessService
  ) {}

  @Get("summary")
  getSummary() {
    return this.businessService.getSummary();
  }

  @Get("audit-logs")
  listAuditLogs() {
    return this.businessService.listAuditLogs();
  }

  @Get("customers")
  listCustomers() {
    return this.businessService.listCustomers();
  }

  @Post("customers")
  createCustomer(@Body() body: CreateCustomerInput) {
    return this.businessService.createCustomer(body);
  }

  @Patch("customers/:id")
  updateCustomer(@Param("id") id: string, @Body() body: UpdateCustomerInput) {
    return this.businessService.updateCustomer(id, body);
  }

  @Delete("customers/:id")
  deleteCustomer(@Param("id") id: string) {
    return this.businessService.deleteCustomer(id);
  }

  @Get("leads")
  listLeads() {
    return this.businessService.listLeads();
  }

  @Post("leads")
  createLead(@Body() body: CreateLeadInput) {
    return this.businessService.createLead(body);
  }

  @Patch("leads/:id")
  updateLead(@Param("id") id: string, @Body() body: UpdateLeadInput) {
    return this.businessService.updateLead(id, body);
  }

  @Delete("leads/:id")
  deleteLead(@Param("id") id: string) {
    return this.businessService.deleteLead(id);
  }

  @Post("leads/:id/qualify")
  qualifyLead(@Param("id") id: string, @Body() body: QualifyLeadInput) {
    return this.businessService.qualifyLead(id, body);
  }

  @Get("opportunities")
  listOpportunities() {
    return this.businessService.listOpportunities();
  }

  @Post("opportunities/:id/contracts")
  createContractFromOpportunity(@Param("id") id: string, @Body() body: CreateContractInput) {
    return this.businessService.createContractFromOpportunity(id, body);
  }

  @Get("contracts")
  listContracts() {
    return this.businessService.listContracts();
  }

  @Patch("contracts/:id")
  updateContract(@Param("id") id: string, @Body() body: UpdateContractInput) {
    return this.businessService.updateContract(id, body);
  }

  @Post("contracts/:id/approve")
  approveContract(@Param("id") id: string) {
    return this.businessService.approveContract(id);
  }

  @Post("contracts/:id/projects")
  createProjectFromContract(@Param("id") id: string, @Body() body: CreateProjectInput) {
    return this.businessService.createProjectFromContract(id, body);
  }

  @Get("projects")
  listProjects() {
    return this.businessService.listProjects();
  }

  @Get("finance-entries")
  listFinanceEntries() {
    return this.businessService.listFinanceEntries();
  }

  @Post("projects/:id/finance-entries")
  createFinanceEntry(@Param("id") id: string, @Body() body: CreateFinanceEntryInput) {
    return this.businessService.createFinanceEntry(id, body);
  }

  @Get("value-snapshots")
  listValueSnapshots() {
    return this.businessService.listValueSnapshots();
  }

  @Post("projects/:id/value-snapshots")
  calculateProjectValue(@Param("id") id: string, @Body() body: CalculateValueInput) {
    return this.businessService.calculateProjectValue(id, body);
  }
}
