import { create } from 'zustand';
import api from '../services/api';
import { MenuItem, Category } from '../types';

interface MenuState {
  items: MenuItem[];
  categories: Category[];
  selectedCategory: string | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  fetchMenu: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  setCategory: (id: string | null) => void;
  setSearch: (query: string) => void;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  items: [],
  categories: [],
  selectedCategory: null,
  searchQuery: '',
  isLoading: false,
  error: null,
  
  setCategory: (id) => set({ selectedCategory: id }),
  setSearch: (query) => set({ searchQuery: query }),

  fetchCategories: async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        set({ categories: res.data.data });
      }
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
    }
  },

  fetchMenu: async () => {
    set({ isLoading: true, error: null });
    try {
      const { selectedCategory, searchQuery } = get();
      const params: Record<string, string> = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      
      const res = await api.get('/menu', { params });
      if (res.data.success) {
        set({ items: res.data.data.items || [], isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch menu', isLoading: false });
    }
  }
}));
