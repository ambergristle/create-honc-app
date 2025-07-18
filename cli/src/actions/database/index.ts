import type { Context } from "@/context";
import { confirm } from "@clack/prompts";
import { showD1SetupInstructions } from "./d1";
import { runNeonSetup, showNeonSetupInstructions } from "./neon";
import { showSupabaseSetupInstructions } from "./supabase";

export async function promptDatabase(ctx: Context) {
  switch (ctx.template) {
    case "supabase": {
      ctx.database = "supabase";
      break;
    }
    case "d1": {
      ctx.database = "d1";
      break;
    }
    case "neon": {
      ctx.database = "neon";
      const confirmNeonSetup = await confirm({
        message:
          "The selected template uses Neon, do you want the create-honc-app to set up the connection string for you?",
        initialValue: true,
      });

      if (typeof confirmNeonSetup === "boolean" && confirmNeonSetup) {
        ctx.flags.push("setup-neon");
      }

      // we're returning here so that in case the value isCancel we can handle it
      return confirmNeonSetup;
    }
  }

  return;
}

export async function actionDatabase(ctx: Context) {
  if (ctx.database === "supabase") {
    showSupabaseSetupInstructions();
    return;
  }
  if (ctx.database === "d1") {
    showD1SetupInstructions();
    return;
  }

  if (ctx.database === "neon") {
    if (ctx.flags.includes("setup-neon")) {
      const result = await runNeonSetup(ctx);
      return result;
    }

    showNeonSetupInstructions();

    return;
  }

  return;
}

export function getDatabasePreamble(ctx: Context) {
  switch (ctx.database) {
    case "supabase":
      return "Once you've added your connection string, set up the database using the following command:";
    case "d1":
      return "You can now navigate to the project folder and run the following to set up the database:";
    case "neon": {
      return ctx.flags.includes("setup-neon")
        ? "You can now navigate to the project folder and run the following to set up the database:"
        : "Once you've added your connection string, set up the database using the following command:";
    }
    default:
      return "";
  }
}
