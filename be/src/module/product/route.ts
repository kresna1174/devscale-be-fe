import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { storeSchema, updateSchema } from "./schema.js";
import { deleteProduct, get, store, update } from "./service.js";
import { HTTPException } from "hono/http-exception";
import {
  authMiddleware,
  type AuthVariables,
} from "../../middleware/authMiddleware.js";

export const product = new Hono<{ Variables: AuthVariables }>()
  .use("*", authMiddleware)
  .post("/", zValidator("json", storeSchema), async (c) => {
    const data = c.req.valid("json");

    try {
      const result = await store(data);
      return c.json({ success: true, data: result }, 201);
    } catch (error) {
      throw new HTTPException(400, { message: "Failed to create product" });
    }
  })
  .put(":id", zValidator("json", updateSchema), async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    try {
      const result = await update(id, data);
      return c.json({ success: true, data: result });
    } catch (error) {
      throw new HTTPException(400, { message: "Failed to update product" });
    }
  })
  .get("/", async (c) => {
    try {
      const result = await get();
      return c.json({ success: true, data: result });
    } catch (error) {
      throw new HTTPException(400, { message: "Failed to get product" });
    }
  })
  .get("/:id", async (c) => {
    try {
      const id = c.req.param("id");
      const result = await get(id);
      return c.json({ success: true, data: result });
    } catch (error) {
      throw new HTTPException(400, { message: "Failed to get product" });
    }
  })
  .delete("/:id", async (c) => {
    try {
      const id = c.req.param("id");
      const result = await deleteProduct(id);
      return c.json({ success: true, data: result });
    } catch (error) {
      throw new HTTPException(400, { message: "Failed to get product" });
    }
  });
