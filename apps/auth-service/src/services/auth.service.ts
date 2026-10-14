import {RegisterInput} from '../schemas/auth.schemas';
import { findByEmail, createUser } from '../repositories/user.repo';
import { User } from '../types/auth.types';
import { AppError } from "shared";
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