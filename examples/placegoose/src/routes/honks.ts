import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { validator } from "hono/validator";
import { z } from "zod";

import {
  getGooseByIdExists,
  getHonkById,
  getHonkByIdExists,
} from "../controllers";
import { getDb } from "../db";
import * as schema from "../db/schema";
import { generateId } from "../lib/utils";
import {
  makeBodyValidator,
  validateId,
  validateIdParam,
} from "../lib/validation";
import type { AppType } from "../types";

const ZHonkInsert = z.object({
  gooseId: z.number(),
  decibels: z.number(),
});

const ZHonkUpdate = ZHonkInsert.omit({ gooseId: true });

const honksApp = new Hono<AppType>();

// Get all Honks (or just those from Goose specified by gooseId)
honksApp.get(
  "/",
  validator("query", (query) => {
    const gooseIdQuery = query.gooseId;

    return {
      gooseId: gooseIdQuery ? validateId(gooseIdQuery) : undefined,
    };
  }),
  async (c) => {
    const { gooseId } = c.req.valid("query");

    const db = getDb(c.env.DB);
    let honks: schema.Honk[];

    if (gooseId) {
      const gooseExists = await getGooseByIdExists(db, gooseId);

      if (!gooseExists) {
        throw new HTTPException(404, {
          message: `No Geese with ID ${gooseId}`,
        });
      }

      honks = await db
        .select()
        .from(schema.honks)
        .where(eq(schema.honks.gooseId, gooseId));
    } else {
      honks = await db.select().from(schema.honks);
    }

    return c.json(honks);
  },
);

// Create a new Honk
honksApp.post(
  "/",
  validator("json", makeBodyValidator(ZHonkInsert.parse)),
  async (c) => {
    const honkData = c.req.valid("json");
    const gooseId = honkData.gooseId;

    const db = getDb(c.env.DB);
    const gooseExists = await getGooseByIdExists(db, gooseId);

    if (!gooseExists) {
      throw new HTTPException(404, {
        message: `No Geese with ID ${gooseId}`,
      });
    }

    const newHonk: schema.Honk = {
      id: generateId(),
      ...honkData,
    };

    return c.json(newHonk, 201);
  },
);

// Get a Honk by specified id
honksApp.get("/:id", validator("param", validateIdParam), async (c) => {
  const { id } = c.req.valid("param");

  const db = getDb(c.env.DB);
  const honkById = await getHonkById(db, id);

  if (!honkById) {
    throw new HTTPException(404, {
      message: `No Honks with ID ${id}`,
    });
  }

  return c.json(honkById);
});

// Modify Honk with specified id
honksApp.patch(
  "/:id",
  validator("param", validateIdParam),
  validator("json", makeBodyValidator(ZHonkUpdate.parse)),
  async (c) => {
    const { id } = c.req.valid("param");
    const { decibels } = c.req.valid("json");

    const includesGooseId = Boolean((await c.req.json()).gooseId);
    if (includesGooseId) {
      throw new HTTPException(403, {
        message: "Honks are read-only properties",
      });
    }

    const db = getDb(c.env.DB);
    const honkById = await getHonkById(db, id);

    if (!honkById) {
      throw new HTTPException(404, {
        message: `No Honks with ID ${id}`,
      });
    }

    const updatedHonk: schema.Honk = {
      ...honkById,
      ...(decibels && { decibels }),
    };

    return c.json(updatedHonk);
  },
);

// Update the Honk with the specified id
honksApp.put(
  "/:id",
  validator("param", validateIdParam),
  validator("json", makeBodyValidator(ZHonkUpdate.parse)),
  async (c) => {
    const { id } = c.req.valid("param");
    const { decibels } = c.req.valid("json");

    const includesGooseId = Boolean((await c.req.json()).gooseId);
    if (includesGooseId) {
      throw new HTTPException(403, {
        message: "Honks are read-only properties",
      });
    }

    const db = getDb(c.env.DB);
    const honkById = await getHonkById(db, id);

    if (!honkById) {
      throw new HTTPException(404, {
        message: `No Honks with ID ${id}`,
      });
    }

    const updatedHonk: schema.Honk = {
      ...honkById,
      decibels,
    };

    return c.json(updatedHonk);
  },
);

// Delete the Honk with the specified id
honksApp.delete("/:id", validator("param", validateIdParam), async (c) => {
  const { id } = c.req.valid("param");

  const db = getDb(c.env.DB);
  const honkExists = await getHonkByIdExists(db, id);

  if (!honkExists) {
    throw new HTTPException(404, {
      message: `No Honks with ID ${id}`,
    });
  }

  return c.body(null, 204);
});

export default honksApp;
