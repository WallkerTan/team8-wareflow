import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./slice";

export const Store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
