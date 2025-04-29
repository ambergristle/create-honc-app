import { env } from "cloudflare:test";
import { testClient } from 'hono/testing'
import { describe, it, expect } from "vitest";

import app from "../src";

const client = testClient(app, env);

const DATE_REGEX = /\d{4}-[01]\d-[0-3]\d\s[0-2]\d:[0-5]\d:[0-5]\d/;

const mockUserData = {
    name: "Emma Goldman",
    email: "egoldman@email.com"
};

describe("Create user", () => {
    it("Returns an error if no User Data is sent", async () => {
        const response = await client.api.user.$post();
        expect(response.status).toBe(500);
    });

    it("Returns newly created user", async () => {
        const response = await client.api.user.$post({
            json: mockUserData
        });

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            id: expect.any(Number),
            createdAt: expect.stringMatching(DATE_REGEX),
            updatedAt: expect.stringMatching(DATE_REGEX),
            ...mockUserData
        });
    });

    it("Inserts the created user", async () => {
        const response = await client.api.users.$get();
        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data.users).toContainEqual({
            id: expect.any(Number),
            createdAt: expect.stringMatching(DATE_REGEX),
            updatedAt: expect.stringMatching(DATE_REGEX),
            ...mockUserData
        });
    })
});

describe("Get all users", () => {
    it("Returns an an array of users", async () => {
        const response = await client.api.users.$get();
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(data).toEqual({
            users: expect.any(Array),
        });

        expect(data.users.length).toBeGreaterThan(0);

        data.users.forEach((user) => {
            expect(user).toEqual({
                id: expect.any(Number),
                createdAt: expect.stringMatching(DATE_REGEX),
                updatedAt: expect.stringMatching(DATE_REGEX),
                name: expect.any(String),
                email: expect.any(String),
            });
        });
    });
});