import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Order, OrderStatus } from '../../types';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';

const STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/admin/orders?limit=100${filter !== 'all' ? `&status=${filter}` : ''}`);
      if (res.data.success) {
        setOrders(res.data.data.items);
      }
    } catch (err) {
      console.error('Error fetching admin orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  const advanceStatus = async (orderId: string, currentStatus: OrderStatus) => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex === STATUS_FLOW.length - 1) return;
    
    const nextStatus = STATUS_FLOW[currentIndex + 1];
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: nextStatus });
      fetchOrders(); // Refetch directly
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (confirm('Cancel this order?')) {
      try {
        await api.patch(`/admin/orders/${orderId}/status`, { status: 'cancelled' });
        fetchOrders();
      } catch (err) {
        alert('Failed to drop order');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 md:pb-0">
      <h1 className="heading-lg uppercase mb-8 border-b-4 border-primary-500 pb-2 inline-block">Orders</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
        <Button size="sm" variant={filter === 'all' ? 'primary' : 'secondary'} onClick={() => { setIsLoading(true); setFilter('all'); }}>All</Button>
        <Button size="sm" variant={filter === 'pending' ? 'primary' : 'secondary'} onClick={() => { setIsLoading(true); setFilter('pending'); }}>Pending</Button>
        <Button size="sm" variant={filter === 'confirmed' ? 'primary' : 'secondary'} onClick={() => { setIsLoading(true); setFilter('confirmed'); }}>Confirmed</Button>
        <Button size="sm" variant={filter === 'preparing' ? 'primary' : 'secondary'} onClick={() => { setIsLoading(true); setFilter('preparing'); }}>Preparing</Button>
        <Button size="sm" variant={filter === 'out_for_delivery' ? 'primary' : 'secondary'} onClick={() => { setIsLoading(true); setFilter('out_for_delivery'); }}>Out for Delivery</Button>
      </div>

      <div className="bg-white border-4 border-surface-900 shadow-solid overflow-x-auto">
        <table className="w-full text-left font-body">
          <thead className="bg-surface-900 text-white font-display uppercase tracking-wider text-sm">
            <tr>
              <th className="p-4">Time</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Method</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-surface-200">
            {isLoading && (
              <tr>
                <td colSpan={6} className="p-0">
                  <div className="flex flex-col">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} variant="row" className="bg-surface-50 border-b-2 border-surface-200 h-16 rounded-none w-full" />
                    ))}
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && orders.map(order => (
              <tr key={order._id} className="hover:bg-surface-50 transition-colors">
                <td className="p-4 font-bold text-sm">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td className="p-4 font-bold">
                  {typeof order.user === 'object' ? order.user.name : order.user}
                  <div className="text-xs font-normal text-surface-500">{order.deliveryAddress.phone}</div>
                </td>
                <td className="p-4 text-sm font-bold uppercase">{order.paymentMethod.replace('_', ' ')}</td>
                <td className="p-4 font-black text-primary-600">{order.totalPrice + 20} EGP</td>
                <td className="p-4">
                  <span className={`px-2 py-1 border-2 border-surface-900 font-display text-xs font-bold uppercase ${order.status === 'delivered' ? 'bg-green-100' : order.status === 'cancelled' ? 'bg-accent/20' : 'bg-surface-100'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2 justify-center">
                  {!['delivered', 'cancelled'].includes(order.status) && (
                    <>
                      <Button size="sm" onClick={() => advanceStatus(order._id, order.status)}>Advance</Button>
                      <Button size="sm" variant="danger" onClick={() => cancelOrder(order._id)}>Cancel</Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {!isLoading && orders.length === 0 && (
              <tr><td colSpan={6} className="p-4 text-center font-bold">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
