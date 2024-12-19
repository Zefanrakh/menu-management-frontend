"use client";

import { setExpandedAll } from "@/state/menu/menuSlice";
import { AppDispatch } from "@/state/store";
import { Button, ConfigProvider } from "antd";
import { useDispatch } from "react-redux";

export const ExpanderButton = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleExpandState = (state: boolean) => {
    dispatch(setExpandedAll(state));
  };

  return (
    <div className="mb-5">
      <ConfigProvider
        theme={{
          components: {
            Button: {
              defaultBg: "#1D2939",
              defaultColor: "white",
              defaultActiveBg: "white",
              defaultActiveColor: "#1D2939",
              defaultHoverBg: "white",
              defaultHoverColor: "#1D2939",
              defaultBorderColor: "#1D2939",
              defaultActiveBorderColor: "#1D2939",
            },
          },
        }}
      >
        <Button
          shape="round"
          size="large"
          className="mr-3"
          onClick={() => handleExpandState(true)}
        >
          Expand All
        </Button>
      </ConfigProvider>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              defaultBg: "white",
              defaultColor: "#1D2939",
              defaultActiveBg: "#1D2939",
              defaultActiveColor: "white",
              defaultHoverBg: "#1D2939",
              defaultHoverColor: "white",
              defaultBorderColor: "#1D2939",
              defaultActiveBorderColor: "#1D2939",
            },
          },
        }}
      >
        <Button
          shape="round"
          size="large"
          onClick={() => handleExpandState(false)}
        >
          Collapse All
        </Button>
      </ConfigProvider>
    </div>
  );
};
