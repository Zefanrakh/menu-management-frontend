import { MenuItem } from "@/type/menuItem";

export function flattenTree(menuTree: MenuItem[]): MenuItem[] {
  return menuTree.flatMap((menu) => [
    menu,
    ...flattenTree(menu?.children ?? []),
  ]);
}
