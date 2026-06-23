import { create } from 'zustand';
import api from '../services/api';

export interface CartItem {
  _id: string;
  menuItem: { _id: string } | string;
  name: { en: string; ar: string };
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (menuItemId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalPrice: 0,
  totalItems: 0,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/cart');
      if (res.data.success && res.data.data) {
        const cart = res.data.data;
        set({ 
          items: cart.items || [], 
          totalPrice: cart.totalPrice || 0, 
          totalItems: (cart.items || []).reduce((a: number, b: CartItem) => a + b.quantity, 0),
          isLoading: false 
        });
      } else {
        set({ items: [], totalPrice: 0, totalItems: 0, isLoading: false });
      }
    } catch(e) {
      set({ isLoading: false });
    }
  },

  addToCart: async (menuItemId, quantity = 1) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/cart', { menuItemId, quantity });
      if (res.data.success) {
        const cart = res.data.data;
        set({ 
          items: cart.items || [], 
          totalPrice: cart.totalPrice || 0, 
          totalItems: (cart.items || []).reduce((a: number, b: CartItem) => a + b.quantity, 0),
          isLoading: false 
        });
      }
    } catch(e) {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    set({ isLoading: true });
    try {
      const res = await api.patch(`/cart/${itemId}`, { quantity });
      if (res.data.success) {
        const cart = res.data.data;
        set({ 
          items: cart.items || [], 
          totalPrice: cart.totalPrice || 0, 
          totalItems: (cart.items || []).reduce((a: number, b: CartItem) => a + b.quantity, 0),
          isLoading: false 
        });
      }
    } catch(e) {
      set({ isLoading: false });
    }
  },
removeItem: async (itemId) => {
    set({ isLoading: true });
    try {
      const res = await api.delete(`/cart/${itemId}`);
      if (res.data.success) {
        const cart = res.data.data;
        set({ 
          items: cart.items || [], 
          totalPrice: cart.totalPrice || 0, 
          totalItems: (cart.items || []).reduce((a: number, b: CartItem) => a + b.quantity, 0),
          isLoading: false 
        });
      }
    } catch(e) {
      set({ isLoading: false });
    }
  },

  
  clearCart: () => set({ items: [], totalPrice: 0, totalItems: 0 }),
}));
