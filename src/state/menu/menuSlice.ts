import { MenuItem } from "@/type/menuItem";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/lib/axios";

interface MenuState {
  menuTree: MenuItem[];
  status: string;
  rawMenus: MenuItem[];
  selectedMenu?: MenuItem;
  expandedKeys?: number[];
}

const initialState: MenuState = {
  menuTree: [],
  status: "idle",
  rawMenus: [],
  expandedKeys: [],
};

function generateTree(rawMenus: MenuItem[]) {
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

function flattenTree(menuTree: MenuItem[]): MenuItem[] {
  return menuTree.flatMap((menu) => [
    menu,
    ...flattenTree(menu?.children ?? []),
  ]);
}

export const fetchMenus = createAsyncThunk("menus/fetchMenus", async () => {
  const res = await axios.get("/menu");
  return res.data;
});

export const postMenu = createAsyncThunk(
  "menus/postMenu",
  async (
    payload: {
      name: string;
      parent: string;
    },
    thunkAPI
  ) => {
    const res = await axios.post("/menu", payload);
    thunkAPI.dispatch(fetchMenus());
  }
);

export const putMenu = createAsyncThunk(
  "menus/putMenu",
  async (
    payload: {
      id: string;
      name: string;
    },
    thunkAPI
  ) => {
    const res = await axios.put(`/menu/${payload.id}`, payload);
    thunkAPI.dispatch(fetchMenus());
  }
);

const menuSlice = createSlice({
  name: "menus",
  initialState,
  reducers: {
    selectMenu: (state: MenuState, action: PayloadAction<number>) => {
      state.selectedMenu = state.rawMenus.find(
        (menu) => menu.id === action.payload
      );
    },
    setExpandedAll(state: MenuState, action: PayloadAction<boolean>) {
      state.expandedKeys = action.payload
        ? state.rawMenus.map((menu) => menu.id)
        : [];
    },
    setExpandedKeys(state: MenuState, action: PayloadAction<number[]>) {
      state.expandedKeys = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.pending, (state) => {
        console.log("fetchMenus pending");
      })
      .addCase(
        fetchMenus.fulfilled,
        (state, action: PayloadAction<MenuItem[]>) => {
          state.menuTree = generateTree(action.payload);
          state.rawMenus = flattenTree(state.menuTree);
          state.expandedKeys = state.rawMenus.map((menu) => menu.id);
          state.status = "success";
        }
      )
      .addCase(postMenu.pending, (state) => {
        console.log("postMenu pending");
      })
      .addCase(postMenu.fulfilled, (state, action) => {
        state.status = "success";
      })
      .addCase(putMenu.pending, (state) => {
        console.log("putMenu pending");
      })
      .addCase(putMenu.fulfilled, (state, action) => {
        state.status = "success";
      });
  },
});

export const { selectMenu, setExpandedAll, setExpandedKeys } =
  menuSlice.actions;

export default menuSlice.reducer;
