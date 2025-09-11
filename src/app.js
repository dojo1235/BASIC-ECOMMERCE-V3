import express from 'express';
import publicRoutes from './routes/index.js';
import adminRoutes from './routes/admins/index.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';

const app = express();

// Core middleware
app.use(express.json());

// API Routes
app.use('/api', publicRoutes);
app.use('/api/admins', adminRoutes);

app.use(errorHandler);

export default app;