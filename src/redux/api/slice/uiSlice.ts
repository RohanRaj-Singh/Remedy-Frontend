import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  theme: "light" | "dark";
  language: "Arabic" | "English" | "Bangla" | "ar" | "en" | "bn";
}

const initialState: UiState = {
  theme: "light",
  language: "English",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    toggleLanguage: (state) => {
      state.language = state.language === "English" ? "Arabic" : "English";
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    setLanguage: (
      state,
      action: PayloadAction<"Arabic" | "English" | "Bangla" | "ar" | "en" | "bn">,
    ) => {
      state.language = action.payload;
    },
  },
});

export const { toggleTheme, toggleLanguage, setTheme, setLanguage } = uiSlice.actions;
export default uiSlice.reducer;
