import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/nsqtech',
  jwtSecret: process.env.JWT_SECRET || 'nsqtech-assessment-secret-2024',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  bcryptSaltRounds: 12,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
};
