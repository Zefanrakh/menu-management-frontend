"use client";

import { AppDispatch, RootState } from "@/state/store";
import { App, Button, TreeDataNode } from "antd";
import { ReactNode, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { MenuItem } from "@/type/menuItem";
import { deleteMenu, postMenu } from "@/state/menu/asyncThunk";

const TitleRenderer = ({ nodeData }: { nodeData: TreeDataNode }) => {
  /* ------------------------------ HOOKS ------------------------------ */

  const { notification } = App.useApp();
  const [hoveredKey, setHoveredKey] = useState<number | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { selectedMenu } = useSelector((state: RootState) => state.menuReducer);

  /** -------------------------- FUNCTIONS ------------------------------ */

  const handleSuccessNotif = (message: string) => {
    notification.success({
      message: "Success",
      description: message,
      placement: "topRight",
    });
  };

  const handleErrorNotif = (message: string) => {
    notification.error({
      message: "Error",
      description: message,
      placement: "topRight",
    });
  };

  const handleAddMenu = async (newMenu: { name: string; parent: string }) => {
    const result = await dispatch(postMenu(newMenu));
    if (postMenu.fulfilled.match(result)) {
      handleSuccessNotif("Menu has been added successfully!");
    } else if (postMenu.rejected.match(result)) {
      handleErrorNotif(result.error.message || "Failed to fetch user data.");
    }
  };

  const handleDeleteMenu = async (menu: MenuItem) => {
    const result = await dispatch(deleteMenu(menu));
    if (deleteMenu.fulfilled.match(result)) {
      handleSuccessNotif("Menu deleted successfully!");
    } else if (deleteMenu.rejected.match(result)) {
      handleErrorNotif(result.error.message || "Failed to fetch user data.");
    }
  };

  /* ------------------------------ RENDER ------------------------------- */

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      className="px-[6px] py-[2px]"
      onMouseEnter={() => setHoveredKey(Number(nodeData.key))}
      onMouseLeave={() => setHoveredKey(null)}
    >
      <span>{nodeData.title as ReactNode}</span>
      {(hoveredKey === nodeData.key || nodeData.key === selectedMenu?.id) && (
        <>
          <Button
            title="Add Child Menu"
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            style={{
              marginLeft: "12px",
              backgroundColor: "#253BFF",
              border: "none",
              borderRadius: "100%",
            }}
            className="hover:!bg-[#1F34CC]"
            onClick={() => {
              handleAddMenu({
                name: "New Menu",
                parent: String(nodeData.key),
              });
            }}
          />
          <Button
            title="Delete Menu"
            type="primary"
            danger
            size="small"
            icon={<MinusOutlined />}
            style={{
              marginLeft: "12px",
              border: "none",
              borderRadius: "100%",
            }}
            onClick={() => {
              handleDeleteMenu(
                (nodeData as TreeDataNode & { dataRef: MenuItem }).dataRef
              );
            }}
          />
        </>
      )}
    </div>
  );
};

export default TitleRenderer;
