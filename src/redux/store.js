
import { configureStore } from "@reduxjs/toolkit";

import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import profileReducer from "./slices/profileSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
    profile: profileReducer,
  },
});
