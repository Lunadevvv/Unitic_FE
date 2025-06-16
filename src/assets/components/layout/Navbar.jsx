import React from "react";
import { Layout, Input, Avatar } from "antd";
import {
  SearchOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import styles from "../../module-css/navbar.module.css";

const { Header } = Layout;

const Navbar = ({ collapsed, onToggleSidebar }) => (
  <Header className={styles.navbar}>
    <span className={styles.menuToggle} onClick={onToggleSidebar}>
      {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    </span>
    <div className={styles.logo}>UniTic</div>
    <div className={styles.searchSection}>
      <Input
        className={styles.searchInput}
        placeholder="Quick search"
        prefix={<SearchOutlined />}
      />
    </div>
    <div className={styles.avatarSection}>
      <Avatar icon={<UserOutlined />} />
    </div>
  </Header>
);

export default Navbar;
