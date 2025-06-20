import React, { useState } from "react";
import { Layout } from "antd";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import styles from "../module-css/dashboard.module.css";

const { Content } = Layout;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout>
        <Navbar
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((c) => !c)}
        />
        <Content className={styles.adminContent}>
          {/* Body content here */}
          <h1>dashboard</h1>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
