export const apiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Placegoose API",
    description:
      "A free online REST API for moments when you just need some honkin data!",
    version: "1.0.0",
  },
  servers: [
    {
      url: "https://placegoose.fp.dev",
      description: "Production server",
    },
  ],
  paths: {
    "/gaggles": {
      get: {
        summary: "List all gaggles",
        description: "Returns a list of gaggles",
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Gaggle",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new gaggle",
        description: "Creates a new gaggle (note: changes aren't persisted)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GaggleInput",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Gaggle created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Gaggle",
                },
              },
            },
          },
          "400": {
            description: "Invalid input",
          },
        },
      },
    },
    "/gaggles/{id}": {
      get: {
        summary: "Get a gaggle by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Gaggle",
                },
              },
            },
          },
          "404": {
            description: "Gaggle not found",
          },
        },
      },
      put: {
        summary: "Update a gaggle",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GaggleInput",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Gaggle updated successfully",
          },
          "404": {
            description: "Gaggle not found",
          },
        },
      },
      delete: {
        summary: "Delete a gaggle",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "204": {
            description: "Gaggle deleted successfully",
          },
          "404": {
            description: "Gaggle not found",
          },
        },
      },
    },
    "/geese": {
      get: {
        summary: "List all geese",
        description: "Returns a list of geese",
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Goose",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new goose",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GooseInput",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Goose created successfully",
          },
          "400": {
            description: "Invalid input",
          },
        },
      },
    },
    "/geese/{id}": {
      get: {
        summary: "Get a goose by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Goose",
                },
              },
            },
          },
          "404": {
            description: "Goose not found",
          },
        },
      },
      put: {
        summary: "Update a goose",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/GooseInput",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Goose updated successfully",
          },
          "404": {
            description: "Goose not found",
          },
        },
      },
      delete: {
        summary: "Delete a goose",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "204": {
            description: "Goose deleted successfully",
          },
          "404": {
            description: "Goose not found",
          },
        },
      },
    },
    "/honks": {
      get: {
        summary: "List all honks",
        description: "Returns a list of honks",
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Honk",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new honk",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/HonkInput",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Honk created successfully",
          },
          "400": {
            description: "Invalid input",
          },
        },
      },
    },
    "/honks/{id}": {
      get: {
        summary: "Get a honk by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Honk",
                },
              },
            },
          },
          "404": {
            description: "Honk not found",
          },
        },
      },
      put: {
        summary: "Update a honk",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/HonkInput",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Honk updated successfully",
          },
          "404": {
            description: "Honk not found",
          },
        },
      },
      delete: {
        summary: "Delete a honk",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          "204": {
            description: "Honk deleted successfully",
          },
          "404": {
            description: "Honk not found",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Gaggle: {
        type: "object",
        required: ["id", "name"],
        properties: {
          id: {
            type: "integer",
            example: 1,
          },
          name: {
            type: "string",
            example: "The Honking Highlands Herd",
          },
          territory: {
            type: "string",
            example: "The Marshlands of Echoing Honks",
          },
        },
      },
      GaggleInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: {
            type: "string",
            example: "The Honking Highlands Herd",
          },
          territory: {
            type: "string",
            example: "The Marshlands of Echoing Honks",
          },
        },
      },
      Goose: {
        type: "object",
        required: ["id", "name", "isMigratory"],
        properties: {
          id: {
            type: "integer",
            example: 1,
          },
          gaggleId: {
            type: "integer",
            example: 2,
          },
          name: {
            type: "string",
            example: "Goose Lightning",
          },
          isMigratory: {
            type: "boolean",
            example: true,
          },
          mood: {
            type: "string",
            enum: ["waddling", "stoic", "haughty", "alarmed", "hangry"],
            example: "waddling",
          },
        },
      },
      GooseInput: {
        type: "object",
        required: ["name", "isMigratory"],
        properties: {
          gaggleId: {
            type: "integer",
            example: 2,
          },
          name: {
            type: "string",
            example: "Goose Lightning",
          },
          isMigratory: {
            type: "boolean",
            example: true,
          },
          mood: {
            type: "string",
            enum: ["waddling", "stoic", "haughty", "alarmed", "hangry"],
            example: "waddling",
          },
        },
      },
      Honk: {
        type: "object",
        required: ["id", "gooseId", "decibels"],
        properties: {
          id: {
            type: "integer",
            example: 1,
          },
          gooseId: {
            type: "integer",
            example: 16,
          },
          decibels: {
            type: "integer",
            minimum: 50,
            maximum: 120,
            example: 104,
          },
        },
      },
      HonkInput: {
        type: "object",
        required: ["gooseId", "decibels"],
        properties: {
          gooseId: {
            type: "integer",
            example: 16,
          },
          decibels: {
            type: "integer",
            minimum: 50,
            maximum: 120,
            example: 104,
          },
        },
      },
    },
  },
};

export default apiSpec;
