import { useState } from "react";
import {
  AuditOutlined,
  BankOutlined,
  BarChartOutlined,
  ContactsOutlined,
  DashboardOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  SafetyOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Card, ConfigProvider, Layout, Menu, Table, Tag, Typography } from "antd";
import type { MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import ReactECharts from "echarts-for-react";

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

type PageKey =
  | "dashboard"
  | "crm"
  | "contracts"
  | "projects"
  | "finance"
  | "value"
  | "permissions"
  | "audit";

type Metric = {
  label: string;
  value: string;
  tone: "blue" | "green" | "orange" | "purple";
};

type RiskRow = {
  key: string;
  project: string;
  owner: string;
  risk: string;
  status: "跟进中" | "待确认" | "已缓解";
};

type TraceRow = {
  key: string;
  stage: string;
  formula: string;
  result: string;
};

const metrics: Metric[] = [
  { label: "合同额", value: "¥8,420,000", tone: "blue" },
  { label: "回款额", value: "¥5,180,000", tone: "green" },
  { label: "支出", value: "¥1,260,000", tone: "orange" },
  { label: "净流水", value: "¥3,920,000", tone: "purple" },
  { label: "可分配产值", value: "¥3,136,000", tone: "blue" },
  { label: "确认产值", value: "¥2,352,000", tone: "green" },
];

const riskRows: RiskRow[] = [
  { key: "1", project: "DT-DEMO-001 总部改造", owner: "项目负责人 A", risk: "阶段完成低于回款比例", status: "跟进中" },
  { key: "2", project: "DT-DEMO-009 园区设计", owner: "项目负责人 B", risk: "外协成本接近预算阈值", status: "待确认" },
  { key: "3", project: "DT-DEMO-014 城市更新", owner: "项目负责人 C", risk: "合同补充协议待审批", status: "已缓解" },
];

const traceRows: TraceRow[] = [
  { key: "1", stage: "项目净流水", formula: "回款 - 支出 - 外协 - 税费 - 管理费", result: "¥3,920,000" },
  { key: "2", stage: "可分配产值", formula: "净流水 x 0.80", result: "¥3,136,000" },
  { key: "3", stage: "确认产值", formula: "min(0.75, 0.60) x 可分配产值", result: "¥2,352,000" },
];

const riskColumns: ColumnsType<RiskRow> = [
  { title: "项目", dataIndex: "project", key: "project" },
  { title: "负责人", dataIndex: "owner", key: "owner" },
  { title: "风险", dataIndex: "risk", key: "risk" },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    render: (status: RiskRow["status"]) => (
      <Tag color={status === "已缓解" ? "green" : status === "待确认" ? "orange" : "blue"}>{status}</Tag>
    ),
  },
];

const traceColumns: ColumnsType<TraceRow> = [
  { title: "节点", dataIndex: "stage", key: "stage" },
  { title: "计算口径", dataIndex: "formula", key: "formula" },
  { title: "结果", dataIndex: "result", key: "result", align: "right" },
];

const trendOption = {
  color: ["#2563eb", "#16a34a"],
  tooltip: { trigger: "axis" },
  legend: { data: ["回款额", "确认产值"] },
  grid: { left: 36, right: 16, top: 42, bottom: 28 },
  xAxis: { type: "category", data: ["1月", "2月", "3月", "4月", "5月", "6月"] },
  yAxis: { type: "value" },
  series: [
    { name: "回款额", type: "line", smooth: true, data: [680, 740, 820, 910, 960, 1180] },
    { name: "确认产值", type: "line", smooth: true, data: [420, 480, 560, 620, 700, 820] },
  ],
};

