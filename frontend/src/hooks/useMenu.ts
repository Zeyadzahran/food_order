import { useEffect } from 'react';
import { useMenuStore } from '../store/menuStore';

export function useMenu() {
  const store = useMenuStore();
  const { fetchMenu, fetchCategories, selectedCategory, searchQuery } = store;

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMenu();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchMenu, selectedCategory, searchQuery]);

  return store;
}
