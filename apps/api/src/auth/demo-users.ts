import type { DataScope, DesignTwinRole } from "@designtwin/shared";

export type DemoUser = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: DesignTwinRole;
  dataScope: DataScope;
  branchId: string;
  departmentId: string;
};

export const DEMO_USERS: DemoUser[] = [
  {
    id: "u-admin",
    email: "admin@demo.designtwin.local",
    password: "Demo@123456",
    name: "演示管理员",
    role: "admin",
    dataScope: "company",
    branchId: "branch-demo-1",
    departmentId: "dept-admin",
  },
  {
    id: "u-owner",
    email: "owner@demo.designtwin.local",
    password: "Demo@123456",
    name: "演示老板",
    role: "owner",
    dataScope: "company",
    branchId: "branch-demo-1",
    departmentId: "dept-management",
  },
  {
    id: "u-employee",
    email: "employee@demo.designtwin.local",
    password: "Demo@123456",
    name: "演示员工",
    role: "employee",
    dataScope: "self",
    branchId: "branch-demo-1",
    departmentId: "dept-design-1",
  },
];
