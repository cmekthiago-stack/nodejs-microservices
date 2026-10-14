import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, "name is required"),
  email: z.string().email("Valid email is needed"),
  password: z.string().min(6, "Password must be at least 6 characters long")
});

export const loginSchema = z.object({
  email: z.string().email("Valid email is needed"),
  password: z.string().min(6, "Password must be at least 6 characters long")
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;