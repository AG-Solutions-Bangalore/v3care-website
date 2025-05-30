// Store.ts
import { configureStore } from "@reduxjs/toolkit";
import CartSlice from "./slices/CartSlice";

const Store = configureStore({
  reducer: {
    cart: CartSlice
  },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export default Store;