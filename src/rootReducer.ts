import { combineReducers } from "@reduxjs/toolkit";
import uiReducer from "@/redux/api/slice/uiSlice";
import { baseApi } from "@/redux/api/baseApi";

const rootReducer = combineReducers({
  ui: uiReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