const menuItems = [
  { key: "dashboard", icon: <DashboardOutlined />, label: "经营驾驶舱" },
  { key: "crm", icon: <ContactsOutlined />, label: "CRM" },
  { key: "contracts", icon: <FileTextOutlined />, label: "合同管理" },
  { key: "projects", icon: <FolderOpenOutlined />, label: "项目管理" },
  { key: "finance", icon: <BankOutlined />, label: "财务管理" },
  { key: "value", icon: <BarChartOutlined />, label: "产值管理" },
  { key: "permissions", icon: <TeamOutlined />, label: "组织权限" },
  { key: "audit", icon: <AuditOutlined />, label: "审计日志" },
] satisfies MenuProps["items"];

const pageMeta: Record<PageKey, { title: string; subtitle: string; action: string }> = {
  dashboard: { title: "经营驾驶舱", subtitle: "MVP 经营闭环", action: "新建线索" },
  crm: { title: "CRM 工作台", subtitle: "客户、联系人、线索、机会转化漏斗", action: "新建客户" },
  contracts: { title: "合同管理", subtitle: "合同审批、补充协议、合同转项目", action: "新建合同" },
  projects: { title: "项目管理", subtitle: "项目档案、阶段、成员、任务、风险", action: "新建项目" },
  finance: { title: "财务管理", subtitle: "收款计划、回款、开票、支出、外协成本", action: "登记回款" },
  value: { title: "产值管理", subtitle: "规则版本、项目产值池、部门分配、个人分配", action: "配置规则" },
  permissions: { title: "组织权限", subtitle: "公司、分院、部门、员工、角色、字段权限", action: "新增角色" },
  audit: { title: "审计日志", subtitle: "登录、导出、金额修改、规则变更、权限变更", action: "导出日志" },
};

type ModuleRow = {
  key: string;
  name: string;
  owner: string;
  status: string;
  amount: string;
};

const moduleRows: Record<Exclude<PageKey, "dashboard">, ModuleRow[]> = {
  crm: [
    { key: "crm-1", name: "华东城市更新客户群", owner: "市场一部", status: "方案沟通", amount: "线索 18 / 商机 6" },
    { key: "crm-2", name: "西南产业园设计机会", owner: "分院经营", status: "投标准备", amount: "预计合同 860万" },
    { key: "crm-3", name: "老客户复购清单", owner: "客户成功", status: "持续拜访", amount: "回访 24 家" },
  ],
  contracts: [
    { key: "con-1", name: "A-2026-061 城市更新设计合同", owner: "合同专员", status: "法务审核", amount: "1,280万" },
    { key: "con-2", name: "B-2026-044 补充协议", owner: "项目经理", status: "待盖章", amount: "96万" },
    { key: "con-3", name: "C-2026-019 合同转项目", owner: "运营管理", status: "已转交付", amount: "420万" },
  ],
  projects: [
    { key: "pro-1", name: "海绵城市示范片区", owner: "设计一院", status: "扩初设计", amount: "进度 68%" },
    { key: "pro-2", name: "滨水公共空间改造", owner: "景观所", status: "施工图", amount: "风险 2 项" },
    { key: "pro-3", name: "产业园综合楼", owner: "建筑所", status: "方案深化", amount: "成员 12 人" },
  ],
  finance: [
    { key: "fin-1", name: "6 月应收计划", owner: "财务部", status: "催收中", amount: "342万" },
    { key: "fin-2", name: "已开票未回款", owner: "财务部", status: "逾期预警", amount: "116万" },
    { key: "fin-3", name: "外协成本确认", owner: "成本会计", status: "待审批", amount: "58万" },
  ],
  value: [
    { key: "val-1", name: "2026 产值规则 V1", owner: "经营管理", status: "启用中", amount: "规则 12 条" },
    { key: "val-2", name: "项目产值池试算", owner: "财务部", status: "待确认", amount: "764万" },
    { key: "val-3", name: "个人产值分配", owner: "分院院长", status: "复核中", amount: "82 人" },
  ],
  permissions: [
    { key: "per-1", name: "经营管理员", owner: "系统管理员", status: "已授权", amount: "字段权限 36 项" },
    { key: "per-2", name: "分院负责人", owner: "组织管理", status: "待复核", amount: "数据范围 4 级" },
    { key: "per-3", name: "财务专员", owner: "财务部", status: "已授权", amount: "敏感字段脱敏" },
  ],
  audit: [
    { key: "aud-1", name: "金额字段修改", owner: "审计策略", status: "高风险", amount: "今日 3 次" },
    { key: "aud-2", name: "导出客户清单", owner: "审计策略", status: "需留痕", amount: "今日 8 次" },
    { key: "aud-3", name: "产值规则变更", owner: "审计策略", status: "已记录", amount: "版本 V1.2" },
  ],
};

