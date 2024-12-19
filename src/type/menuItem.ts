export type MenuItem = {
  id: number;
  name: string;
  depth?: number;
  parent?: number;
  children?: MenuItem[];
};
