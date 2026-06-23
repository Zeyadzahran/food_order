import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MapPin, Receipt, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { Order, OrderStatus } from '../../types';


import Button from '../../components/ui/Button';

export default function OrdersPage() {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        if (res.data.success) {
          setOrders(res.data.data.items);
        }
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'confirmed':
      case 'preparing': return 'bg-primary-100 text-primary-800';
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-rose-100 text-rose-800';
      default: return 'bg-surface-100 text-surface-800';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 w-full flex flex-col gap-5">
        <div className="h-10 bg-surface-200 rounded-2xl w-48 mb-6 animate-pulse"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-[24px] bg-white/60 h-40 w-full"></div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-24 h-24 rounded-full bg-surface-100 flex items-center justify-center mb-6">
          <Receipt className="w-12 h-12 text-surface-400" />
        </div>
        <h1 className="heading-md text-surface-900 mb-4">{t('orders.empty')}</h1>
        <Link to="/menu">
          <Button size="lg">{t('menu.browse', 'Browse Menu')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 w-full">
      <h1 className="heading-lg text-surface-900 mb-8">
        {t('orders.title')}
      </h1>

      <div className="flex flex-col gap-5">
        {orders.map((order) => (
          <div key={order._id} className="rounded-[24px] border border-white/70 bg-white/90 shadow-sm backdrop-blur-sm overflow-hidden transition hover:shadow-card">

            <div className="flex flex-col sm:flex-row">
              {/* Left - Date */}
              <div className="bg-surface-50 px-6 py-5 sm:w-48 shrink-0 flex sm:flex-col justify-between sm:justify-center items-center sm:items-start gap-2 border-b sm:border-b-0 sm:border-r border-surface-200/60">
                <div>
                  <span className="font-display font-extrabold text-2xl text-surface-900">
                    {new Date(order.createdAt).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' })}
                  </span>
                  <p className="font-body text-sm text-surface-500">
                    {new Date(order.createdAt).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="font-mono text-xs text-surface-500 bg-surface-100 rounded-full px-3 py-1">
                  #{order._id.slice(-6).toUpperCase()}
                </div>
              </div>

              {/* Right - Details */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <span className={`px-3.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {t(`orders.status.${order.status}`)}
                  </span>
                  <span className="font-display font-extrabold text-xl text-primary-600">{order.totalPrice} EGP</span>
                </div>

                <div className="flex items-center gap-2 text-surface-500 font-body text-sm">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="truncate">{order.deliveryAddress.street}, {order.deliveryAddress.city}</span>
                </div>

                <div className="flex justify-end">
                  <Link to={`/orders/${order._id}`}>
                    <Button variant="secondary" className="group">
                      {t('orders.track_order')}
                      <ArrowRight className="w-4 h-4 ml-2 rtl-flip group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
