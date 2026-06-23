import { Router } from 'express';
import {
  placeOrder,
  createOnlineCheckoutSession,
  verifyOnlinePayment,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} from './order.controller';
import { protect, isAdmin } from '../../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order management operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderStatus:
 *       type: string
 *       enum: [pending, confirmed, preparing, out_for_delivery, delivered, cancelled]
 *     PaymentMethod:
 *       type: string
 *       enum: [cash_on_delivery, online]
 *     PaymentStatus:
 *       type: string
 *       enum: [pending, paid, failed]
 *     DeliveryAddress:
 *       type: object
 *       properties:
 *         street:
 *           type: string
 *         city:
 *           type: string
 *         phone:
 *           type: string
 *     StatusHistory:
 *       type: object
 *       properties:
 *         status:
 *           $ref: '#/components/schemas/OrderStatus'
 *         timestamp:
 *           type: string
 *           format: date-time
 *         note:
 *           type: string
 *     OrderItem:
 *       type: object
 *       properties:
 *         menuItemId:
 *           type: string
 *         name:
 *           $ref: '#/components/schemas/LocalizedString'
 *         price:
 *           type: number
 *         quantity:
 *           type: number
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         totalPrice:
 *           type: number
 *         paymentMethod:
 *           $ref: '#/components/schemas/PaymentMethod'
 *         paymentStatus:
 *           $ref: '#/components/schemas/PaymentStatus'
 *         status:
 *           $ref: '#/components/schemas/OrderStatus'
 *         deliveryAddress:
 *           $ref: '#/components/schemas/DeliveryAddress'
 *         statusHistory:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/StatusHistory'
 *         createdAt:
 *           type: string
 *           format: date-time
 */

// ======================== USER ROUTES ======================== //

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentMethod
 *               - deliveryAddress
 *             properties:
 *               paymentMethod:
 *                 $ref: '#/components/schemas/PaymentMethod'
 *               deliveryAddress:
 *                 $ref: '#/components/schemas/DeliveryAddress'
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Cart is empty
 */
router.post('/orders', protect, placeOrder);
router.post('/orders/checkout-session', protect, createOnlineCheckoutSession);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get user orders
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *           default: "1"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *           default: "10"
 *     responses:
 *       200:
 *         description: User orders retrieved
 */
router.get('/orders', protect, getUserOrders);
router.get('/orders/:id/verify-payment', protect, verifyOnlinePayment);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order retrieved
 *       403:
 *         description: Access denied
 *       404:
 *         description: Order not found
 */
router.get('/orders/:id', protect, getOrderById);

// ======================== ADMIN ROUTES ======================== //

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/OrderStatus'
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *           default: "1"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *           default: "10"
 *     responses:
 *       200:
 *         description: All orders retrieved
 */
router.get('/admin/orders', protect, isAdmin, getAllOrders);

/**
 * @swagger
 * /api/admin/orders/{id}/status:
 *   patch:
 *     summary: Update order status (Admin only)
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 $ref: '#/components/schemas/OrderStatus'
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.patch('/admin/orders/:id/status', protect, isAdmin, updateOrderStatus);

export default router;
