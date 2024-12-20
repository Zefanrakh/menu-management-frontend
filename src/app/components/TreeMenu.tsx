"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { ConfigProvider, Tree } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { selectMenu, setExpandedKeys } from "@/state/menu/menuSlice";
import { DownOutlined } from "@ant-design/icons";
import type { TreeDataNode } from "antd";
import { MenuItem } from "@/type/menuItem";
import { TreeNode } from "antd/es/tree-select";
import { useRouter } from "next/navigation";
import { DataNode, EventDataNode } from "antd/es/tree";
import TitleRenderer from "./TitleRenderer";
import { Key } from "antd/es/table/interface";
import { fetchMenus } from "@/state/menu/asyncThunk";

const TreeMenu = () => {
  /* ------------------------------ HOOKS ------------------------------ */

  const {
    menuTree: menus,
    expandedKeys,
    selectedMenu,
  } = useSelector((state: RootState) => state.menuReducer);
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
  const dispatch = useDispatch<AppDispatch>();

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
    dispatch(selectMenu(menu.id));
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

  const titleRenderer = (nodeData: TreeDataNode) => {
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
          selectedKeys={[selectedMenu?.id as Key]}
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
