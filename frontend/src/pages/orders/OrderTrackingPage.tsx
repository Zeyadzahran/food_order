import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, MapPin, CheckCircle, Package, Truck, Home, XCircle, RefreshCw } from 'lucide-react';
import { useOrderTracking } from '../../hooks/useOrderTracking';
import { OrderStatus } from '../../types';
import Spinner from '../../components/ui/Spinner';
import { cn } from '../../utils';
import Button from '../../components/ui/Button';

const STEPS: { status: OrderStatus; icon: any }[] = [
  { status: 'pending', icon: Clock },
  { status: 'confirmed', icon: CheckCircle },
  { status: 'preparing', icon: Package },
  { status: 'out_for_delivery', icon: Truck },
  { status: 'delivered', icon: Home },
];

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'ar';
  const { order, isLoading, error, lastUpdated } = useOrderTracking(id!);

  if (isLoading) {
    return <div className="py-32 flex justify-center"><Spinner className="w-12 h-12 text-primary-500" /></div>;
  }

  if (error || !order) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-center">
        <h1 className="heading-md uppercase text-accent mb-4">Error loading order</h1>
        <p className="font-body text-surface-500 mb-8">{error}</p>
        <Link to="/orders"><Button>Back to Orders</Button></Link>
      </div>
    );
  }

  const isCancelled = order.status === 'cancelled';
  const currentStepIndex = isCancelled ? -1 : STEPS.findIndex(s => s.status === order.status);

  // Time ago logic (simple)
  const secondsAgo = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="heading-lg text-surface-900 mb-2">{t('orders.track_order')}</h1>
          <div className="inline-flex rounded-full bg-surface-100 px-4 py-1.5 font-mono text-sm text-surface-600">
            #{order._id.slice(-8).toUpperCase()}
          </div>
        </div>
        {!['delivered', 'cancelled'].includes(order.status) && (
          <div className="flex items-center gap-2 text-surface-500 font-body text-sm rounded-full bg-surface-100 px-4 py-2">
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
            {t('orders.updated_ago', { seconds: secondsAgo })}
          </div>
        )}
      </div>

      <div className="rounded-[30px] border border-white/70 bg-white/90 p-6 md:p-10 shadow-card backdrop-blur-sm mb-8">

        {/* === STEPPER === */}
        <div className="relative flex flex-col md:flex-row justify-between pt-6 pb-10 mb-8 border-b border-surface-200">

          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[46px] left-[10%] right-[10%] h-1 rounded-full bg-surface-200 z-0">
            {currentStepIndex > 0 && !isCancelled && (
              <div
                className="absolute top-0 left-0 h-full rounded-full bg-primary-500 transition-all duration-1000 ease-in-out"
                style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
              />
            )}
          </div>

          {/* Connector Line (Mobile) */}
          <div className="block md:hidden absolute left-[28px] rtl:left-auto rtl:right-[28px] top-12 bottom-12 w-1 rounded-full bg-surface-200 z-0">
             {currentStepIndex > 0 && !isCancelled && (
              <div
                className="absolute top-0 left-0 w-full rounded-full bg-primary-500 transition-all duration-1000 ease-in-out"
                style={{ height: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
              />
            )}
          </div>

          {STEPS.map((step, index) => {
            const isCompleted = currentStepIndex > index;
            const isCurrent = currentStepIndex === index;
            const isFuture = currentStepIndex < index;

            const Icon = step.icon;

            return (
              <div key={step.status} className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 mb-6 md:mb-0 w-full md:w-auto">
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500 shrink-0",
                  isCompleted && "bg-primary-600 border-primary-600 text-white shadow-float",
                  isCurrent && "bg-primary-500 border-primary-500 text-white shadow-float animate-pulse",
                  isFuture && "border-surface-300 text-surface-400 bg-white",
                  isCancelled && isFuture && "border-surface-200 text-surface-300 opacity-50"
                )}>
                  <Icon className="w-6 h-6" />
                </div>

                <div className="text-left md:text-center w-full">
                  <h3 className={cn(
                    "font-display font-semibold text-sm",
                    (isCompleted || isCurrent) ? "text-surface-900" : "text-surface-400"
                  )}>
                    {t(`orders.status.${step.status}`)}
                  </h3>

                  <div className="h-4 mt-0.5 font-body text-xs text-surface-400">
                    {(isCompleted || isCurrent) && order.statusHistory.find(h => h.status === step.status)?.timestamp ? (
                      new Date(order.statusHistory.find(h => h.status === step.status)!.timestamp).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })
                    ) : ''}
                  </div>
                </div>
              </div>
            );
          })}

          {isCancelled && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl">
              <div className="bg-rose-500 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-card">
                <XCircle className="w-8 h-8" />
                <span className="font-display font-bold text-xl">{t('orders.status.cancelled')}</span>
              </div>
            </div>
          )}
        </div>

        {/* === ORDER DETAILS === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Items */}
          <div>
            <h2 className="heading-sm text-surface-900 mb-4">
              {t('orders.items')}
            </h2>
            <div className="space-y-3 font-body">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center rounded-2xl bg-surface-50 p-3.5 transition-colors hover:bg-surface-100">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary-500 text-white font-semibold px-2.5 py-0.5 rounded-lg text-sm">{item.quantity}x</span>
                    <span className="font-medium text-surface-900">{item.name[lang] || item.name.en}</span>
                  </div>
                  <span className="font-semibold text-surface-600">{item.price} EGP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-[24px] bg-surface-900 text-white p-6 shadow-card">
            <h2 className="heading-sm mb-5 text-surface-200">
              {t('orders.details')}
            </h2>

            <div className="space-y-4 font-body text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-surface-400">{t('orders.payment')}</span>
                <span className="font-medium">{t(`orders.payment_method.${order.paymentMethod}`, order.paymentMethod.replace('_', ' '))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-surface-400">{t('orders.status_label', 'Status')}</span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold",
                  order.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                )}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-4">
                <span className="text-surface-400 flex items-center gap-2"><MapPin className="w-4 h-4"/>{t('orders.delivery_to', 'Deliver to')}</span>
                <div className="text-right max-w-[160px]">
                  <p className="font-medium">{order.deliveryAddress.street}</p>
                  <p className="text-surface-400 text-xs">{order.deliveryAddress.city}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 flex justify-between items-center">
              <span className="font-display font-bold text-lg">{t('orders.total')}</span>
              <span className="font-display font-extrabold text-2xl text-primary-300">{order.totalPrice + 20} EGP</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
