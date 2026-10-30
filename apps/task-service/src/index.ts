import {config} from 'dotenv';
import {resolve} from 'node:path';
import express from 'express';
import { httpLogger, successResponse, AppError, errorHandler, logger } from 'shared';


config({path: resolve(process.cwd(), ".env")});
config({path: resolve(process.cwd(), "../../.env")}); 

const PORT = process.env.TASK_PORT || 3002;

const app = express()

app.use(httpLogger)
app.use(express.json())

app.get("/health", (_req, res) => {
  successResponse(res, { service: "task-service" });
});

//mount routes here 
app.use((_req, _res, next) => {
  next(new AppError("Route not found", 404));
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Task service is running on port ${PORT}`);
});
