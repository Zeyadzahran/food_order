import { create } from 'zustand';

const getInitialLanguage = (): 'en' | 'ar' => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  return localStorage.getItem('appLang') === 'ar' ? 'ar' : 'en';
};

interface UiState {
  language: 'en' | 'ar';
  isMenuOpen: boolean;
  setLanguage: (lang: 'en' | 'ar') => void;
  toggleMenu: () => void;
  closeMenu: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  language: getInitialLanguage(),
  isMenuOpen: false,
  setLanguage: (lang) => set({ language: lang }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  closeMenu: () => set({ isMenuOpen: false }),
}));
