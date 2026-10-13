import {Request, Response, NextFunction} from 'express';
import { AppError } from './AppError';


export const errorHandler = ( 
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,      
    });
  }

  // logger error

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  }); 
}