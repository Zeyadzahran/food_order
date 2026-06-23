import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { Order } from './order.model';
import {
  PlaceOrderBody,
  UpdateOrderStatusBody,
  OrderFilters,
  CreateCheckoutSessionBody,
} from './order.types';
import { Cart } from '../cart/cart.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { createStripeCheckoutSession, retrieveStripeCheckoutSession } from './payment.service';

const DELIVERY_FEE = 20;

export const placeOrder = async (req: Request<{}, {}, PlaceOrderBody>, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Unauthorized', 401);
      return;
    }

    const { paymentMethod, deliveryAddress } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate('items.menuItem');
    if (!cart || cart.items.length === 0) {
      ApiResponse.error(res, 'Cart is empty', 400);
      return;
    }

    const orderItems = cart.items.map((item) => ({
      menuItemId: (item.menuItem as any)._id?.toString() || item.menuItem.toString(),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const order = new Order({
      user: userId,
      items: orderItems,
      totalPrice: cart.totalPrice,
      paymentMethod,
      paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending',
      paymentReference: paymentMethod === 'online' ? 'manual-online' : undefined,
      status: 'pending',
      deliveryAddress,
      statusHistory: [{ status: 'pending', timestamp: new Date() }],
    });

    await order.save();
    await Cart.findOneAndDelete({ user: userId });

    ApiResponse.success(res, order, 'Order placed successfully', 201);
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    ApiResponse.error(res, err.message, 500, err);
  }
};

export const createOnlineCheckoutSession = async (
  req: Request<{}, {}, CreateCheckoutSessionBody>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Unauthorized', 401);
      return;
    }

    const { deliveryAddress } = req.body;
    const cart = await Cart.findOne({ user: userId }).populate('items.menuItem');

    if (!cart || cart.items.length === 0) {
      ApiResponse.error(res, 'Cart is empty', 400);
      return;
    }

    const order = await Order.create({
      user: userId,
      items: cart.items.map((item) => ({
        menuItemId: (item.menuItem as any)._id?.toString() || item.menuItem.toString(),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice: cart.totalPrice,
      paymentMethod: 'online',
      paymentStatus: 'pending',
      status: 'pending',
      deliveryAddress,
      statusHistory: [{ status: 'pending', timestamp: new Date(), note: 'Awaiting online payment' }],
    });

    try {
      const session = await createStripeCheckoutSession({
        cart,
        orderId: order._id.toString(),
        userId,
      });

      order.paymentSessionId = session.id;
      await order.save();

      ApiResponse.success(
        res,
        { orderId: order._id, checkoutUrl: session.url },
        'Checkout session created successfully',
        201
      );
    } catch (error) {
      await order.deleteOne();
      throw error;
    }
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    ApiResponse.error(res, err.message, 500, err);
  }
};

export const verifyOnlinePayment = async (
  req: Request<{ id: string }, {}, {}, { sessionId?: string }>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;
    const { id } = req.params;
    const sessionId = req.query.sessionId;

    const order = await Order.findById(id);
    if (!order) {
      ApiResponse.error(res, 'Order not found', 404);
      return;
    }

    if (order.user.toString() !== userId && role !== 'admin') {
      ApiResponse.error(res, 'Access denied', 403);
      return;
    }

    const stripeSessionId = sessionId || order.paymentSessionId;
    if (!stripeSessionId) {
      ApiResponse.error(res, 'Missing payment session identifier', 400);
      return;
    }

    const session = await retrieveStripeCheckoutSession(stripeSessionId);

    if (session.client_reference_id && session.client_reference_id !== order._id.toString()) {
      ApiResponse.error(res, 'Payment session does not match this order', 400);
      return;
    }

    if (session.payment_status !== 'paid') {
      order.paymentStatus = session.status === 'expired' ? 'failed' : 'pending';
      await order.save();
      ApiResponse.error(res, 'Payment is not completed yet', 400);
      return;
    }

    if (order.paymentStatus !== 'paid') {
      order.paymentStatus = 'paid';
      order.paymentReference = session.payment_intent;
      await order.save();
      await Cart.findOneAndDelete({ user: order.user });
    }

    ApiResponse.success(res, order, 'Payment verified successfully');
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    ApiResponse.error(res, err.message, 500, err);
  }
};

export const getUserOrders = async (req: Request<{}, {}, {}, OrderFilters>, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments({ user: userId });

    ApiResponse.success(
      res,
      {
        items: orders,
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
      'User orders retrieved'
    );
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    ApiResponse.error(res, err.message, 500, err);
  }
};

export const getOrderById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const role = req.user?.role;

    const order = await Order.findById(id);
    if (!order) {
      ApiResponse.error(res, 'Order not found', 404);
      return;
    }

    if (order.user.toString() !== userId && role !== 'admin') {
      ApiResponse.error(res, 'Access denied', 403);
      return;
    }

    ApiResponse.success(res, order, 'Order retrieved');
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    ApiResponse.error(res, err.message, 500, err);
  }
};

export const getAllOrders = async (req: Request<{}, {}, {}, OrderFilters>, res: Response): Promise<void> => {
  try {
    const { status, page = '1', limit = '10' } = req.query;

    const query: FilterQuery<any> = {};
    if (status) {
      query.status = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(query);

    ApiResponse.success(
      res,
      {
        items: orders,
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
      'All orders retrieved'
    );
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    ApiResponse.error(res, err.message, 500, err);
  }
};

export const updateOrderStatus = async (
  req: Request<{ id: string }, {}, UpdateOrderStatusBody>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      ApiResponse.error(res, 'Order not found', 404);
      return;
    }

    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note,
    });

    await order.save();

    ApiResponse.success(res, order, 'Order status updated');
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    ApiResponse.error(res, err.message, 500, err);
  }
};
