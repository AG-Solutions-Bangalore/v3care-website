// slices/CartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  service_price_for: string;
  service_price_rate: string;
  service_price_amount: string;
  service_id: string;
  service_name: string;
  service_sub_id?: string;
  service_sub_name?: string;
  service_label?: string;
  service_slug?: string;
  service_sub_slug?: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const CartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (!existingItem) {
        state.items.push(action.payload);
      }
    },
    updateCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});


export const { addToCart, removeFromCart, clearCart ,updateCartItems} = CartSlice.actions;
export default CartSlice.reducer;