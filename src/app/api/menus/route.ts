import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { MenuItem } from "@/type/menuItem";

const filePath: string = path.join(process.cwd(), "src/data/menusRaw.json");

const readData = (): any[] => JSON.parse(fs.readFileSync(filePath, "utf-8"));
const writeData = (data: any[]): void =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

export async function GET(): Promise<NextResponse> {
  const rawMenus: MenuItem[] = readData().sort(
    (a, b) => parseInt(a.id) - parseInt(b.id)
  );
  return NextResponse.json(rawMenus);
}

export async function POST(req: Request): Promise<NextResponse> {
  const { parent, name }: { parent: string; name: string } = await req.json();
  const menus = readData().sort((a, b) => parseInt(a.id) - parseInt(b.id));
  const newItem = {
    id: (parseInt(menus[menus.length - 1].id) + 1).toString(),
    name,
    parent,
  };
  menus.push(newItem);
  writeData(menus);
  return NextResponse.json(newItem);
}

export async function PUT(req: Request): Promise<NextResponse> {
  const { id, name }: { id: string; name: string } = await req.json();
  const menus = readData().sort((a, b) => parseInt(a.id) - parseInt(b.id));
  const selectedMenu = menus.find((menu) => menu.id === id);
  selectedMenu.name = name;
  writeData(menus);
  return NextResponse.json(selectedMenu);
}

export async function DELETE(req: Request): Promise<NextResponse> {
  const { id }: { id: string } = await req.json();
  let menus = readData();

  const deleteItem = (items: any[]): any[] =>
    items.filter((item) => {
      if (item.children) item.children = deleteItem(item.children);
      return item.id !== id;
    });

  menus = deleteItem(menus);
  writeData(menus);
  return NextResponse.json({ success: true });
}
