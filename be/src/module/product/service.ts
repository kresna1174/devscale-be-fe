import { prisma } from "../../utils/prisma.js";
import type { storeInput, updateInput } from "./schema.js";

export async function store(data: storeInput) {
  return prisma.product.create({
    data,
  });
}

export async function update(id: string, data: updateInput) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function get(id?: string) {
  return prisma.product.findMany({
    where: id ? { id } : undefined,
  });
}

export async function deleteProduct(id?: string) {
  return prisma.product.delete({
    where: { id },
    select: { id: true },
  });
}
