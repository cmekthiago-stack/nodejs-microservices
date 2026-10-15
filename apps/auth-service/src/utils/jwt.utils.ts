import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/auth.types';

function extractjwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }
  return secret;
}
export function signToken(payload: JwtPayload): string {
  const  expiresIn = process.env.JWT_EXPIRES_IN;

  return jwt.sign(payload, extractjwtSecret(), {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  })
}

