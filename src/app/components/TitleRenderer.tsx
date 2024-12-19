"use client";

import { postMenu } from "@/state/menu/menuSlice";
import { AppDispatch } from "@/state/store";
import { Button } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";

const TitleRenderer = ({ nodeData }: { nodeData: any }) => {
  /* ------------------------------ HOOKS ------------------------------ */

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  /** -------------------------- FUNCTIONS ------------------------------ */

  const handleAddMenu = (newMenu: { name: string; parent: string }) => {
    dispatch(postMenu(newMenu));
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
      onMouseEnter={() => setHoveredKey(nodeData.key)}
      onMouseLeave={() => setHoveredKey(null)}
    >
      <span>{nodeData.title}</span>
      {hoveredKey === nodeData.key && (
        <Button
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
              parent: nodeData.key,
            });
          }}
        />
      )}
    </div>
  );
};

export default TitleRenderer;