const moduleColumns: ColumnsType<ModuleRow> = [
  { title: "事项", dataIndex: "name", key: "name" },
  { title: "责任方", dataIndex: "owner", key: "owner" },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <Tag color={status.includes("风险") || status.includes("逾期") || status === "高风险" ? "red" : "blue"}>
        {status}
      </Tag>
    ),
  },
  { title: "关键数据", dataIndex: "amount", key: "amount", align: "right" },
];

function DashboardPage() {
  return (
    <>
      <section className="metric-grid" aria-label="经营指标">
        {metrics.map((metric) => (
          <Card className={`metric-card metric-${metric.tone}`} key={metric.label}>
            <Text>{metric.label}</Text>
            <strong>{metric.value}</strong>
          </Card>
        ))}
      </section>

      <section className="dashboard-grid">
        <Card title="回款与产值趋势" className="panel chart-panel">
          <ReactECharts option={trendOption} style={{ height: 280, minWidth: 560 }} />
        </Card>
        <Card title="计算链路" className="panel formula-panel">
          <Text className="formula">确认产值 = min(回款比例, 阶段完成比例) x 可分配产值</Text>
          <Table columns={traceColumns} dataSource={traceRows} pagination={false} scroll={{ x: 560 }} size="small" />
        </Card>
      </section>

      <Card title="项目风险" className="panel">
        <Table columns={riskColumns} dataSource={riskRows} pagination={false} scroll={{ x: 760 }} />
      </Card>
    </>
  );
}

function ModulePage({ page }: { page: Exclude<PageKey, "dashboard"> }) {
  const meta = pageMeta[page];

  return (
    <section className="module-page">
      <Card className="module-hero">
        <Text className="module-title">{meta.title}</Text>
        <div className="module-summary">
          <span>待办 12</span>
          <span>本周新增 8</span>
          <span>需复核 3</span>
        </div>
      </Card>
      <Card title="核心事项" className="panel">
        <Table columns={moduleColumns} dataSource={moduleRows[page]} pagination={false} scroll={{ x: 760 }} />
      </Card>
    </section>
  );
}

export function App() {
  const [activePage, setActivePage] = useState<PageKey>("dashboard");
  const currentPage = pageMeta[activePage];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2563eb",
          borderRadius: 6,
          fontFamily:
            'Inter, "Segoe UI", "Microsoft YaHei", "PingFang SC", Arial, sans-serif',
        },
      }}
    >
      <Layout className="app-shell">
        <Sider className="sidebar" breakpoint="lg" collapsedWidth={0} width={232}>
          <div className="brand">
            <SafetyOutlined aria-hidden="true" />
            <span>DesignTwin</span>
          </div>
          <Menu
            className="nav-menu"
            mode="inline"
            selectedKeys={[activePage]}
            items={menuItems}
            onClick={({ key }) => setActivePage(key as PageKey)}
          />
        </Sider>
        <Layout>
          <Header className="topbar">
            <div>
              <Text className="eyebrow">{currentPage.subtitle}</Text>
              <Title level={1}>{currentPage.title}</Title>
            </div>
            <Button type="primary">{currentPage.action}</Button>
          </Header>
          <Content className="content">
            {activePage === "dashboard" ? <DashboardPage /> : <ModulePage page={activePage} />}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
