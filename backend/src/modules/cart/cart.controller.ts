import { Request, Response } from 'express';
import { Cart } from './cart.model';
import { MenuItem } from '../menu/menu.model';
import { AddToCartBody, UpdateCartItemBody } from './cart.types';
import { ApiResponse } from '../../utils/ApiResponse';
import { Types } from 'mongoose';

export const getCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const cart = await Cart.findOne({ user: userId }).populate('items.menuItem');

        if (!cart) {
            ApiResponse.success(res, { items: [], totalPrice: 0 }, 'Cart empty');
            return;
        }

        ApiResponse.success(res, cart, 'Cart retrieved');
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        ApiResponse.error(res, err.message, 500, err);
    }
};

export const addToCart = async (req: Request<{}, {}, AddToCartBody>, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { menuItemId, quantity } = req.body;

        const menuItem = await MenuItem.findById(menuItemId);
        if (!menuItem) {
            ApiResponse.error(res, 'Menu item not found', 404);
            return;
        }

        if (!menuItem.isAvailable) {
            ApiResponse.error(res, 'Menu item is out of stock', 400);
            return;
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(item => item.menuItem.toString() === menuItemId);

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({
                menuItem: new Types.ObjectId(menuItemId),
                quantity,
                price: menuItem.price,
                name: menuItem.name
            });
        }

        await cart.save();
        await cart.populate('items.menuItem');

        ApiResponse.success(res, cart, 'Item added to cart');
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        ApiResponse.error(res, err.message, 500, err);
    }
};

export const updateCartItem = async (req: Request<{ itemId: string }, {}, UpdateCartItemBody>, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { itemId } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            ApiResponse.error(res, 'Cart not found', 404);
            return;
        }

        const itemIndex = cart.items.findIndex(item => (item as any)._id?.toString() === itemId);
        if (itemIndex === -1) {
            ApiResponse.error(res, 'Item not found in cart', 404);
            return;
        }

        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        await cart.populate('items.menuItem');

        ApiResponse.success(res, cart, 'Cart updated');
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        ApiResponse.error(res, err.message, 500, err);
    }
};

export const removeCartItem = async (req: Request<{ itemId: string }>, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { itemId } = req.params;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            ApiResponse.error(res, 'Cart not found', 404);
            return;
        }

        cart.items = cart.items.filter(item => (item as any)._id?.toString() !== itemId);

        await cart.save();
        await cart.populate('items.menuItem');

        ApiResponse.success(res, cart, 'Item removed from cart');
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        ApiResponse.error(res, err.message, 500, err);
    }
};

export const clearCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        await Cart.findOneAndDelete({ user: userId });
        ApiResponse.success(res, null, 'Cart cleared');
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        ApiResponse.error(res, err.message, 500, err);
    }
};
