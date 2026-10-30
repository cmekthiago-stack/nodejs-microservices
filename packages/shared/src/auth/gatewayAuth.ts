import type {Request, Response, NextFunction} from "express"
import {AppError } from "../errors/AppError"

//read GATEWA_SECRET from env 
// compare to incoming x-gateway-secret
//match ->next; mismatch -> forbidden(403)

export function requireGatewaySecret(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const expected = process.env.GATEWAY_SECRET 

  if(!expected){
    return next( new AppError ("Gateway secret not configured", 500))
  }

  const incoming = req.header("x-gateway-secret")

  if(!incoming || incoming !== expected){
    return next( new AppError ("Forbidden", 403))
  }
  next();
}

