
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    cartItems: [],
  },

  reducers: {
    // Thêm sản phẩm vào giỏ hàng
    addToCart: (state, action) => {
      const product = action.payload;

      const existingItem = state.cartItems.find(
        (item) =>
          item.id === product.id &&
          item.size === product.size
      );

      if (existingItem) {
        existingItem.quantity += product.quantity;
      } else {
        state.cartItems.push(product);
      }
    },

    // Tăng số lượng
    increaseQuantity: (state, action) => {
      const { id, size } = action.payload;

      const item = state.cartItems.find(
        (item) => item.id === id && item.size === size
      );

      if (item) {
        item.quantity += 1;
      }
    },

    // Giảm số lượng
    decreaseQuantity: (state, action) => {
      const { id, size } = action.payload;

      const item = state.cartItems.find(
        (item) => item.id === id && item.size === size
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    // Xóa sản phẩm
    removeFromCart: (state, action) => {
      const { id, size } = action.payload;

      state.cartItems = state.cartItems.filter(
        (item) =>
          !(item.id === id && item.size === size)
      );
    },

    // Xóa giỏ hàng sau khi đặt hàng thành công
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
