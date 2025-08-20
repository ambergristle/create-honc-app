## 🪿 HONC

This is a project created with the `create-honc-app` template.

Learn more about the HONC stack on the [website](https://honc.dev) or the main [repo](https://github.com/fiberplane/create-honc-app).

> There is also an [Awesome HONC collection](https://github.com/fiberplane/awesome-honc) with further guides, use cases and examples.

This template uses a remote [Supabase](https://supabase.com/) (postgres) database for both local development and deployment. Check out our docs learn more about [working with Supabase databases](https://docs.honc.dev/stack/databases/#supabase)!

### Getting started

Create a Supabase account and database if you haven't already, then add your database URL to a `.dev.vars` file (see: `.dev.vars.example`).

```sh
DATABASE_URL="postgres://username.projectref:password@region.pooler.supabase.com:port/postgres"
```

Generate and apply migrations, and (optionally) seed the database:

```sh
npm run db:generate # Generate migration files
npm run db:migrate  # Apply migrations to (local) database
npm run db:seed     # Seed the (local) database with random data
```

Or just run `db:setup` to execute all three scripts!

Run the development server:

```sh
npm run dev
```

### OpenAPI

This template uses the [`hono-openapi` middleware](github.com/rhinobase/hono-openapi) to generate an OpenAPI spec for your app. The raw spec is served from `/openapi.json`. To explore your API interactively, run `npm run dev` and go to `http://localhost:8787/fp`.

### Project structure

```#
├── drizzle            # Migrations and database helpers
├── src
│   ├── index.ts       # Hono app entry point
│   └── db
│       └── schema.ts  # Database schema
├── tests              # Test suites and configuration
├── .dev.vars.example  # Example .dev.vars file
├── .prod.vars.example # Example .prod.vars file
├── biome.json         # Biome lint and format configuration
├── drizzle.config.ts  # Drizzle configuration
├── seed.ts            # Script to seed the db
├── package.json
├── tsconfig.json      # TypeScript configuration
├── vitest.config.ts   # Vitest configuration
└── wrangler.toml      # Cloudflare Workers configuration
```

### Developing

When you iterate on the database schema, you'll need to generate a new migration and apply it:
```sh
npm run db:generate
npm run db:migrate
```

To format code, run:

```bash
npm run lint && npm run format
```

### Testing

This template comes with Vitest set up, and example tests to validate endpoints in `index.ts`.

First, add your test database URL to your `.dev.vars` file:

```sh
TEST_DATABASE_URL=""
```

To execute tests, run:

```sh
npm run test
```

Note that the `/tests` directory includes required module declaration and `setup` files.

The `setup` file connects to the `TEST_DATABASE_URL` set in your environment variables. It is not isolated, but the example test suite is "self-cleaning".

### Deploying

Add your production `DATABASE_URL` (and any other production secrets) to a `.prod.vars` file:

```sh
DATABASE_URL="postgres://username.projectref:password@region.pooler.supabase.com:port/postgres"
```

You can do so manually, or using the `wrangler` CLI:

```sh
npx wrangler secret put <KEY>
```

If you haven’t generated the latest migration files yet, run:
```shell
npm run db:generate
```

Afterwards, run the migration script for production:
```shell
npm run db:migrate:prod
```

You can also run the seed script for production:
```shell
npm run db:seed:prod
```

Update your `wrangler.toml` with a name appropriate to your project:

```toml
name = "my-supabase-project"
```

Finally, deploy your worker:

```sh
npm run deploy
```
