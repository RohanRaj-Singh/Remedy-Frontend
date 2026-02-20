import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import { baseApi } from "@/redux/api/baseApi";
import authReducer from "@/redux/api/slice/authSlice";
import surveyReducer from "@/redux/api/slice/surveySlice";
import uiReducer from "@/redux/api/slice/uiSlice";

// Step 1: Combine all reducers
const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  ui: uiReducer,
  survey: surveyReducer,
  auth: authReducer,
});

// Step 2: Configure persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["ui", "survey"], // add "survey" if you want to persist survey state
};

// Step 3: Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Step 4: Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

// Step 5: Create persistor
export const persistor = persistStore(store);

// Step 6: Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
