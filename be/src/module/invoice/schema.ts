import { z } from "zod";

export const invoiceDetailSchema = z.object({
  productId: z.string().uuid(),
  qty: z.number().int().positive(),
  total: z.number().int().nonnegative(),
});

export const storeSchema = z.object({
  date: z.coerce.date(),
  total: z.float64(),
  userId: z.string().uuid(),
  items: z.array(invoiceDetailSchema).min(1),
});

export const updateSchema = z.object({
  date: z.coerce.date(),
  total: z.float64(),
  userId: z.string().uuid(),
  items: z.array(invoiceDetailSchema).min(1),
});

export type storeInput = z.infer<typeof storeSchema>;
export type updateInput = z.infer<typeof updateSchema>;
