import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  JWT_SECRET: z.string().min(1),
  DATABASE_URL: z.url(),
});

export const env = envSchema.parse(process.env);
