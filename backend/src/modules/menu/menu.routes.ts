import { Router } from 'express';
import {
    getAllMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getAllCategories,
    createCategory
} from './menu.controller';
import { protect, isAdmin } from '../../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: Menu and Category management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LocalizedString:
 *       type: object
 *       properties:
 *         en:
 *           type: string
 *           example: "Burger"
 *         ar:
 *           type: string
 *           example: "برجر"
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           $ref: '#/components/schemas/LocalizedString'
 *         description:
 *           $ref: '#/components/schemas/LocalizedString'
 *         createdAt:
 *           type: string
 *           format: date-time
 *     MenuItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           $ref: '#/components/schemas/LocalizedString'
 *         description:
 *           $ref: '#/components/schemas/LocalizedString'
 *         price:
 *           type: number
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         imageUrl:
 *           type: string
 *         isAvailable:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 */

// ======================== CATEGORY ROUTES ======================== //

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 */
router.get('/categories', getAllCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Menu]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 $ref: '#/components/schemas/LocalizedString'
 *               description:
 *                 $ref: '#/components/schemas/LocalizedString'
 *     responses:
 *       201:
 *         description: Category created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/categories', protect, isAdmin, createCategory);


// ======================== MENU ROUTES ======================== //

/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Get all menu items
 *     tags: [Menu]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category object ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name.en or name.ar
 *       - in: query
 *         name: available
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by availability
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *           default: "1"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *           default: "20"
 *     responses:
 *       200:
 *         description: Menu items retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         items:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/MenuItem'
 *                         page:
 *                           type: number
 *                         limit:
 *                           type: number
 *                         total:
 *                           type: number
 *                         pages:
 *                           type: number
 */
router.get('/menu', getAllMenuItems);

/**
 * @swagger
 * /api/menu/{id}:
 *   get:
 *     summary: Get a single menu item by ID
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu Item ID
 *     responses:
 *       200:
 *         description: Menu item retrieved
 *       404:
 *         description: Menu item not found
 */
router.get('/menu/:id', getMenuItemById);

/**
 * @swagger
 * /api/menu:
 *   post:
 *     summary: Create a menu item (Admin only)
 *     tags: [Menu]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - category
 *               - imageUrl
 *             properties:
 *               name:
 *                 $ref: '#/components/schemas/LocalizedString'
 *               description:
 *                 $ref: '#/components/schemas/LocalizedString'
 *               price:
 *                 type: number
 *                 example: 12.99
 *               category:
 *                 type: string
 *                 example: 60d21b4667d0d8992e610c85
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               isAvailable:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Menu item created
 */
router.post('/menu', protect, isAdmin, createMenuItem);

/**
 * @swagger
 * /api/menu/{id}:
 *   put:
 *     summary: Update a menu item (Admin only)
 *     tags: [Menu]
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
 *             properties:
 *               name:
 *                 $ref: '#/components/schemas/LocalizedString'
 *               description:
 *                 $ref: '#/components/schemas/LocalizedString'
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Menu item updated
 */
router.put('/menu/:id', protect, isAdmin, updateMenuItem);

/**
 * @swagger
 * /api/menu/{id}:
 *   delete:
 *     summary: Soft delete a menu item (Admin only)
 *     tags: [Menu]
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
 *         description: Menu item deactivated
 */
router.delete('/menu/:id', protect, isAdmin, deleteMenuItem);

export default router;
