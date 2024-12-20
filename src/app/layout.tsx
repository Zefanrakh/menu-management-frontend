"use client";

import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, Layout } from "antd";
import "./global.css";
import { Provider } from "react-redux";
import { store } from "@/state/store";
import { Sidebar } from "./components/Sidebar";

const { Content } = Layout;

const RootLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <html lang="en">
      <body className="p-[10px]">
        <App>
          <Provider store={store}>
            <AntdRegistry>
              <Layout
                className="!overflow-hidden"
                style={{
                  overflow: "hidden",
                  width: "calc(100% - 8px)",
                  maxWidth: "calc(100% - 8px)",
                  minHeight: "100vh",
                }}
              >
                <Sidebar />
                <Layout>
                  <Content className="p-4">{children}</Content>
                </Layout>
              </Layout>
            </AntdRegistry>
          </Provider>
        </App>
      </body>
    </html>
  );
};
export default RootLayout;
