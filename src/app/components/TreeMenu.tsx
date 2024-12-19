"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Button, ConfigProvider, Tree } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { fetchMenus, setExpandedKeys } from "@/state/menu/menuSlice";
import { DownOutlined } from "@ant-design/icons";
import type { TreeDataNode } from "antd";
import { MenuItem } from "@/type/menuItem";
import { TreeNode } from "antd/es/tree-select";
import { useRouter } from "next/navigation";
import { DataNode, EventDataNode } from "antd/es/tree";
import TitleRenderer from "./TitleRenderer";
import { Key } from "antd/es/table/interface";

const TreeMenu = () => {
  /* ------------------------------ HOOKS ------------------------------ */

  const { menuTree: menus, expandedKeys } = useSelector(
    (state: RootState) => state.menuReducer
  );
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchMenus());
  }, []);

  useEffect(() => {
    function generateTreeData(menus: MenuItem[]): TreeDataNode[] {
      return menus.map((menu) => {
        return {
          title: menu.name,
          key: menu.id,
          children: generateTreeData(menu?.children ?? []),
          dataRef: menu,
        };
      });
    }
    setTreeData(() => generateTreeData(menus));
  }, [menus]);

  /** -------------------------- FUNCTIONS ------------------------------ */

  const handleSelectMenu = (menu: MenuItem) => {
    router.push(`/menus/${menu.id}`);
  };

  const handleOnExpand = (keys: Key[]) => {
    dispatch(setExpandedKeys(keys as number[]));
  };

  /* ------------------------------ RENDER ------------------------------- */

  const renderTreeNodes = (menus: MenuItem[]): TreeDataNode[] => {
    return (
      menus?.map((menu): TreeDataNode => {
        return (
          <TreeNode
            title={menu.name}
            key={menu.id}
            dataRef={menu}
            value={menu.name}
          >
            {renderTreeNodes(menu?.children ?? []) as ReactNode}
          </TreeNode>
        ) as TreeDataNode;
      }) ?? []
    );
  };

  const titleRenderer = (nodeData: any) => {
    return <TitleRenderer nodeData={nodeData} />;
  };

  return (
    <div className="App">
      <ConfigProvider
        theme={{
          components: {
            Tree: {
              nodeHoverBg: "transparent",
            },
          },
        }}
      >
        <Tree
          expandedKeys={expandedKeys}
          onExpand={handleOnExpand}
          showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={["0-0-0"]}
          onSelect={(_, info) => {
            handleSelectMenu(
              (info.node as EventDataNode<DataNode & { dataRef: MenuItem }>)
                .dataRef
            );
          }}
          treeData={treeData}
          defaultExpandAll={true}
          titleRender={titleRenderer}
          className="[&_*_.ant-tree-node-content-wrapper]:p-0"
        />
      </ConfigProvider>
    </div>
  );
};

export default TreeMenu;
