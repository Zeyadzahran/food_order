import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, Loader2 } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/ui/Button';

export default function OrderSuccessPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const colors = ['#d9652a', '#2f6b5f', '#8f3d1a', '#ffffff'];
    const container = document.getElementById('confetti-container');

    if (container) {
      for (let i = 0; i < 50; i += 1) {
        const confetti = document.createElement('div');
        confetti.className = 'absolute h-3 w-3 animate-confetti rounded-sm';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = '-5%';
        confetti.style.animationDelay = `${Math.random() * 3}s`;
        confetti.style.animationDuration = `${3 + Math.random() * 2}s`;
        container.appendChild(confetti);
      }
    }
  }, []);

  useEffect(() => {
    if (!sessionId || !id) {
      return;
    }

    let isMounted = true;

    const verify = async () => {
      try {
        setIsVerifying(true);
        await api.get(`/orders/${id}/verify-payment`, {
          params: { sessionId },
        });
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || t('cart.payment_verification_failed'));
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [id, sessionId, t]);

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4 py-20">
      <div id="confetti-container" className="pointer-events-none absolute inset-0 z-0 overflow-hidden" />

      <div className="relative z-10 w-full max-w-xl rounded-[34px] border border-white/70 bg-white/90 p-8 text-center shadow-[0_32px_80px_-36px_rgba(34,29,26,0.55)] backdrop-blur-xl md:p-12">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary-500 shadow-float">
          {isVerifying ? (
            <Loader2 className="h-12 w-12 animate-spin text-white" />
          ) : (
            <Check className="h-12 w-12 stroke-[3] text-white" />
          )}
        </div>

        <h1 className="heading-lg mb-3 text-surface-900">{t('orders.success_title')}</h1>

        {isVerifying ? (
          <p className="mb-8 text-lg text-surface-600">{t('cart.payment_verifying')}</p>
        ) : error ? (
          <p className="mb-8 text-lg text-rose-700">{error}</p>
        ) : (
          <>
            <p className="mb-3 text-lg text-surface-600">{t('orders.success_message')}</p>
            {sessionId && (
              <p className="mb-8 text-sm font-medium uppercase tracking-[0.16em] text-accent">
                {t('orders.payment_confirmed')}
              </p>
            )}
          </>
        )}

        <div className="mb-8 inline-flex rounded-full bg-surface-100 px-5 py-3 text-sm text-surface-700">
          {t('orders.order_id')}: <span className="ml-2 font-semibold text-surface-900 rtl:ml-0 rtl:mr-2">{id}</span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link to={`/orders/${id}`} className="flex-1">
            <Button size="lg" className="w-full">
              {t('orders.track_order')}
            </Button>
          </Link>
          <Link to="/menu" className="flex-1">
            <Button variant="secondary" size="lg" className="w-full">
              {t('common.go_home')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
