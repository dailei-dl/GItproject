# DesignTwin

DesignTwin 是面向设计院、设计公司和分院制机构的企业经营孪生平台。第一期 MVP 聚焦一条可运行闭环：

```text
线索 -> 机会 -> 合同 -> 项目立项 -> 回款/支出 -> 产值分配 -> 经营看板
```

## 技术栈

- React + TypeScript 前端后台
- NestJS + TypeScript 后端 API
- PostgreSQL 主数据库
- Redis 缓存与会话
- MinIO 附件对象存储
- Docker Compose 本地部署
- npm workspaces 管理 Monorepo

## 当前阶段

当前分支 `feature/product-foundation` 正在建设产品基础：

- Monorepo 工作区
- 共享领域类型
- 产值公式测试
- 权限矩阵和字段字典
- 私密数据保护策略
- CI 基础检查

## 本地开发

```powershell
npm install
npm run check
npm test
```

后续完整 MVP 目标：

```powershell
docker compose up -d
```

## 分支策略

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

每个模块分支都应同时交付必要的前端、后端、共享类型、数据库迁移、测试和文档。

## 私密数据规则

允许提交：

- `.env.example`
- 脱敏 demo seed 数据
- 演示客户、演示合同、演示人员、假金额
- 文档中的变量名和配置说明

禁止提交：

- `.env`
- 真实密钥、Token、证书私钥
- 真实客户、合同、财务、员工数据
- 数据库备份、生产日志、服务器地址

任何真实业务数据进入测试环境前必须脱敏。
