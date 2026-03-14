import { configureStore } from "@reduxjs/toolkit";
import { api } from "@/src/shared/store/apiSlices/apiClient";
import authReducer from "./slices/auth-slice";
import groupReducer from "./slices/group-slice";
import userInfoReducer from "./slices/user-slice";
import expenseReducer from "./slices/expense-slice";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";

import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  auth: authReducer,
  userInfo: userInfoReducer,
  group: groupReducer,
  expense: expenseReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "group", "userInfo", "expense"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
