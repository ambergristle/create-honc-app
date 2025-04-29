import { drizzle } from "drizzle-orm/d1";
import { createFiberplane, createOpenAPISpec } from "@fiberplane/hono";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as schema from "./db/schema";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{
  Bindings: Bindings;
}>()
  .get("/", (c) => {
    return c.text("Honc from above! ☁️🪿");
  })
  .get("/api/users", async (c) => {
    const db = drizzle(c.env.DB);
    const users = await db.select().from(schema.users);
    return c.json({ users });
  })
  .post("/api/user", async (c) => {
    const db = drizzle(c.env.DB);
    const { name, email } = await c.req.json();
    const [newUser] = await db.insert(schema.users).values({
      name: name,
      email: email,
    }).returning();

    return c.json(newUser);
  });

app.onError((error, c) => {
  console.error(error);
  if (error instanceof HTTPException) {
    return c.json({ message: error.message }, error.status);
  }
  return c.json({ message: "Something went wrong" }, 500);
});

/**
 * Serve a simplified api specification for your API
 * As of writing, this is just the list of routes and their methods.
 */
app.get("/openapi.json", c => {
  return c.json(createOpenAPISpec(app, {
    // openapi: "3.0.0",
    info: {
      title: "Honc D1 App",
      version: "1.0.0",
    },
  }))
});

/**
 * Mount the Fiberplane api explorer to be able to make requests against your API.
 * 
 * Visit the explorer at `/fp`
 */
app.use("/fp/*", createFiberplane({
  app,
  openapi: { url: "/openapi.json" }
}));


export default app;

// Export the instrumented app if you've wired up a Fiberplane-Hono-OpenTelemetry trace collector
//
// export default instrument(app);
