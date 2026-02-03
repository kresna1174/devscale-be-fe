import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { auth } from "./module/auth/route.js";
import { product } from "./module/product/route.js";
import { invoice } from "./module/invoice/route.js";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";

const app = new Hono()
  .use(cors())
  .use(logger())
  .onError((err, c) => {
    if (err instanceof HTTPException) {
      return c.json({ error: err.message }, err.status);
    }

    if (err.name === "ZodError") {
      return c.json({ error: err }, 400);
    }

    console.error(err);
    return c.json({ error: err.message || "Internal Server Error" }, 500);
  })
  .route("/auth", auth)
  .route("/products", product)
  .route("/invoice", invoice);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve(
  {
    fetch: app.fetch,
    port: 8081,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
