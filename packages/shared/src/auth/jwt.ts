import jwt from 'jsonwebtoken'
import type{JwtPayload} from './types'

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

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, extractjwtSecret());

  if (
    typeof decoded !== 'object' ||
    decoded === null ||
    typeof decoded.userId !== 'string' ||
    (decoded.role !== 'USER' && decoded.role !== 'ADMIN')
  ) {
    throw new Error('Invalid token payload ');
  }

  return {
    userId: decoded.userId,
    role: decoded.role
  };
}