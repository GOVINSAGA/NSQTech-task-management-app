import express from 'express';
import cors from 'cors';
import { config } from './config';
import { connectDatabase } from './config/database';
import { seedDatabase } from './seed/seeder';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import recordRoutes from './routes/record.routes';

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

const startServer = async () => {
  await connectDatabase();
  await seedDatabase();

  app.listen(config.port, () => {
    console.log(`[Server] NSQTech API running on http://localhost:${config.port}`);
    console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer().catch((error) => {
  console.error('[Server] Failed to start:', error);
  process.exit(1);
});

export default app;
