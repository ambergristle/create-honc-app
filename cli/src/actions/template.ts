import { join } from "node:path";
import type { Context } from "@/context";
import type { Template } from "@/types";
import { safeReadFile } from "@/utils";
import { confirm, log, select, spinner } from "@clack/prompts";
import { downloadTemplate } from "giget";

export async function promptTemplate(ctx: Context) {
  try {
    const result = await select({
      message: "Which template do you want to use?",
      options: [
        {
          value: "base",
          label: "Neon template",
          hint: "A barebones HONC project with a Neon database",
        },
        {
          value: "base-supa",
          label: "(Supa)base template",
          hint: "A barebones HONC project with a Supabase database",
        },
        {
          value: "sample-d1",
          label: "D1 base template",
          hint: "A barebones HONC project with a D1 Database",
        },
      ],
      initialValue: "base",
    });

    if (typeof result === "string") {
      ctx.template = result as Template;
    }

    return result;
  } catch (error) {
    return error;
  }
}

export async function promptOpenAPI(ctx: Context) {
  const confirmOpenAPI = await confirm({
    message: "Do you need an OpenAPI spec?",
    initialValue: false,
    active: "No",
  });

  if (typeof confirmOpenAPI === "boolean" && confirmOpenAPI) {
    ctx.useOpenAPI = confirmOpenAPI;
  }
}

export async function actionTemplate(ctx: Context) {
  if (!ctx.path) {
    log.error("Path is required");
    process.exit(1);
  }

  const s = spinner();
  s.start("Setting up template...");

  let templateUrl: string;

  switch (ctx.template) {
    case "base":
      templateUrl = ctx.useOpenAPI
        ? "github:fiberplane/create-honc-app/templates/base-openapi"
        : "github:fiberplane/create-honc-app/templates/base";
      break;
    case "base-supa":
      templateUrl = ctx.useOpenAPI
        ? "github:fiberplane/create-honc-app/templates/base-supa-openapi"
        : "github:fiberplane/create-honc-app/templates/base-supa";
      break;
    case "sample-d1":
      templateUrl = ctx.useOpenAPI
        ? "github:fiberplane/create-honc-app/templates/d1-openapi"
        : "github:fiberplane/create-honc-app/templates/d1";
      break;
    default:
      return new Error(`Invalid template selected: ${ctx.template}`);
  }

  try {
    await downloadTemplate(templateUrl, {
      cwd: ctx.cwd,
      dir: ctx.path,
      force: true,
      provider: "github",
    });

    const projectDir = join(ctx.cwd, ctx.path);

    const indexFile = safeReadFile(join(projectDir, "src", "index.ts"));
    const schemaFile = safeReadFile(join(projectDir, "src", "db", "schema.ts"));
    const seedFile = safeReadFile(join(projectDir, "seed.ts"));

    ctx.indexFile = indexFile?.toString();
    ctx.schemaFile = schemaFile?.toString();
    ctx.seedFile = seedFile?.toString();
  } catch (error) {
    return error;
  }

  s.stop();
  log.success("Template set up successfully");
  return;
}
