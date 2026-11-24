import {config} from 'dotenv';
import express from 'express';
import {resolve} from 'node:path';
import { httpLogger, successResponse, AppError, errorHandler, logger, requireGatewaySecret } from 'shared';
import attachmentRoutes from './routes/media.routes';


config({path: resolve(process.cwd(), '.env')})
config({path: resolve(process.cwd(), '../../.env')})

const PORT = process.env.MEDIA_PORT || 3003;
const app = express();

app.use(httpLogger)

app.use("/tasks", requireGatewaySecret, attachmentRoutes);

app.get("/health", (_req, res)=>{
  successResponse(res, {service : "media-service"})
})

app.use((_req, _res, next) => {
  next(new AppError("Route not found", 404));
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Media service is running on port ${PORT}`);
});