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
import type { ColumnsType } from "antd/es/table";
import ReactECharts from "echarts-for-react";

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

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
];

export function App() {
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
          <Menu className="nav-menu" mode="inline" selectedKeys={["dashboard"]} items={menuItems} />
        </Sider>
        <Layout>
          <Header className="topbar">
            <div>
              <Text className="eyebrow">MVP 经营闭环</Text>
              <Title level={1}>经营驾驶舱</Title>
            </div>
            <Button type="primary">新建线索</Button>
          </Header>
          <Content className="content">
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
                <Table
                  columns={traceColumns}
                  dataSource={traceRows}
                  pagination={false}
                  scroll={{ x: 560 }}
                  size="small"
                />
              </Card>
            </section>

            <Card title="项目风险" className="panel">
              <Table columns={riskColumns} dataSource={riskRows} pagination={false} scroll={{ x: 760 }} />
            </Card>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
