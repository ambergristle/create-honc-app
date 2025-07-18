import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { cancel, log } from "@clack/prompts";
import { CANCEL_MESSAGE } from "./const";

export function getPackageManager() {
  return process.env.npm_config_user_agent?.split("/").at(0);
}

export async function runShell(cwd: string, commands: string[]): Promise<void> {
  const commandStr = commands.join(" ");

  return new Promise((resolve, reject) => {
    const child = spawn(commandStr, [], { cwd, shell: true, timeout: 60000 });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    // Swallow stdout and stderr
    child.stdout.on("data", () => {});
    child.stderr.on("data", () => {});
  });
}

export function handleError(error: Error) {
  log.error(`exiting with an error: ${error.message}`);
  // HACK - Allow us to log the error in more depth if `CHA_LOG_LEVEL` is set to `debug`
  if (process?.env?.CHA_LOG_LEVEL === "debug") {
    console.error("\n\n*********LOGGING VERBOSE ERROR*********\n");
    console.error(error);
    console.error(
      "\n\n*********LOGGING VERBOSE ERROR AGAIN, BUT AS JSON*********\n",
    );
    console.error(JSON.stringify(error, null, 2));
  }
  process.exit(1);
}

export function handleCancel() {
  cancel(CANCEL_MESSAGE);
  process.exit(0);
}

export function safeReadFile(path: string) {
  try {
    return readFileSync(path, "utf-8");
  } catch (_error) {
    return null;
  }
}
