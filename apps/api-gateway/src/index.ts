import { config } from 'dotenv';
import {resolve} from 'node:path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit'
import { AppError, httpLogger, successResponse, errorHandler } from 'shared';
import { createProxyMiddleware } from 'http-proxy-middleware';
import pino from 'pino'; 

const logger = pino();



config({path: resolve(process.cwd(), '.env')});
config({path: resolve(process.cwd(), '../../.env')});

const PORT = process.env.PORT || 3000;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const app = express();

//secure http Headers
app.use(helmet());
app.use(cors());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: true, // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})
)

app.use(httpLogger);

app.use("/health", (req, res) => {
  successResponse(res, {service: "API Gateway"});
})

// create proxy starts
// locahost:3000 /auth/login -> localhost:3001/auth/login
app.use('/auth', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: (path)=>`/auth${path}`,
})
)

app.use((req, res, next) => {
  next(new AppError('Route not found', 404));
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API Gateway is running on port ${PORT}`);
});