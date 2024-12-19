import { Button, Col, ConfigProvider, Row } from "antd";
import TreeMenu from "../components/TreeMenu";
import { ExpanderButton } from "../components/ExpanderButton";

export default function MenusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Row gutter={[16, 16]} style={{ padding: "16px" }}>
      <Col
        xs={24}
        md={12}
        style={{ padding: "16px", borderRight: "1px solid #e0e0e0" }}
      >
        <ExpanderButton />
        <TreeMenu />
      </Col>
      <Col xs={24} md={12} style={{ padding: "16px" }}>
        <main className="flex-1 p-4">{children}</main>
      </Col>
    </Row>
  );
}
