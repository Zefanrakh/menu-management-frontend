import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { MenuItem } from "@/type/menuItem";
import { setRecentlyDeletedMenu } from "./menuSlice";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message: string;
  [key: string]: any; // Jika ada properti lain yang mungkin
}

export const handleError = (error: AxiosError) => {
  const e = error;
  if (e.response && e.response.data) {
    const data = e.response.data as ApiErrorResponse;
    const errorMessage = data.message;
    throw new Error(errorMessage);
  } else {
    const errorMessage = "Something went wrong. Please try again later.";
    throw new Error(errorMessage);
  }
};

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
    try {
      const res = await axios.post("/menu", payload);
      thunkAPI.dispatch(fetchMenus());
      return res.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  }
);

export const putMenu = createAsyncThunk(
  "menus/putMenu",
  async (
    payload: {
      id: number;
      name: string;
    },
    thunkAPI
  ) => {
    try {
      const res = await axios.put(`/menu/${payload.id}`, payload);
      thunkAPI.dispatch(fetchMenus());
      return res.data;
    } catch (error) {
      handleError(error as AxiosError);
    }
  }
);

export const deleteMenu = createAsyncThunk(
  "menus/deleteMenu",
  async (payload: MenuItem, { dispatch }) => {
    try {
      dispatch(setRecentlyDeletedMenu(payload));
      await axios.delete(`/menu/${payload.id}`);
      dispatch(fetchMenus());
    } catch (error) {
      handleError(error as AxiosError);
    }
  }
);
