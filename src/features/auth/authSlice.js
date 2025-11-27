import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: (() => {
      try {
        const stored = localStorage.getItem("rms_user");
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    })(),
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("rms_user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
