import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Tags, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

import { cn } from '../../utils';

import OverviewPage from './OverviewPage';
import ProductsPage from './ProductsPage';
import OrdersPage from './OrdersPage';
import CategoriesPage from './CategoriesPage';

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)] -my-8 mx-[-1rem] sm:mx-[-1.5rem] lg:mx-[-2rem] bg-surface-100">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-surface-900 border-r-4 border-surface-900 shadow-solid shrink-0 z-10 text-white">
        <div className="p-6 border-b-2 border-surface-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center font-display font-black text-xl uppercase border-2 border-surface-900 shadow-solid">
              {user?.name.charAt(0)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-display font-bold truncate">{user?.name}</span>
              <span className="font-body text-xs text-primary-300">Admin</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 font-display font-bold uppercase tracking-wider text-sm transition-all",
                  isActive ? "bg-primary-500 text-white shadow-solid translate-x-2" : "text-surface-400 hover:text-white hover:bg-surface-800"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full font-display font-bold uppercase tracking-wider text-sm text-accent hover:bg-accent/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar (Mobile only) */}
        <header className="md:hidden bg-surface-900 text-white p-4 border-b-4 border-surface-900 flex justify-between items-center z-10 sticky top-0">
          <span className="font-display font-bold truncate">Admin: {user?.name}</span>
          <button onClick={handleLogout} className="text-accent"><LogOut className="w-6 h-6" /></button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-900 border-t-4 border-surface-900 z-50 flex justify-around p-2 pb-safe shadow-[0_-4px_0_0_rgba(24,24,27,1)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full p-2 transition-colors",
                isActive ? "text-primary-400" : "text-surface-500"
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="font-display font-bold text-[10px] uppercase">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  );
}
