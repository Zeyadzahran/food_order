import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

export default function CartPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'ar';
  const navigate = useNavigate();
  const { items, totalPrice, updateQuantity, removeItem, isLoading, fetchCart } = useCartStore();
  const [hasLoadedCart, setHasLoadedCart] = useState(false);

  const deliveryFee = 20;

  useEffect(() => {
    let isMounted = true;

    fetchCart().finally(() => {
      if (isMounted) {
        setHasLoadedCart(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [fetchCart]);

  if (!hasLoadedCart) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-10 w-10 text-primary-500" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-28 h-28 bg-primary-100 rounded-full flex items-center justify-center mb-8 shadow-float">
          <ShoppingBag className="w-14 h-14 text-primary-600" />
        </div>
        <h1 className="heading-lg text-surface-900 mb-4">{t('cart.empty')}</h1>
        <p className="font-body text-surface-500 mb-8 max-w-sm">
          {t('cart.empty_description')}
        </p>
        <Link to="/menu">
          <Button size="lg" className="w-64">
            {t('cart.browse_menu')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-8 max-w-7xl mx-auto w-full">
      <h1 className="heading-xl text-surface-900 mb-8">
        {t('cart.title')}
      </h1>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 flex flex-col gap-6">
          {items.map((item) => {
            const name = item.name[lang] || item.name.en;
            const menuItemData = item.menuItem as any;
            const imageUrl = menuItemData?.imageUrl;

            return (
              <div
                key={item._id}
                className="flex items-center gap-6 rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-sm backdrop-blur-sm"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-surface-100 shrink-0 overflow-hidden">
                  {imageUrl ? (
                    <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-400 text-xs">No Image</div>
                  )}
                </div>

                <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex flex-col justify-center">
                    <h3 className="font-display font-bold text-xl text-surface-900 mb-1">{name}</h3>
                    <p className="font-display font-medium text-primary-600 text-lg">{item.price} EGP</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 rounded-full bg-surface-100 p-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item._id, item.quantity - 1);
                          } else {
                            removeItem(item._id);
                          }
                        }}
                        disabled={isLoading}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-200 disabled:opacity-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-display font-bold text-lg w-8 text-center select-none">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        disabled={isLoading}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-200 disabled:opacity-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="font-display font-extrabold text-lg min-w-[5rem] text-right rtl:text-left hidden sm:block">
                      {item.price * item.quantity} EGP
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem(item._id)}
                      disabled={isLoading}
                      className="p-2 rounded-xl text-surface-400 hover:text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full lg:w-96 shrink-0">
          <div className="rounded-[28px] bg-surface-900 text-white p-7 shadow-card sticky top-28">
            <h2 className="heading-sm mb-6 pb-4 border-b border-white/10">{t('cart.summary_title')}</h2>

            <div className="flex flex-col gap-3 font-body text-base mb-6">
              <div className="flex justify-between items-center text-surface-300">
                <span>{t('cart.subtotal')}</span>
                <span className="font-semibold text-white">{totalPrice} EGP</span>
              </div>
              <div className="flex justify-between items-center text-surface-300">
                <span>{t('cart.delivery')}</span>
                <span className="font-semibold text-white">{deliveryFee} EGP</span>
              </div>
              <div className="border-t border-white/10 pt-4 mt-2 flex justify-between items-center">
                <span className="font-display font-bold text-lg">{t('cart.total')}</span>
                <span className="font-display font-extrabold text-2xl text-primary-300">{totalPrice + deliveryFee} EGP</span>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full mb-3 bg-primary-500 hover:bg-primary-600"
              onClick={() => navigate('/checkout')}
            >
              {t('cart.checkout')}
            </Button>

            <Link to="/menu">
              <Button
                variant="ghost"
                className="w-full text-surface-300 hover:text-white hover:bg-white/10"
              >
                {t('cart.continue_shopping')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
