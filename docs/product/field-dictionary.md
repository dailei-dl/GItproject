# MVP 字段字典

## CRM

| 对象 | 字段 | 类型 | 说明 |
| --- | --- | --- | --- |
| 客户 | name | string | 演示客户名称，不使用真实客户 |
| 客户 | source | enum | 线索来源 |
| 联系人 | phoneMasked | string | 脱敏手机号 |
| 线索 | status | enum | new, contacted, qualified, lost |
| 机会 | stage | enum | discovery, proposal, bidding, won, lost |

## 合同与项目

| 对象 | 字段 | 类型 | 说明 |
| --- | --- | --- | --- |
| 合同 | contractAmount | decimal string | 合同金额，数据库使用 numeric |
| 合同 | approvedAt | datetime | 审批通过时间 |
| 项目 | projectCode | string | demo 项目编号 |
| 项目 | stageCompletionRatio | decimal string | 阶段完成比例 |
| 项目成员 | contributionRatio | decimal string | 个人贡献比例 |

## 财务与产值

| 对象 | 字段 | 类型 | 说明 |
| --- | --- | --- | --- |
| 回款 | receivedAmount | decimal string | 财务确认到账金额 |
| 支出 | paidCost | decimal string | 已支出成本 |
| 外协 | outsourceCost | decimal string | 外协成本 |
| 产值规则 | allocationCoefficient | decimal string | 可分配产值系数 |
| 产值规则 | version | string | 规则版本 |
| 个人产值 | personalValue | decimal string | 公式计算结果 |

金额字段统一禁止使用 JavaScript number 做业务计算。
