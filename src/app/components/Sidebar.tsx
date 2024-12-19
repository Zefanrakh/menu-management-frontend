import { Button, Drawer, Grid } from "antd";
import Sider from "antd/es/layout/Sider";
import { MenuOutlined } from "@ant-design/icons";
import { useState } from "react";
import { SidebarContent } from "./SidebarContent";

const { useBreakpoint } = Grid;

export const Sidebar = () => {
  /* ------------------------------ HOOKS ------------------------------ */

  const [collapsed, setCollapsed] = useState(false);
  const screens = useBreakpoint(); // Menggunakan breakpoint responsif
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  /* ----------------------------- FUNCTION ----------------------------- */

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  /* ------------------------------ RENDER ------------------------------- */

  return (
    <>
      {!screens.md ? (
        <>
          <Button
            icon={<MenuOutlined />}
            onClick={toggleDrawer}
            style={{ position: "absolute", top: 16, left: 16, zIndex: 1000 }}
          />
          <Drawer
            title="Menu"
            placement="left"
            closable
            onClose={toggleDrawer}
            open={isDrawerOpen}
            style={{
              background: "#00152a",
            }}
          >
            <SidebarContent />
          </Drawer>
        </>
      ) : (
        <Sider
          collapsible
          collapsed={collapsed}
          width="20vw"
          onCollapse={(value) => setCollapsed(value)}
          theme="dark"
          style={{ background: "#001529" }}
          className="rounded-[24px]"
        >
          <SidebarContent />
        </Sider>
      )}
    </>
  );
};
