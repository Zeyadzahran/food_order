export interface LocalizedString {
  en: string;
  ar: string;
}

export interface Category {
  _id: string;
  name: LocalizedString;
  description: LocalizedString;
}

export interface MenuItem {
  _id: string;
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  category: Category;
  imageUrl: string;
  isAvailable: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cash_on_delivery' | 'online';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface OrderItem {
  menuItemId: string;
  name: LocalizedString;
  price: number;
  quantity: number;
}

export interface StatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  _id: string;
  user: string | User;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentSessionId?: string;
  paymentReference?: string;
  status: OrderStatus;
  deliveryAddress: {
    street: string;
    city: string;
    phone: string;
  };
  statusHistory: StatusHistory[];
  createdAt: string;
}
