import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { errorMiddleware } from './middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import menuRoutes from './modules/menu/menu.routes';
import cartRoutes from './modules/cart/cart.routes';
import orderRoutes from './modules/order/order.routes';
import seedRoutes from './utils/seed';
import './types';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Swagger Docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', menuRoutes); // Contains both /menu and /categories
app.use('/api/cart', cartRoutes);
app.use('/api', orderRoutes); // Contains both /orders and /admin/orders

if (process.env.NODE_ENV !== 'production') {
  app.use('/api/seed', seedRoutes);
}

// Global Error Handler
app.use(errorMiddleware);

export default app;
