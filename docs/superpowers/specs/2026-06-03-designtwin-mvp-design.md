# DesignTwin MVP 总体设计规格

日期：2026-06-03

目标仓库：`dailei-dl/GItproject`

目标分支：`feature/product-foundation`

## 1. 项目定位

DesignTwin 是面向设计院、设计公司、分院制机构的企业经营孪生平台。第一期不做完整 SaaS、不做复杂 AI、不替代完整财务软件，先交付一个可运行、可验证、可追溯的 MVP。

MVP 主线为：

```text
线索 -> 机会 -> 合同 -> 项目立项 -> 回款/支出 -> 产值分配 -> 经营看板
```

第一期必须从一开始建立权限、审计、金额精度、规则版本和私密数据保护能力，避免后续返工。

## 2. MVP 范围

### 2.1 纳入范围

- CRM：客户、联系人、线索、机会。
- 合同：合同、补充协议、合同转项目。
- 项目：项目档案、阶段、成员、任务、风险。
- 财务：收款计划、回款、开票、支出、外协成本。
- 产值：规则配置、项目产值池、部门分配、个人分配、调整审核。
- 看板：老板驾驶舱、分院总览、项目全景、产值分析、人效基础指标。
- 权限：角色权限、组织数据范围、敏感字段展示控制。
- 审计：登录、导出、核心金额修改、规则变更、权限变更、产值调整。
- 部署：Docker Compose 本地一键启动。

### 2.2 暂缓范围

- 完整多租户计费。
- 行业模板市场。
- 复杂预测模型。
- 完整移动审批 App。
- 税务申报、总账核算、薪酬发放、个税计算。
- BIM 或专业绘图文件在线协同。

## 3. 技术架构

采用 React + TypeScript + NestJS + PostgreSQL + Docker Compose 的模块化 Monorepo。

```text
apps/web          React + TypeScript 企业后台
apps/api          NestJS + TypeScript REST API
packages/shared  前后端共享类型、枚举、校验 Schema
infra/docker      PostgreSQL、Redis、MinIO、Nginx、Compose
docs              PRD、接口、权限矩阵、部署、测试、验收文档
```

### 3.1 后端模块

```text
auth-org          登录、JWT、用户、公司、分院、部门、角色、权限范围
crm               客户、联系人、线索、机会
contract          合同、补充协议、合同转项目
project           项目、阶段、成员、任务、风险
finance           收款计划、回款、开票、支出、外协成本
value-engine      产值规则、规则版本、分配、调整、审核、计算链路
dashboard         驾驶舱、分院总览、项目全景、产值分析
audit             登录日志、操作日志、导出日志、权限变更日志
```

### 3.2 基础设施

- PostgreSQL：主数据库，金额字段使用 `numeric/decimal`。
- Redis：登录会话、权限缓存、看板缓存。
- MinIO：合同、成果文件、附件对象存储。
- Nginx：统一入口和反向代理。
- Docker Compose：本地和演示环境一键启动。

## 4. 产品与 UI 设计

UI 方向为安静、密集、可扫描的企业后台。第一屏直接进入经营驾驶舱，不做营销式首页。

### 4.1 页面结构

```text
登录
经营驾驶舱
CRM：客户、联系人、线索、机会
合同管理：合同、补充协议、合同转项目
项目管理：项目档案、阶段、成员、任务、风险
财务管理：收款计划、回款、开票、支出、外协成本
产值管理：规则配置、项目产值池、部门分配、个人分配、调整审核
组织权限：公司、分院、部门、员工、角色、数据范围
审计日志：登录、导出、金额修改、规则变更、权限变更
```

### 4.2 核心页面

- 经营驾驶舱：合同额、回款额、开票额、支出、净流水、可分配产值、确认产值、部门排行、项目风险。
- 项目全景页：合同、阶段、成员、回款、支出、成果、风险、审批和产值链路在同一项目档案内呈现。
- 产值分析页：公式、规则版本、计算链路、分配比例、审批状态、调整记录。
- 权限页面：角色权限、组织数据范围、敏感字段可见性分开配置。
- 审计页面：核心金额、规则、导出、权限变更可追溯。

### 4.3 组件选型

前端采用 React + TypeScript + Ant Design + ECharts。Ant Design 负责后台表格、表单、筛选、弹窗、菜单和权限页面，ECharts 负责经营看板、漏斗、排行、趋势和风险图表。

移动端第一期只要求响应式可查看，不做完整移动审批 App。

## 5. 后端、数据库与权限

### 5.1 后端分层

```text
Controller          REST API、鉴权、参数校验
Service             业务流程、状态流转、权限检查
Domain              产值公式、金额口径、规则版本、数据权限
Repository/Prisma   数据库读写
Audit               关键行为统一留痕
```

ORM 采用 Prisma，便于 TypeScript 类型生成、迁移管理和共享类型协同。

### 5.2 核心数据表

```text
组织与权限：companies, branches, departments, employees, roles, user_roles, permission_scopes
CRM：customers, contacts, leads, opportunities
合同项目：contracts, contract_changes, projects, project_stages, project_members, project_tasks, project_risks
财务：payment_plans, receipts, invoices, expenses, outsource_payments
产值：value_rules, project_value_pools, department_value_allocations, personal_value_allocations, value_adjustments, value_approvals
审计：audit_logs, export_logs, login_logs
附件：files
```

### 5.3 权限模型

