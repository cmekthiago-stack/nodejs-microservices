import {Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { AppError, successResponse } from "shared";

export async function register(
  req: Request, 
  res: Response,
   next: NextFunction
){
  try{
    const user = await authService.register(req.body);
    successResponse(res, {user}, 201);
  }catch(error){
    next(error);
  }
}

export async function login(
  req: Request, 
  res: Response,
   next: NextFunction
){
  try{
    const result = await authService.login(req.body);
    successResponse(res, result);
  }catch(error){
    next(error);
  }
}

export async function getMe(
  req: Request, 
  res: Response,
   next: NextFunction
){
  try{
    const userId =req.headers["x-user-id"];
    if(!userId){
       throw new AppError("missing x-userId header", 401)
      };

  const user = await authService.getMe(userId as string);
    successResponse(res, {user});
  }catch(error){
    next(error);
  }
}

