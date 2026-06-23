import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { MenuItem } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import Badge from './Badge';
import Button from './Button';
import { cn, getMenuItemPlaceholder } from '../../utils';

interface Props {
  item: MenuItem;
}

export default function MenuItemCard({ item }: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'ar';
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items: cartItems, addToCart, updateQuantity, isLoading: isCartLoading } = useCartStore();

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [imageFailed, setImageFailed] = useState(false);

  const name = item.name[lang] || item.name.en;
  const description = item.description[lang] || item.description.en;
  const categoryName = item.category?.name[lang] || item.category?.name.en;

  const cartItem = cartItems.find((ci) => {
    const ciMenuId = typeof ci.menuItem === 'object' ? (ci.menuItem as { _id?: string })._id : ci.menuItem;
    return ciMenuId === item._id;
  });

  useEffect(() => {
    if (cartItem) {
      setSelectedQuantity(cartItem.quantity);
    }
  }, [cartItem]);

  const fallbackImage = useMemo(
    () => getMenuItemPlaceholder(item.name.en || name, item.category?.name?.en || categoryName),
    [categoryName, item.category?.name?.en, item.name.en, name]
  );

  const imageSrc = !imageFailed && item.imageUrl ? item.imageUrl : fallbackImage;

  const openQuantityPicker = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/menu' } } });
      return;
    }

    setSelectedQuantity(cartItem?.quantity || 1);
    setIsPickerOpen(true);
  };

  const handleConfirm = async () => {
    if (cartItem) {
      await updateQuantity(cartItem._id, selectedQuantity);
    } else {
      await addToCart(item._id, selectedQuantity);
    }

    setIsPickerOpen(false);
  };

  return (
    <>
      <article
        className={cn(
          'group flex h-full flex-col overflow-hidden rounded-[30px] border border-white/70 bg-white/90 shadow-card backdrop-blur-sm transition duration-300',
          item.isAvailable && 'hover:-translate-y-1 hover:shadow-float'
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-100">
          <img
            src={imageSrc}
            alt={name}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface-900/50 via-surface-900/10 to-transparent" />

          {categoryName && (
            <div className="absolute left-4 top-4 rtl:left-auto rtl:right-4">
              <Badge variant="surface">{categoryName}</Badge>
            </div>
          )}

          {cartItem && item.isAvailable && (
            <div className="absolute right-4 top-4 rtl:right-auto rtl:left-4">
              <Badge variant="accent">
                {t('menu.in_cart')} x{cartItem.quantity}
              </Badge>
            </div>
          )}

          {!item.isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-900/60 backdrop-blur-sm">
              <span className="rounded-full bg-white px-4 py-2 font-display text-sm font-semibold text-surface-900">
                {t('menu.unavailable')}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="mb-4 space-y-2">
            <h3 className="font-display text-2xl font-bold text-surface-900">{name}</h3>
            <p className="line-clamp-2 text-sm leading-6 text-surface-600">{description}</p>
          </div>

          <div className="mt-auto space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div className="flex items-end gap-2">
                <span className="font-display text-3xl font-extrabold text-surface-900">{item.price}</span>
                <span className="pb-1 text-sm font-medium uppercase tracking-[0.18em] text-surface-500">EGP</span>
              </div>
              {cartItem && (
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="text-sm font-medium text-accent hover:text-accent-hover"
                >
                  {t('menu.view_cart')}
                </button>
              )}
            </div>

            {item.isAvailable && (
              <Button
                onClick={openQuantityPicker}
                size="md"
                className="w-full justify-center"
                disabled={isCartLoading}
              >
                <ShoppingBag className="mr-2 h-4 w-4 rtl-flip:ml-2" />
                {cartItem ? t('menu.update_cart') : t('menu.add_to_cart')}
              </Button>
            )}
          </div>
        </div>
      </article>

      {isPickerOpen && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-surface-900/45 p-4 backdrop-blur-sm sm:items-center">
          <div className="animate-fade-in-up w-full max-w-md rounded-[32px] border border-white/70 bg-surface-50 p-6 shadow-[0_30px_80px_-30px_rgba(34,29,26,0.55)]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
                  {categoryName}
                </p>
                <h3 className="font-display text-2xl font-bold text-surface-900">{name}</h3>
                <p className="mt-2 text-sm leading-6 text-surface-600">{description}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="rounded-full bg-white p-2 text-surface-500 shadow-sm hover:text-surface-900"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-6 rounded-[24px] bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-surface-600">{t('menu.quantity')}</span>
                <span className="font-display text-lg font-bold text-surface-900">
                  {selectedQuantity * item.price} EGP
                </span>
              </div>

              <div className="flex items-center justify-between rounded-[20px] border border-surface-200 bg-surface-50 p-2">
                <button
                  type="button"
                  onClick={() => setSelectedQuantity((value) => Math.max(1, value - 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-surface-700 shadow-sm transition hover:bg-surface-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-display text-3xl font-bold text-surface-900">{selectedQuantity}</span>
                <button
                  type="button"
                  onClick={() => setSelectedQuantity((value) => value + 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-surface-700 shadow-sm transition hover:bg-surface-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setIsPickerOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button className="flex-1" onClick={handleConfirm} isLoading={isCartLoading}>
                {cartItem ? t('menu.confirm_update') : t('menu.confirm_add')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
