"use client";

import React, { useEffect } from "react";
import { Button, Form, Input } from "antd";
import { MenuItem } from "@/type/menuItem";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { putMenu, selectMenu } from "@/state/menu/menuSlice";

const MenuForm: React.FC = () => {
  /* ----------------------------- HOOK -------------------------------- */

  const [form] = Form.useForm<MenuItem>();
  const { menuId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedMenu, rawMenus } = useSelector(
    (state: RootState) => state.menuReducer
  );

  useEffect(() => {
    dispatch(selectMenu(Number(menuId)));
  }, [menuId, rawMenus]);

  useEffect((): void => {
    form.setFieldsValue({
      id: selectedMenu?.id,
      name: selectedMenu?.name,
      depth: selectedMenu?.depth,
      parent: selectedMenu?.parent,
    });
  }, [form, selectedMenu]);

  /* ---------------------------- FUNCTION ------------------------------- */

  const onFinish = (values: any) => {
    dispatch(putMenu(values));
  };

  /* ------------------------------ RENDER ------------------------------- */

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <Form
        form={form}
        name="basic"
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item label="Menu ID" name="id">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Depth" name="depth">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Parent Data" name="parent">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MenuForm;