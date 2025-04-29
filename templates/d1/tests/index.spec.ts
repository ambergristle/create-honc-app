import { env } from "cloudflare:test";
import { testClient } from 'hono/testing'
import { describe, it, expect } from "vitest";

import app from "../src";

const client = testClient(app, env);

const DATE_REGEX = /\d{4}-[01]\d-[0-3]\d\s[0-2]\d:[0-5]\d:[0-5]\d/;

const mockUser = (userData: { name: string; email: string; }) => ({
    id: expect.any(Number),
    createdAt: expect.stringMatching(DATE_REGEX),
    updatedAt: expect.stringMatching(DATE_REGEX),
    ...userData
});

describe("Get all users", () => {
    it("Returns an an array of users", async () => {
        const response = await client.api.users.$get();
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            users: []
        });
    });
});

describe("Create user", () => {
    it("Returns newly created user", async () => {
        const userData = {
            name: "Emma Goldman",
            email: "egoldman@email.com"
        };

        const response = await client.api.user.$post({
            json: userData
        });

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual(mockUser(userData))
    });
});