import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { useMenu } from '../../hooks/useMenu';
import MenuItemCard from '../../components/ui/MenuItemCard';
import Skeleton from '../../components/ui/Skeleton';
import { cn } from '../../utils';

export default function MenuPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'ar';
  const { items, categories, isLoading, selectedCategory, searchQuery, setCategory, setSearch } = useMenu();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex flex-col gap-8 pb-8">
      <section className="relative overflow-hidden rounded-[36px] border border-white/60 bg-surface-900 px-5 py-14 text-center shadow-card sm:px-8 lg:px-12">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-[radial-gradient(circle_at_top_left,_rgba(217,101,42,0.32),_transparent_52%)]" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_bottom_right,_rgba(47,107,95,0.28),_transparent_46%)]" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-primary-100">
            Crave Signature Menu
          </span>
          <h1 className="heading-xl mb-5 text-white">
            {t('menu.hero_title')}
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-surface-200 sm:text-xl">
            {t('menu.hero_subtitle')}
          </p>

          <div className="group relative mx-auto flex max-w-2xl items-center">
            <Search className="absolute left-5 h-5 w-5 text-surface-400 transition-colors group-focus-within:text-primary-300 rtl:left-auto rtl:right-5" />
            <input
              type="text"
              placeholder={t('menu.search_placeholder')}
              value={searchQuery}
              onChange={handleSearchChange}
              className="h-16 w-full rounded-full border border-white/10 bg-white/8 pl-14 pr-5 text-base text-white placeholder:text-surface-400 focus:border-primary-200 focus:bg-white/12 focus:outline-none rtl:pl-5 rtl:pr-14 sm:text-lg"
            />
          </div>
        </div>
      </section>

      <div className="sticky top-[5rem] z-40 rounded-[28px] border border-white/70 bg-white/85 px-3 py-3 shadow-sm backdrop-blur-xl">
        <div className="flex gap-3 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <button
            onClick={() => setCategory(null)}
            className={cn(
              'rounded-full px-5 py-2.5 font-display text-sm font-semibold transition',
              selectedCategory === null
                ? 'bg-primary-500 text-white shadow-float'
                : 'bg-surface-50 text-surface-700 hover:bg-white'
            )}
          >
            {t('menu.all_categories')}
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setCategory(cat._id)}
              className={cn(
                'shrink-0 rounded-full px-5 py-2.5 font-display text-sm font-semibold transition',
                selectedCategory === cat._id
                  ? 'bg-primary-500 text-white shadow-float'
                  : 'bg-surface-50 text-surface-700 hover:bg-white'
              )}
            >
              {cat.name[lang] || cat.name.en}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[50vh]">
        {isLoading && items.length === 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} variant="card" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <MenuItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-6xl mb-4 grayscale opacity-80">🍽️</span>
            <h3 className="heading-md text-surface-900 mb-2 uppercase">{t('menu.unavailable')}</h3>
            <p className="font-body text-surface-500 max-w-sm mx-auto">
              {t('menu.empty_state')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
