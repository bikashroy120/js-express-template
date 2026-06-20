import path from 'path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import config from './config/index.js';
import globalErrorHandler from './app/middlewares/globalErrorHandler.js';
import router from './app/router/index.js';

const app = express();

// const uploadsPath = path.join(__dirname, '..', 'uploads');
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));
// Trust proxy for production deployment
app.set('trust proxy', config.trustProxy);
app.disable('x-powered-by');

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

// CORS configuration
app.use(
  cors({
    origin:
      config.nodeEnv === 'production'
        ? config.allowedOrigins
        : [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:3000',
            'http://localhost:3001',
            'https://simonemiotto.maktechgroup.tech',
          ],
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.nodeEnv === 'production' ? 100 : 1000,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});

app.use('/api/', limiter);
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(hpp());

// Routes
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Welcome to the API',
    data: {
      version: '1.0.0',
      name: 'stater API',
      description: 'RESTful API for stater platform',
      author: 'Bikash Roy',
      contact: {
        email: 'bikashroydt@gmail.com',
      },
    },
  });
});

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'OK',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

app.use('/api/v1', router);

app.use(globalErrorHandler);

app.use((req, res, _next) => {
  res.status(404).json({
    success: false,
    message: 'API route not found!',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'This URL does not exist. Please check the URL and try again.',
      },
    ],
  });
});

export default app;
