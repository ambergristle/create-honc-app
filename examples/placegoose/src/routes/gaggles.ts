import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { validator } from "hono/validator";
import { z } from "zod";

import * as schema from "../db/schema";
import { makeBodyValidator, validateIdParam } from "../lib/validation";
import type { DatabaseBindings, DrizzleClient } from "../types";
import { generateId } from "../utils";

const ZGaggleInsert = z.object({
  name: z.string().min(1),
  territory: z.string().min(1).nullable(),
});

const gagglesApp = new Hono<{ Bindings: DatabaseBindings }>();

// Get all Gaggles
gagglesApp.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const gaggles = await db.select().from(schema.gaggles);

  return c.json(gaggles);
});

// Create a new Gaggle
gagglesApp.post(
  "/",
  validator("json", makeBodyValidator(ZGaggleInsert.parse)),
  async (c) => {
    const gaggleData = c.req.valid("json");

    const newGaggle: schema.Gaggle = {
      id: generateId(),
      ...gaggleData,
    };

    return c.json(newGaggle, 201);
  },
);

// Get a specific Gaggle by id
gagglesApp.get("/:id", validator("param", validateIdParam), async (c) => {
  const { id } = c.req.valid("param");

  const db = drizzle(c.env.DB);
  const gaggleById = await getGaggleById(db, id);

  if (!gaggleById) {
    throw new HTTPException(404, {
      message: `No Gaggle with ID ${id}`,
    });
  }

  return c.json(gaggleById);
});

// Get Geese in the Gaggle specified by id
gagglesApp.get("/:id/geese", validator("param", validateIdParam), async (c) => {
  const { id } = c.req.valid("param");

  const db = drizzle(c.env.DB);
  const gaggleById = await getGaggleById(db, id);

  if (!gaggleById) {
    throw new HTTPException(404, {
      message: `No Gaggle with ID ${id}`,
    });
  }

  const geeseByGaggleId = await db
    .select()
    .from(schema.geese)
    .where(eq(schema.geese.gaggleId, id));

  return c.json(geeseByGaggleId);
});

// Update Gaggle specified by id
gagglesApp.put(
  "/:id",
  validator("param", validateIdParam),
  validator("json", makeBodyValidator(ZGaggleInsert.parse)),
  async (c) => {
    const { id } = c.req.valid("param");
    const gaggleData = c.req.valid("json");

    const db = drizzle(c.env.DB);
    const gaggleById = await getGaggleById(db, id);

    if (!gaggleById) {
      throw new HTTPException(404, {
        message: `No Gaggle with ID ${id}`,
      });
    }

    const updatedGaggle: schema.Gaggle = {
      ...gaggleById,
      ...gaggleData,
    };

    return c.json(updatedGaggle);
  },
);

// Delete Gaggle specified by id
gagglesApp.delete("/:id", validator("param", validateIdParam), async (c) => {
  const { id } = c.req.valid("param");

  const db = drizzle(c.env.DB);
  const gaggleById = await getGaggleById(db, id);

  if (!gaggleById) {
    throw new HTTPException(404, {
      message: `No Gaggle with ID ${id}`,
    });
  }

  return c.body(null, 204);
});

export default gagglesApp;

async function getGaggleById(db: DrizzleClient, id: number) {
  const gagglesById = await db
    .select()
    .from(schema.gaggles)
    .where(eq(schema.gaggles.id, id));

  if (gagglesById.length > 1) {
    new HTTPException(500, {
      message: "Unique Constraint Conflict",
    });
  }

  return gagglesById.at(0);
}
