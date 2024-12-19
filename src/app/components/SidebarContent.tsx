"use client";

import { RootState } from "@/state/store";
import { MenuItem } from "@/type/menuItem";
import { ConfigProvider, Image, Menu, MenuProps } from "antd";
import { ItemType } from "antd/es/menu/interface";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FolderFilled, AppstoreOutlined } from "@ant-design/icons";

type AntdMenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: AntdMenuItem[]
): AntdMenuItem {
  return {
    label,
    key,
    icon,
    children,
    className: "!pl-[10px]",
  } as AntdMenuItem;
}

export const SidebarContent = () => {
  /* ------------------------------ HOOKS ------------------------------ */

  const { menuTree: menus } = useSelector(
    (state: RootState) => state.menuReducer
  );

  /* ------------------------------ RENDER ------------------------------- */

  const renderMenuItems = (menus: MenuItem[]): AntdMenuItem[] => {
    return (
      menus?.flatMap((menu): AntdMenuItem | ItemType[] => {
        if (menu.depth === 1) return renderMenuItems(menu?.children ?? []);
        return getItem(
          menu.name,
          menu.id,
          menu.depth === 2 ? <FolderFilled /> : <AppstoreOutlined />,
          menu.depth === 3 ? undefined : renderMenuItems(menu?.children ?? [])
        );
      }) ?? []
    );
  };
  const items = renderMenuItems(menus);

  return (
    <>
      <div className="demo-logo-vertical px-[1.5rem]">
        <Image src="/main-logo.svg" alt="My Icon" width={80} height={80} />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "6px",
        }}
      >
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                darkItemSelectedBg: "#9FF443",
              },
            },
          }}
        >
          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
            style={{ width: "90%" }}
            className="[&_.ant-menu-submenu.ant-menu-submenu-open]:bg-[#1D2939] [&_.ant-menu-submenu_.ant-menu]:!bg-[#1D2939] [&_.ant-menu-submenu_.ant-menu-submenu-title]:!pl-[10px] [&_.ant-menu-submenu_.ant-menu]:!bg-[#1D2939] [&_.ant-menu-submenu_.ant-menu]:!rounded-b-[24px]"
          />
        </ConfigProvider>
      </div>
    </>
  );
};
