import type { Context } from "hono";
import { ServiceError } from "./errors";

/**
 * @returns Validation fn for Hono body validator, responsible
 * for processing payload errors
 */
export function makeBodyValidator<T extends Record<string, unknown>>(
  parse: (data: unknown) => T,
) {
  return (body: unknown) => {
    try {
      return parse(body);
    } catch (error) {
      console.error(error);
      throw ServiceError.invalidRequest("Invalid Payload", { cause: error });
    }
  };
}

/**
 * Verify that query or param value is valid id, and
 * coerce to number. Throws if id is missing or invalid
 * @returns Valid number id
 */
export function validateId(value: string | string[]) {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    throw ServiceError.invalidRequest("ID values must be positive integers");
  }

  return Number(value);
}

/**
 * Validation fn for hono param validator. Throws if id is missing
 * or invalid
 */
export function validateIdParam(params: Record<string, string>, c: Context) {
  const idParam = params.id;

  if (!idParam) {
    throw ServiceError.invalidRequest(
      `The 'id' parameter is required: ${c.req.path}`,
    );
  }

  return { id: validateId(idParam) };
}
