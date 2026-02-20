import { createSlice } from "@reduxjs/toolkit";

const getFromLocalStorage = (key: string) => {
  if (!key || typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(key);
};

function getInitialToken() {
  const token = getFromLocalStorage("token") || null;

  return token;
}

const initialState = {
  token: getInitialToken(),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem("token");

      if (typeof window !== undefined) {
        window.location.href = "/login";
      }
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
