import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { loginInput, registerInput } from "./schema.js";
import { prisma } from "../../utils/prisma.js";
import { env } from "../../settings.js";

export async function register(data: registerInput) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
    },
    select: { id: true, email: true, createdAt: true },
  });
}

export async function login(data: loginInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) throw new Error("Invalid credentials");

  const validPassword = await bcrypt.compare(data.password, user.password);
  if (!validPassword) throw new Error("Invalid credentials");

  const accessToken = jwt.sign({ id: user.id }, env.JWT_SECRET);

  return { accessToken, user };
}
