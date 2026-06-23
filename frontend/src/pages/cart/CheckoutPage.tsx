import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CreditCard, Banknote, MapPin, Truck, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import api from '../../services/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { cn } from '../../utils';

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'ar';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, totalPrice, fetchCart, clearCart } = useCartStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [hasLoadedCart, setHasLoadedCart] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash_on_delivery'>('online');

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

  useEffect(() => {
    if (searchParams.get('payment') === 'cancelled') {
      setError(t('cart.payment_cancelled'));
    }
  }, [searchParams, t]);

  useEffect(() => {
    if (hasLoadedCart && items.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [hasLoadedCart, items.length, navigate]);

  const handleNextStep = () => {
    if (!address.street || !address.city || !address.phone) {
      setError(t('cart.address_required'));
      return;
    }

    setError('');
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      if (paymentMethod === 'online') {
        const sessionRes = await api.post('/orders/checkout-session', {
          deliveryAddress: address,
        });

        if (sessionRes.data.success && sessionRes.data.data.checkoutUrl) {
          window.location.assign(sessionRes.data.data.checkoutUrl);
          return;
        }
      }

      const res = await api.post('/orders', {
        paymentMethod,
        deliveryAddress: address,
      });

      if (res.data.success) {
        clearCart();
        navigate(`/orders/success/${res.data.data._id}`, { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('cart.order_failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasLoadedCart) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-10 w-10 text-primary-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl py-8">
      <div className="mb-8 max-w-2xl">
        <h1 className="heading-xl mb-3 text-surface-900">{t('cart.checkout_title')}</h1>
        <p className="text-base leading-7 text-surface-600">
          Finalize your delivery details, choose how you want to pay, and we will take care of the rest.
        </p>
      </div>

      {error && (
        <div className="mb-8 rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700 shadow-sm">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-card">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-600">Step 1</p>
                <h2 className="heading-sm text-surface-900">{t('cart.delivery_details')}</h2>
              </div>
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm font-medium text-accent hover:text-accent-hover"
                >
                  {t('common.edit')}
                </button>
              )}
            </div>

            <div className="space-y-5">
              <Input
                label={t('cart.street_address')}
                placeholder="123 Main St, Apt 4"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                disabled={step !== 1}
                className="rounded-2xl border-surface-200 bg-surface-50"
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label={t('cart.city')}
                  placeholder="Cairo"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  disabled={step !== 1}
                  className="rounded-2xl border-surface-200 bg-surface-50"
                />
                <Input
                  label={t('cart.phone_number')}
                  placeholder="01000000000"
                  type="tel"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  disabled={step !== 1}
                  className="rounded-2xl border-surface-200 bg-surface-50"
                />
              </div>

              {step === 1 && (
                <Button size="lg" className="w-full" onClick={handleNextStep}>
                  {t('cart.continue_to_payment')}
                </Button>
              )}
            </div>
          </section>

          {step === 2 && (
            <section className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-card">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Step 2</p>
                  <h2 className="heading-sm text-surface-900">{t('cart.payment_method')}</h2>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('online')}
                  className={cn(
                    'rounded-[26px] border p-5 text-left transition',
                    paymentMethod === 'online'
                      ? 'border-primary-300 bg-primary-50 shadow-float'
                      : 'border-surface-200 bg-surface-50 hover:border-primary-200'
                  )}
                >
                  <CreditCard className={cn('mb-4 h-8 w-8', paymentMethod === 'online' ? 'text-primary-600' : 'text-surface-500')} />
                  <div className="mb-2 font-display text-xl font-bold text-surface-900">{t('cart.pay_now')}</div>
                  <p className="text-sm leading-6 text-surface-600">{t('cart.secure_gateway')}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={cn(
                    'rounded-[26px] border p-5 text-left transition',
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-primary-300 bg-primary-50 shadow-float'
                      : 'border-surface-200 bg-surface-50 hover:border-primary-200'
                  )}
                >
                  <Banknote className={cn('mb-4 h-8 w-8', paymentMethod === 'cash_on_delivery' ? 'text-primary-600' : 'text-surface-500')} />
                  <div className="mb-2 font-display text-xl font-bold text-surface-900">
                    {t('orders.payment_method.cash_on_delivery')}
                  </div>
                  <p className="text-sm leading-6 text-surface-600">{t('cart.pay_on_arrival')}</p>
                </button>
              </div>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="overflow-hidden rounded-[32px] border border-surface-900 bg-surface-900 text-white shadow-[0_28px_60px_-30px_rgba(34,29,26,0.7)]">
            <div className="border-b border-white/10 px-6 py-5">
              <h3 className="heading-sm">{t('cart.summary_title')}</h3>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item._id} className="flex items-start justify-between gap-3">
                    <div className="text-sm leading-6 text-surface-200">
                      <span className="font-semibold text-white">{item.quantity}x</span>{' '}
                      {item.name[lang] || item.name.en}
                    </div>
                    <div className="font-semibold text-white">{item.price * item.quantity} EGP</div>
                  </div>
                ))}
              </div>

              <div className="rounded-[24px] bg-white/6 p-4">
                <div className="mb-2 flex justify-between text-sm text-surface-200">
                  <span>{t('cart.subtotal')}</span>
                  <span>{totalPrice} EGP</span>
                </div>
                <div className="flex justify-between text-sm text-surface-200">
                  <span>{t('cart.delivery')}</span>
                  <span>{deliveryFee} EGP</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-display text-lg font-bold">{t('cart.total')}</span>
                  <span className="font-display text-2xl font-extrabold text-primary-300">{totalPrice + deliveryFee} EGP</span>
                </div>
              </div>

              {paymentMethod === 'online' && (
                <div className="flex items-start gap-3 rounded-[24px] bg-accent/15 p-4 text-sm text-primary-50">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary-200" />
                  <p>{t('cart.payment_redirecting')}</p>
                </div>
              )}

              <Button
                size="lg"
                className="w-full bg-primary-500 hover:bg-primary-600"
                onClick={handlePlaceOrder}
                disabled={step !== 2 || isSubmitting}
                isLoading={isSubmitting}
              >
                <Truck className="mr-2 h-5 w-5 rtl-flip:ml-2" />
                {t('cart.place_order')}
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
