import mongoose, { Document, Schema, Types } from 'mongoose';
import { OrderStatus, PaymentMethod, PaymentStatus, IDeliveryAddress } from './order.types';

export interface IStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
}

export interface IOrderItem {
  menuItemId: string;
  name: {
    en: string;
    ar: string;
  };
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentSessionId?: string;
  paymentReference?: string;
  status: OrderStatus;
  deliveryAddress: IDeliveryAddress;
  statusHistory: IStatusHistory[];
  createdAt: Date;
}

const statusHistorySchema = new Schema<IStatusHistory>({
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    required: true
  },
  timestamp: { type: Date, default: Date.now },
  note: { type: String }
}, { _id: false });

const orderItemSchema = new Schema<IOrderItem>({
  menuItemId: { type: String, required: true },
  name: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

const deliveryAddressSchema = new Schema<IDeliveryAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true }
}, { _id: false });

const orderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'online'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentSessionId: { type: String },
  paymentReference: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: { type: deliveryAddressSchema, required: true },
  statusHistory: [statusHistorySchema],
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model<IOrder>('Order', orderSchema);
