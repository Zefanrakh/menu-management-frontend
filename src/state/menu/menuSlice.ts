import { MenuItem } from "@/type/menuItem";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generateTree } from "@/shared/utils/generateTree";
import { flattenTree } from "@/shared/utils/flattenTree";
import { deleteMenu, fetchMenus, postMenu, putMenu } from "./asyncThunk";

export interface MenuState {
  menuTree: MenuItem[];
  status: string;
  rawMenus: MenuItem[];
  selectedMenu?: MenuItem;
  expandedKeys?: number[];
  newlyAddedMenu?: MenuItem;
  recentlyDeletedMenu?: MenuItem;
}

const initialState: MenuState = {
  menuTree: [],
  status: "idle",
  rawMenus: [],
  expandedKeys: [],
};

/* ------------------------------ SLICE -------------------------------- */

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
    setRecentlyDeletedMenu(state: MenuState, action: PayloadAction<MenuItem>) {
      state.recentlyDeletedMenu = action.payload;
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
          if (state.newlyAddedMenu) {
            state.selectedMenu = state.rawMenus.find(
              (menu) => menu.id === state.newlyAddedMenu?.id
            );
            state.newlyAddedMenu = undefined;
          }
        }
      )
      .addCase(postMenu.pending, (state) => {
        console.log("postMenu pending");
      })
      .addCase(postMenu.fulfilled, (state, action: PayloadAction<MenuItem>) => {
        state.newlyAddedMenu = action.payload;
        state.status = "success";
      })
      .addCase(putMenu.pending, (state) => {
        console.log("putMenu pending");
      })
      .addCase(putMenu.fulfilled, (state, action) => {
        state.status = "success";
      })
      .addCase(deleteMenu.pending, (state) => {
        console.log("deleteMenu pending");
      })
      .addCase(deleteMenu.fulfilled, (state, action) => {
        const { recentlyDeletedMenu } = state;
        const selectedMenuCandidates = state.rawMenus.filter((menu) => {
          let isSameParent = menu.parent === recentlyDeletedMenu?.parent;
          let idIsBeforeDeletedMenuId =
            recentlyDeletedMenu?.id && menu.id < recentlyDeletedMenu.id;
          return idIsBeforeDeletedMenuId && isSameParent;
        });
        if (selectedMenuCandidates.length) {
          state.selectedMenu =
            selectedMenuCandidates[selectedMenuCandidates.length - 1];
        } else if (recentlyDeletedMenu?.parent) {
          state.selectedMenu = state.rawMenus.find(
            (menu) => menu.id === recentlyDeletedMenu.parent
          );
        }
        state.status = "success";
      });
  },
});

export const {
  selectMenu,
  setExpandedAll,
  setExpandedKeys,
  setRecentlyDeletedMenu,
} = menuSlice.actions;

export default menuSlice.reducer;
