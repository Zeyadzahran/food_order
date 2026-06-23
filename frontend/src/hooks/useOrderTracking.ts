import { useState, useEffect } from 'react';
import api from '../services/api';
import { Order } from '../types';

export function useOrderTracking(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    let isMounted = true;
    
    

    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        if (res.data.success && isMounted) {
          setOrder(res.data.data);
          setLastUpdated(new Date());
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) setError(err.response?.data?.message || 'Failed to fetch order');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    // Initial fetch
    fetchOrder();

    // Polling setup
    const pollInterval = setInterval(() => {
      if (order?.status === 'delivered' || order?.status === 'cancelled') {
        clearInterval(pollInterval);
        return;
      }
      fetchOrder();
    }, 10000); // Poll every 10 seconds

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [orderId, order?.status]);

  return { order, isLoading, error, lastUpdated };
}
