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

describe("Index", () => {
    it("Returns landing text", async () => {
        const response = await client.index.$get();
        expect(response.status).toBe(200);

        const data = await response.text();
        expect(data).toBe("Honc from above! ☁️🪿");
    })
})

describe("Get all users", () => {
    it("Returns an an array of users", async () => {
        await client.api.user.$post({
            json: mockUserData
        });
        
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

describe("Create user", () => {
    it("Returns an error if no User Data is sent", async () => {
        const response = await client.api.user.$post();
        expect(response.status).toBe(500);
    });

    it("Inserts and returns a User if payload is valid", async () => {
        const postResponse = await client.api.user.$post({
            json: mockUserData
        });

        expect(postResponse.status).toBe(200);
        expect(await postResponse.json()).toEqual({
            id: expect.any(Number),
            createdAt: expect.stringMatching(DATE_REGEX),
            updatedAt: expect.stringMatching(DATE_REGEX),
            ...mockUserData
        });

        const getResponse = await client.api.users.$get();
        expect(getResponse.status).toBe(200);

        const data = await getResponse.json();
        expect(data.users).toContainEqual({
            id: expect.any(Number),
            createdAt: expect.stringMatching(DATE_REGEX),
            updatedAt: expect.stringMatching(DATE_REGEX),
            ...mockUserData
        });
    });
});