import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import jwt from "jsonwebtoken";
import { env } from "../settings.js";
import { prisma } from "../utils/prisma.js";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
};

export type AuthVariables = {
  user: AuthUser;
};

export const authMiddleware = async (
  c: Context<{ Variables: AuthVariables }>,
  next: Next,
) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new HTTPException(401, {
      message: "Unauthorized: Missing or invalid token",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
    };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      throw new HTTPException(401, { message: "Unauthorized: User not found" });
    }

    c.set("user", user);
    await next();
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(401, { message: "Unauthorized: Invalid token" });
  }
};
