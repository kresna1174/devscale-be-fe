import { z } from "zod";

export const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(6, "password to short"),
});

export const registerSchema = z.object({
  email: z.string(),
  password: z.string().min(6, "password to short"),
});

export type loginInput = z.infer<typeof loginSchema>;
export type registerInput = z.infer<typeof registerSchema>;