- RBAC：老板、分院负责人、部门负责人、项目负责人、财务、人事、员工、管理员。
- 数据权限：公司、分院、部门、项目、本人范围。
- 字段权限：合同金额、成本、净流水、个人产值、绩效等敏感字段可脱敏或隐藏。

后端必须强制执行权限，前端只负责菜单和展示控制。所有查询必须基于用户数据范围过滤。

## 6. 产值规则

第一期实现可解释、可追溯的规则引擎。

```text
项目净流水 = 实际到账金额 - 已支出成本 - 外协成本 - 税费 - 管理费
可分配产值 = 项目净流水 * 产值分配系数
确认产值 = min(回款比例, 项目阶段完成比例) * 可分配产值
个人产值 = 部门产值 * 角色权重 * 个人贡献比例 * 绩效系数
```

规则必须具备：

- 版本号。
- 生效日期。
- 适用范围。
- 审批状态。
- 停用机制。
- 历史项目规则保留。
- 重算日志。

产值调整、核心金额修改和规则变更必须审批并写入审计日志。

## 7. 测试策略

```text
单元测试：产值公式、金额精度、权限判断、规则版本匹配
接口测试：CRM、合同、项目、财务、产值、看板 API
流程测试：线索 -> 机会 -> 合同 -> 立项 -> 回款/支出 -> 产值 -> 看板
权限测试：老板、分院、部门、项目负责人、财务、人事、员工的数据隔离
安全测试：鉴权、越权、SQL 注入、XSS、文件上传、导出权限、密钥扫描
前端测试：关键表单、列表、详情、看板、产值链路页面
```

MVP 合并到 `main` 前，必须至少通过：

- API 单元测试。
- 产值公式测试。
- 权限边界测试。
- 前端构建。
- Docker Compose 启动验证。
- seed 数据完整流程验证。

## 8. 部署方案

第一期使用 Docker Compose。

```text
web         React 构建后由 Nginx 托管
api         NestJS 服务
postgres    主数据库
redis       会话/缓存
minio       附件对象存储
nginx       反向代理，统一入口
```

目标命令：

```powershell
docker compose up -d
```

目标访问：

```text
http://localhost
http://localhost/api/health
```

## 9. 私密数据保护

### 9.1 允许提交

- `.env.example`
- 脱敏 seed 数据
- 演示客户
- 演示合同
- 假人员
- 假金额
- 文档中的变量名和配置说明

### 9.2 禁止提交

- `.env`
- 真实密钥
- GitHub token
- 数据库备份
- 真实客户数据
- 真实合同
- 真实财务数据
- 真实员工数据
- 服务器地址
- 证书私钥
- 原始生产日志

仓库必须配置 `.gitignore`、密钥扫描脚本、CI 检查和依赖锁文件。所有演示数据必须明确标记为 demo。

## 10. Git 分支策略

```text
main
feature/product-foundation
feature/ui-shell
feature/org-auth
feature/crm-contract
feature/project-finance
feature/value-engine
feature/dashboard
feature/devops-test
```

每个模块分支必须同时包含：

- 前端页面或组件。
- 后端接口。
- 共享类型。
- 数据库迁移。
- 测试。
- 文档。

最终由 `main` 汇总成可运行 MVP。

## 11. 开发顺序

```text
1. product-foundation
   建仓库、Monorepo、README、PRD、字段字典、权限矩阵、分支规范、保密边界、.gitignore、.env.example

2. ui-shell
   React 后台框架、登录页、侧边栏、经营驾驶舱布局、列表/表单/详情基础组件、图表基础组件

3. org-auth
   用户、组织、分院、部门、角色、登录、JWT、权限范围、字段脱敏、审计基础

4. crm-contract
   客户、联系人、线索、机会、合同、补充协议、合同转项目

5. project-finance
   项目、阶段、成员、任务、风险、收款计划、回款、开票、支出、外协成本

6. value-engine
   产值规则、规则版本、项目产值池、部门分配、个人分配、调整审核、计算链路追溯

7. dashboard
   老板驾驶舱、分院总览、项目全景、产值分析、人效基础指标

8. devops-test
   Docker Compose、Nginx、seed 数据、自动化测试、CI、部署手册、验收报告
```

## 12. MVP 验收标准

- 能用脱敏 seed 数据完整跑通主流程。
- 不同角色看到的数据范围正确。
- 金额计算使用 `decimal/numeric`，不出现浮点误差。
- 产值规则可解释、可追溯、可按版本保留。
- 核心金额、产值调整、规则变更、导出、权限变更有审计日志。
- 本地 Docker Compose 能一键启动。
- GitHub 仓库包含模块分支和最终 `main`。
- 无真实密钥、真实客户数据、真实合同、数据库备份被提交。

## 13. MVP 默认决策

为保证第一期可以直接实施，采用以下默认决策。后续如业务方要求变更，进入变更池并在对应模块分支调整。

- 启用 GitHub Actions，至少执行依赖安装、类型检查、单元测试和构建。
- 所有模块分支优先通过 Pull Request 合并到 `main`，本地开发允许先提交分支。
- 第一批演示组织采用 1 个公司、1 个分院、3 个部门、100 名演示员工、20 个演示项目。
- 默认产值分配系数为 1.0，角色权重与个人贡献比例在 `value_rules` 中配置。
- MinIO 在 MVP 中开放附件上传能力，但只使用演示文件和本地对象存储，不提交真实附件。
- 演示账号覆盖管理员、老板、分院负责人、部门负责人、项目负责人、财务、人事和员工。
