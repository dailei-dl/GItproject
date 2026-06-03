# DesignTwin 企业级业务 CRUD 与闭环规格

日期：2026-06-03

目标分支：`feature/business-crud-flow`

## 1. 目标

把当前静态页面和 `demo-flow` 接口升级为可操作、可验证、可追溯的企业级业务闭环。第一期先完成一条真实主线：

```text
客户 -> 线索 -> 商机 -> 合同 -> 合同审批 -> 项目立项 -> 回款/支出 -> 产值计算 -> 驾驶舱汇总 -> 审计日志
```

所有页面必须通过 API 读写数据，关键业务动作必须有后端规则校验和测试覆盖。

## 2. 企业级边界

本阶段不再接受只展示静态表格的实现。每个进入范围的模块至少具备：

- 列表查询。
- 新增。
- 编辑。
- 删除或业务关闭。
- 状态流转。
- 后端校验。
- 审计日志。
- 测试覆盖。

数据库模型必须进入 Prisma schema。真实生产运行以 PostgreSQL 为主；本地测试可以使用内存仓储验证业务逻辑，但接口、类型和数据模型必须按持久化设计。

## 3. 数据模型

新增核心模型：

- `Customer`：客户。
- `Lead`：线索。
- `Opportunity`：商机。
- `Contract`：合同。
- `Project`：项目。
- `FinanceEntry`：回款、支出、外协、税费、管理费。
- `ValueRule`：产值规则版本。
- `ValueSnapshot`：项目产值计算快照。

金额字段使用 `Decimal`。业务状态使用枚举，禁止自由字符串。

## 4. API 设计

统一入口：`/business`

- `GET /business/summary`
- `GET /business/audit-logs`
- `GET /business/customers`
- `POST /business/customers`
- `PATCH /business/customers/:id`
- `DELETE /business/customers/:id`
- `POST /business/leads`
- `PATCH /business/leads/:id`
- `DELETE /business/leads/:id`
- `POST /business/leads/:id/qualify`
- `POST /business/opportunities/:id/contracts`
- `PATCH /business/contracts/:id`
- `POST /business/contracts/:id/approve`
- `POST /business/contracts/:id/projects`
- `POST /business/projects/:id/finance-entries`
- `POST /business/projects/:id/value-snapshots`

## 5. 业务规则

- 线索只能从存在的客户创建。
- 已关闭线索不能转商机。
- 商机转合同后，合同初始状态为 `draft`。
- 只有 `draft` 合同可以审批为 `approved`。
- 只有 `approved` 合同可以转项目。
- 一个合同只能转一个项目。
- 财务流水必须绑定项目，金额必须大于 0。
- 项目净流水 = 回款 - 支出 - 外协 - 税费 - 管理费。
- 可分配产值 = 项目净流水 * 产值分配系数。
- 确认产值 = min(回款比例, 阶段完成比例) * 可分配产值。
- 核心动作必须写审计日志。

## 6. 前端设计

前端仍使用企业后台结构，但模块页必须改为真实操作：

- CRM：客户表格、客户抽屉表单、线索创建、线索转商机。
- 合同管理：商机转合同、合同编辑、合同审批、合同转项目。
- 项目管理：项目列表、财务流水入口。
- 财务管理：回款/支出/外协录入。
- 产值管理：产值计算按钮、计算链路展示。
- 经营驾驶舱：从 `/business/summary` 获取真实汇总。
- 审计日志：从 `/business/audit-logs` 获取真实日志。

## 7. 测试

必须覆盖：

- 后端服务主流程测试。
- 后端 API e2e 测试。
- 前端表单与按钮操作测试。
- 前端 API 失败提示测试。
- 构建与类型检查。

核心验收流程：

```text
创建客户 -> 创建线索 -> 线索转商机 -> 商机转合同 -> 审批合同 -> 合同转项目 -> 录入回款和支出 -> 计算产值 -> 驾驶舱汇总变化 -> 审计日志出现关键动作
```

## 8. 私密数据

所有测试和种子数据使用 `DEMO` 标记。不得提交真实客户、真实合同、真实财务、真实员工、密钥或本机私密配置。
