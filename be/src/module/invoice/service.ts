import { prisma } from "../../utils/prisma.js";
import type { storeInput, updateInput } from "./schema.js";

export async function store(data: storeInput) {
  const productIds: string[] = [];
  data.items.forEach((item) => {
    productIds.push(item.productId);
  });

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const productMap = new Map(products.map((product) => [product.id, product]));

  const items = data.items.map((item) => {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }

    const subtotal = product.price * item.qty;

    return {
      productId: item.productId,
      qty: item.qty,
      price: product.price,
      total: subtotal,
    };
  });

  const total = items.reduce((sum, item) => {
    return sum + item.total;
  }, 0);

  return prisma.invoice.create({
    data: {
      date: data.date,
      total: total,
      user: { connect: { id: data.userId } },

      invoiceDetail: {
        create: items.map((d) => ({
          product: { connect: { id: d.productId } },
          qty: d.qty,
          total: d.total,
        })),
      },
    },
    select: {
      date: true,
      total: true,
      userId: true,
      invoiceDetail: true,
    },
  });
}

export async function update(id: string, data: updateInput) {
  const productIds: string[] = [];
  data.items.forEach((item) => {
    productIds.push(item.productId);
  });

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const productMap = new Map(products.map((product) => [product.id, product]));

  const items = data.items.map((item) => {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }

    const subtotal = product.price * item.qty;

    return {
      productId: item.productId,
      qty: item.qty,
      price: product.price,
      total: subtotal,
    };
  });

  const total = items.reduce((sum, item) => {
    return sum + item.total;
  }, 0);

  return await prisma.$transaction(async (tx) => {
    await tx.invoice.update({
      where: { id: id },
      data: {
        date: data.date,
        total: total,
      },
    });

    await tx.invoiceDetail.deleteMany({
      where: {
        invoiceId: id,
      },
    });

    await tx.invoiceDetail.createMany({
      data: items.map((item) => ({
        invoiceId: id,
        productId: item.productId,
        qty: item.qty,
        total: item.total,
      })),
    });

    const fullInvoice = await tx.invoice.findUnique({
      where: { id },
      include: {
        invoiceDetail: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    return fullInvoice;
  });
}

export async function get(id?: string) {
  return prisma.invoice.findMany({
    where: id ? { id } : undefined,
    select: {
      id: true,
      date: true,
      total: true,
      userId: true,
      user: true,
      invoiceDetail: true,
    },
  });
}

export async function deleteInvoice(id: string) {
  return prisma.invoice.delete({
    where: { id },
  });
}
