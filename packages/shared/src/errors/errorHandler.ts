import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('===== ERROR =====');
  console.error(err);
  if (err instanceof Error) {
    console.error(err.stack);
  }
  console.error('=================');

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
}