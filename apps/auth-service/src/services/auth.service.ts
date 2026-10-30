import {LoginInput, RegisterInput} from '../schemas/auth.schemas';
import { findByEmail, createUser, findById } from '../repositories/user.repo';
import { AppError, signToken } from "shared";
import bcrypt from "bcryptjs"; 
import { convertToPublicUser } from '../utils/auth.utils';

export async function register(input:RegisterInput){
  const existing = await findByEmail(input.email);
  if (existing) {
    throw new AppError("User already exists", 409);
  }
  const passwordHash = await bcrypt.hash(input.password, 10)
  const user = await createUser({
    name: input.name,
    email: input.email,
    passwordHash,
    role: "USER"
  });
  
  return convertToPublicUser(user);
}

export async function login(input:LoginInput) {
  const user = await findByEmail(input.email);
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(input.password, user.password_hash);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }
  const token = signToken({userId: user.id, role: user.role});

  return {token,
    user: convertToPublicUser(user)
  };
}


export async function getMe(userId: string) {
  const user = await findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return convertToPublicUser(user);
  
}