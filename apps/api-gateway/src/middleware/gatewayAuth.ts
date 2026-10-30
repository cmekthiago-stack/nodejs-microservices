
import { Request, Response, NextFunction } from "express";
import { AppError, verifyToken} from "shared";
import { getAllowedRoles, isPublicRoute} from "../rbac";
 
const IDENTITY_HEADERS = [
  "x-user-id",
  "x-user-role",
  "x-gateway-secret",
] as const;


//trip any identity-related headers the client may have sent or prevent header spoofing / injection.
function stripIdentityHeaders(req: Request){
  for (const header of IDENTITY_HEADERS) {
    delete req.headers[header];
  }
}


//ttach the trusted gateway secret so downstream services can verify that the request came through the gateway.

function attachGatewaySecret(req: Request) {
  const secret = process.env.GATEWAY_SECRET;

  if (!secret) {
    throw new AppError("Gateway secret not configured", 500);
  }  
  req.headers["x-gateway-secret"] = secret;
}

function requestPath(req: Request){
  const combined = `${req.baseUrl}${req.path}`;
  if(combined.length > 1 && combined.endsWith("/")){
    return combined.slice(0, -1);
  }

  return combined || "/";
}

function attachUserHeaders(req: Request, userId: string, role: string) {
  req.headers["x-user-id"] = userId;
  req.headers["x-user-role"] = role;
  const secret = process.env.GATEWAY_SECRET;

  if (!secret) {
    throw new AppError("Gateway secret not found", 500);
  }  
  req.headers["x-gateway-secret"] = secret;
}
// run on every /auth request before the proxy forwards to auth service
export function gatewayAuth(
  req: Request, res: Response, next: NextFunction
) {
  try{

    //stripe/remove identity haeders    
  stripIdentityHeaders(req);
  attachGatewaySecret(req);

  const path = requestPath(req);
  //if the path is public we are going to bypass it
  if(isPublicRoute(req.method, path)){
    return next();
  }
  const authHeader = req.header("authorization");

  if(!authHeader?.startsWith("Bearer ")){
    return next(new AppError("Missing or ivalid auth token",401));
  }

  const token = authHeader.slice("Bearer ".length).trim();
  const payload = verifyToken(token);

  const allowedRoles = getAllowedRoles(req.method, path);
  if(!allowedRoles){
    throw new AppError("No route found", 404);
    
  }
// forbidden
  if(!allowedRoles.includes(payload.role)){
    return next(new AppError("Forbidden, you do not have access to this route", 403));
  }

  attachUserHeaders(req, payload.userId, payload.role);
  next();
  }catch(err){
    if(err instanceof AppError){
      return next(err);
    } 
    // in some reason jwt verify fails - generic 401 error
     return next(new AppError("Invalid or expired token", 401));

  } 

}