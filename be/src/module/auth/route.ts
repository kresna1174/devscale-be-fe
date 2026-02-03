import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "./schema.js";
import { HTTPException } from "hono/http-exception";
import { login, register } from "./service.js";

export const auth = new Hono()
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const data = c.req.valid("json");
    try {
      const user = await register(data);
      return c.json({ success: true, data: user }, 201);
    } catch (error) {
      throw new HTTPException(400, { message: "Email already exists" });
    }
  })
  .post("login", zValidator("json", loginSchema), async (c) => {
    const data = c.req.valid("json");
    try {
      const user = await login(data);
      return c.json({ success: true, data: user }, 201);
    } catch (error) {
      throw new HTTPException(401, {
        message: error instanceof Error ? error.message : "Invalid credentials",
      });
    }
  });
