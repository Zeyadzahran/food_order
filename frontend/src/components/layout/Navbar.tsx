import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Menu as MenuIcon, User as UserIcon, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useUiStore } from '../../store/uiStore';
import Button from '../ui/Button';
import { cn } from '../../utils';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuthStore();
  const { totalItems } = useCartStore();
  const { language, setLanguage, isMenuOpen, toggleMenu, closeMenu } = useUiStore();

  const handleLangToggle = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const handleCartClick = () => {
    closeMenu();
    navigate('/cart');
  };

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate('/');
  };

  const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
    cn(
      'font-display font-bold text-lg uppercase tracking-wide transition-colors',
      isActive ? 'text-primary-600' : 'hover:text-primary-500'
    );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-surface-200/80 bg-white/85 shadow-sm backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <span className="font-display font-black text-3xl tracking-tighter text-primary-600 uppercase">
            CRAVE
          </span>
        </Link>

        <div className="hidden md:flex gap-8">
          <NavLink to="/menu" className={navLinkClassName}>
            {t('nav.menu')}
          </NavLink>
          <NavLink to="/orders" className={navLinkClassName}>
            {t('nav.orders')}
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={navLinkClassName}>
              Admin
            </NavLink>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button
            type="button"
            onClick={handleLangToggle}
            className="font-display font-bold text-sm uppercase px-2 py-1 border-2 border-transparent hover:border-surface-900 transition-all"
          >
            {language === 'en' ? 'عربي' : 'EN'}
          </button>

          <button
            type="button"
            onClick={handleCartClick}
            className="relative p-2 hover:bg-surface-200 transition-colors"
            aria-label={t('nav.cart')}
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 rtl:right-auto rtl:left-0 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full transform translate-x-1/4 rtl:-translate-x-1/4 -translate-y-1/4">
                {totalItems}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <Button variant="ghost" onClick={handleLogout} className="gap-2">
              <UserIcon className="w-5 h-5" />
              {t('common.logout')}
            </Button>
          ) : (
            <Link to="/login" onClick={closeMenu}>
              <Button size="sm">{t('nav.login')}</Button>
            </Link>
          )}
        </div>

        <div className="md:hidden flex items-center gap-4">
          <button
            type="button"
            onClick={handleLangToggle}
            className="font-display font-bold text-xs uppercase px-2 py-1 border-2 border-transparent hover:border-surface-900 transition-all mr-2 rtl:mr-0 rtl:ml-2"
          >
            {language === 'en' ? 'عربي' : 'EN'}
          </button>
          <button type="button" onClick={handleCartClick} className="relative p-2" aria-label={t('nav.cart')}>
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 rtl:right-auto rtl:left-0 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full transform translate-x-1/4 rtl:-translate-x-1/4 -translate-y-1/4">
                {totalItems}
              </span>
            )}
          </button>
          <button type="button" onClick={toggleMenu} className="p-2" aria-label="Toggle menu">
            {isMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-surface-200 bg-white/95 px-4 py-4 backdrop-blur-xl">
          <div className="flex flex-col gap-3">
            <Link
              to="/menu"
              onClick={closeMenu}
              className={cn(
                'font-display font-bold uppercase tracking-wide px-1 py-2',
                location.pathname === '/menu' && 'text-primary-600'
              )}
            >
              {t('nav.menu')}
            </Link>
            <Link
              to="/orders"
              onClick={closeMenu}
              className={cn(
                'font-display font-bold uppercase tracking-wide px-1 py-2',
                location.pathname.startsWith('/orders') && 'text-primary-600'
              )}
            >
              {t('nav.orders')}
            </Link>
            <button
              type="button"
              onClick={handleCartClick}
              className="flex items-center justify-between font-display font-bold uppercase tracking-wide px-1 py-2 text-left"
            >
              <span>{t('nav.cart')}</span>
              <span className="text-primary-600">{totalItems}</span>
            </button>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={closeMenu}
                className={cn(
                  'font-display font-bold uppercase tracking-wide px-1 py-2',
                  location.pathname.startsWith('/admin') && 'text-primary-600'
                )}
              >
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <Button variant="ghost" onClick={handleLogout} className="justify-start px-1">
                {t('common.logout')}
              </Button>
            ) : (
              <Link to="/login" onClick={closeMenu}>
                <Button className="w-full">{t('nav.login')}</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
