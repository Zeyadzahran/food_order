import { useEffect, useState } from 'react';
import { Package, TrendingUp, AlertTriangle, MenuSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Order, MenuItem } from '../../types';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';

export default function OverviewPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, menuRes] = await Promise.all([
          api.get('/admin/orders?limit=50'), // Get enough to count
          api.get('/menu')
        ]);
        if (ordersRes.data.success) setOrders(ordersRes.data.data.items);
        if (menuRes.data.success) setMenuItems(menuRes.data.data.items);
      } catch (err) {
        console.error('Error fetching overview data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);
  const revenueToday = todayOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const recentOrders = orders.slice(0, 5); // Just top 5

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto pb-20 md:pb-0">
        <Skeleton className="w-48 h-10 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 border-4 border-surface-900 rounded-none bg-surface-100" />
          ))}
        </div>
        <Skeleton className="w-48 h-8 mb-6" />
        <div className="flex flex-col gap-0 border-4 border-surface-900">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="row" className="bg-surface-50 border-b-2 border-surface-200 h-16 rounded-none" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 md:pb-0">
      <h1 className="heading-lg uppercase mb-8 border-b-4 border-primary-500 pb-2 inline-block">Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Stat Cards */}
        <div className="bg-surface-50 border-4 border-surface-900 p-6 shadow-solid">
          <div className="flex items-start justify-between mb-4">
            <span className="font-display font-bold uppercase text-surface-500 text-sm tracking-wider">Today's Orders</span>
            <Package className="text-primary-500" />
          </div>
          <div className="font-display font-black text-4xl">{todayOrders.length}</div>
        </div>

        <div className="bg-surface-50 border-4 border-surface-900 p-6 shadow-solid">
          <div className="flex items-start justify-between mb-4">
            <span className="font-display font-bold uppercase text-surface-500 text-sm tracking-wider">Revenue</span>
            <TrendingUp className="text-green-500" />
          </div>
          <div className="font-display font-black text-4xl">{revenueToday} <span className="text-xl">EGP</span></div>
        </div>

        <div className={`bg-surface-50 border-4 p-6 shadow-solid ${pendingOrders.length > 5 ? 'border-accent' : 'border-surface-900'}`}>
          <div className="flex items-start justify-between mb-4">
            <span className="font-display font-bold uppercase text-surface-500 text-sm tracking-wider">Pending Orders</span>
            <AlertTriangle className={pendingOrders.length > 5 ? 'text-accent' : 'text-amber-500'} />
          </div>
          <div className={`font-display font-black text-4xl ${pendingOrders.length > 5 ? 'text-accent' : ''}`}>
            {pendingOrders.length}
          </div>
        </div>

        <div className="bg-surface-50 border-4 border-surface-900 p-6 shadow-solid">
          <div className="flex items-start justify-between mb-4">
            <span className="font-display font-bold uppercase text-surface-500 text-sm tracking-wider">Menu Items</span>
            <MenuSquare className="text-primary-500" />
          </div>
          <div className="font-display font-black text-4xl">{menuItems.length}</div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="heading-md uppercase">Recent Orders</h2>
          <Link to="/admin/orders">
            <Button size="sm" variant="secondary">View All</Button>
          </Link>
        </div>

        <div className="bg-white border-4 border-surface-900 shadow-solid overflow-x-auto">
          <table className="w-full text-left font-body">
            <thead className="bg-surface-900 text-white font-display uppercase tracking-wider text-sm">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-surface-200">
              {recentOrders.map(order => (
                <tr key={order._id} className="hover:bg-surface-50 transition-colors">
                  <td className="p-4 font-mono font-bold text-sm">#{order._id.slice(-6).toUpperCase()}</td>
                  <td className="p-4 font-bold">{typeof order.user === 'object' ? order.user.name : order.user}</td>
                  <td className="p-4">{order.items.reduce((acc, item) => acc + item.quantity, 0)}</td>
                  <td className="p-4 font-bold">{order.totalPrice} EGP</td>
                  <td className="p-4">
                    <span className="px-2 py-1 border-2 border-surface-900 font-display text-xs font-bold uppercase bg-surface-100">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={5} className="p-4 text-center">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
