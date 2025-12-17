import { User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

let access_token = null
let refresh_token = null
let user = null

access_token = Cookies.get("auth_token");
refresh_token = Cookies.get("refresh_token");
user = (() => {
  let stored = null;
  if (typeof window !== "undefined" && window.localStorage) {
    stored = window.localStorage.getItem("user_data");
  }
  try {
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
})();

interface AuthState {
  access_token: string | null;
  refresh_token: string | null;
  user: User;
  token: string;
}

const initialState: AuthState = {
  access_token: access_token ?? null,
  refresh_token: refresh_token ?? null,
  user: user ?? null,
  token: ""
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state :any, action: PayloadAction<any>) => {
      Cookies.set("auth_token", action.payload.access_token);
      Cookies.set("refresh_token", action.payload.refresh_token);
      localStorage.setItem("user_data", JSON.stringify(action.payload.user))
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.user = action.payload.user;
      state.token = action.payload.token
      
    },
    updateUser: (state:any, action: PayloadAction<any>) => {
      localStorage.setItem("user", JSON.stringify({ ...state.user, ...action.payload.user }))
      state.user = { ...state.user, ...action.payload.user };
    },
    updateToken: (state:any, action: PayloadAction<any>) => {
      state.token = action.payload
    },
    logout: (state:any) => {
      Cookies.remove("auth_token");
      Cookies.remove("refresh_token");
      localStorage.remove("user_data");
      state.access_token = "";
      state.refresh_token = "";
      state.user = "";
      state.token = ""
    },
  }
});
export const { login, updateUser, logout, updateToken } = authSlice.actions;

export default authSlice.reducer;