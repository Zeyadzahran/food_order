import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/ApiResponse';
import { JwtPayload } from '../types';

export const protect = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            ApiResponse.error(res, 'Authentication required', 401);
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        ApiResponse.error(res, 'Invalid or expired token', 401);
    }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'admin') {
        ApiResponse.error(res, 'Access denied. Admin role required.', 403);
        return;
    }
    next();
};
