export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cash_on_delivery' | 'online';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface IDeliveryAddress {
  street: string;
  city: string;
  phone: string;
}

export interface PlaceOrderBody {
  paymentMethod: PaymentMethod;
  deliveryAddress: IDeliveryAddress;
}

export interface CreateCheckoutSessionBody {
  deliveryAddress: IDeliveryAddress;
}

export interface UpdateOrderStatusBody {
  status: OrderStatus;
  note?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  page?: string;
  limit?: string;
}
