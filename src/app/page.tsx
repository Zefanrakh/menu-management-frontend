"use client";

import { Button } from "antd";
import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <Button>
      <Link href="/menus">Menus</Link>
    </Button>
  );
};

export default Home;
