import { Request, Response } from 'express';
import { MenuItem } from './menu.model';
import { Category } from './category.model';
import { CreateMenuItemBody, UpdateMenuItemBody, CreateCategoryBody, MenuQueryParams } from './menu.types';
import { ApiResponse } from '../../utils/ApiResponse';
import { FilterQuery } from 'mongoose';

export const getAllMenuItems = async (req: Request<{}, {}, {}, MenuQueryParams>, res: Response): Promise<void> => {
    try {
        const { category, search, available, page = '1', limit = '20' } = req.query;

        const query: FilterQuery<any> = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            const regex = new RegExp(search, 'i');
            query.$or = [
                { 'name.en': regex },
                { 'name.ar': regex }
            ];
        }

        if (available !== undefined) {
            query.isAvailable = available === 'true';
        }

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        const menuItems = await MenuItem.find(query)
            .populate('category')
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 });

        const total = await MenuItem.countDocuments(query);

        ApiResponse.success(res, {
            items: menuItems,
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum)
        }, 'Menu items retrieved successfully');
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        ApiResponse.error(res, err.message, 500, err);
    }
};

export const getMenuItemById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const menuItem = await MenuItem.findById(id).populate('category');

        if (!menuItem) {
            ApiResponse.error(res, 'Menu item not found', 404);
            return;
        }

        ApiResponse.success(res, menuItem, 'Menu item retrieved successfully');
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        ApiResponse.error(res, err.message, 500, err);
    }
};

export const createMenuItem = async (req: Request<{}, {}, CreateMenuItemBody>, res: Response): Promise<void> => {
    try {
        const menuItem = await MenuItem.create(req.body);
        const populatedItem = await menuItem.populate('category');
        ApiResponse.success(res, populatedItem, 'Menu item created successfully', 201);
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        ApiResponse.error(res, err.message, 500, err);
    }
};

export const updateMenuItem = async (req: Request<{ id: string }, {}, UpdateMenuItemBody>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Note: Use new: true to return the updated document
        const updatedItem = await MenuItem.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        }).populate('category');

        if (!updatedItem) {
            ApiResponse.error(res, 'Menu item not found', 404);
            return;
        }

        ApiResponse.success(res, updatedItem, 'Menu item updated successfully');
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        ApiResponse.error(res, err.message, 500, err);
    }
};

export const deleteMenuItem = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedItem = await MenuItem.findByIdAndUpdate(id, { isAvailable: false }, { new: true });

        if (!deletedItem) {
            ApiResponse.error(res, 'Menu item not found', 404);
            return;
        }

        ApiResponse.success(res, deletedItem, 'Menu item deactivated successfully');
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        ApiResponse.error(res, err.message, 500, err);
    }
};

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        ApiResponse.success(res, categories, 'Categories retrieved successfully');
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        ApiResponse.error(res, err.message, 500, err);
    }
};

export const createCategory = async (req: Request<{}, {}, CreateCategoryBody>, res: Response): Promise<void> => {
    try {
        const category = await Category.create(req.body);
        ApiResponse.success(res, category, 'Category created successfully', 201);
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        ApiResponse.error(res, err.message, 500, err);
    }
};
