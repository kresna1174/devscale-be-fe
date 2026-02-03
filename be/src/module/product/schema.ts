import { z } from "zod";

export const storeSchema = z.object({
  productName: z.string(),
  qty: z.int(),
  price: z.int(),
});

export const updateSchema = z.object({
  productName: z.string(),
  qty: z.int(),
  price: z.int(),
});

export type storeInput = z.infer<typeof storeSchema>;
export type updateInput = z.infer<typeof updateSchema>;
