import { MenuItem } from "@/type/menuItem";

export function generateTree(rawMenus: MenuItem[]) {
  let insertedIds: number[] = [];

  const parentMenus = rawMenus.filter((parent) => !parent.parent);

  function getTree(menus: MenuItem[], depth = 1): MenuItem[] {
    let branches = [];
    for (const menu of menus) {
      if (insertedIds.includes(menu.id)) {
        continue;
      } else {
        insertedIds.push(menu.id);
        const children = rawMenus.filter((m) => m.parent === menu.id);
        menu.depth = depth;
        menu.children = getTree(children, depth + 1);
        branches.push(menu);
      }
    }
    return branches;
  }

  return getTree(parentMenus);
}
