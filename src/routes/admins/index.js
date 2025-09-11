import { Router } from 'express';
import superAdminRoutes from './super-admin.routes.js';
import adminRoutes from './admin.routes.js';
import userRoutes from './user.routes.js';
import productRoutes from './product.routes.js';
import orderRoutes from './order.routes.js';

const router = Router();

router.use('/super', superAdminRoutes);
router.use('/me', adminRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);

export default router;