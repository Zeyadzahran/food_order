import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from './auth.model';
import { RegisterBody, LoginBody, AuthResponse } from './auth.types';
import { ApiResponse } from '../../utils/ApiResponse';

const generateToken = (userId: string, role: string): string => {
    const secret = process.env.JWT_SECRET || 'secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
    return jwt.sign({ userId, role }, secret, { expiresIn } as jwt.SignOptions);
};

export const register = async (req: Request<{}, {}, RegisterBody>, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            ApiResponse.error(res, 'Email already in use', 400);
            return;
        }

        const user = await User.create({ name, email, password });
        const token = generateToken(String(user._id), user.role);

        const payload: AuthResponse = {
            token,
            user: {
                id: String(user._id),
                name: user.name,
                email: user.email,
                role: user.role
            }
        };

        ApiResponse.success(res, payload, 'User registered successfully', 201);
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        ApiResponse.error(res, err.message, 500, err);
    }
};

export const login = async (req: Request<{}, {}, LoginBody>, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            ApiResponse.error(res, 'Invalid credentials', 401);
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            ApiResponse.error(res, 'Invalid credentials', 401);
            return;
        }

        const token = generateToken(String(user._id), user.role);

        const payload: AuthResponse = {
            token,
            user: {
                id: String(user._id),
                name: user.name,
                email: user.email,
                role: user.role
            }
        };

        ApiResponse.success(res, payload, 'User logged in successfully', 200);
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        ApiResponse.error(res, err.message, 500, err);
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            ApiResponse.error(res, 'Unauthorized', 401);
            return;
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            ApiResponse.error(res, 'User not found', 404);
            return;
        }

        ApiResponse.success(res, user, 'User details retrieved', 200);
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        ApiResponse.error(res, err.message, 500, err);
    }
};
