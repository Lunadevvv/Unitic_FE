import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined,
  DollarOutlined,
  AppstoreOutlined,
  SwapOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import styles from "../../module-css/sidebar.module.css";

const { Sider } = Layout;

const menuItems = [
  { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "events", icon: <CalendarOutlined />, label: "Events" },
  { key: "accounts", icon: <UserOutlined />, label: "Accounts" },
  { key: "tickets", icon: <FileTextOutlined />, label: "Tickets" },
  { key: "statistics", icon: <BarChartOutlined />, label: "Statistics" },
  { key: "revenue", icon: <DollarOutlined />, label: "Revenue & Payment" },
  { key: "services", icon: <AppstoreOutlined />, label: "Services" },
  { key: "transactions", icon: <SwapOutlined />, label: "Transactions" },
  { key: "setting", icon: <SettingOutlined />, label: "Setting" },
];

const Sidebar = ({ collapsed, onCollapse }) => (
  <Sider
    className={styles.sidebar}
    width={220}
    collapsible
    collapsed={collapsed}
    onCollapse={onCollapse}
    breakpoint="lg"
    collapsedWidth={60}
  >
    <Menu
      mode="inline"
      defaultSelectedKeys={["dashboard"]}
      items={menuItems}
      className={styles.menu}
    />
  </Sider>
);

export default Sidebar;
