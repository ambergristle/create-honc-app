import { PROJECT_NAME } from "./const";
import type { Flags, Template } from "./types";
import { getPackageManager } from "./utils";

export interface Context {
  cwd: string;
  packageManager: string;
  name: string;
  path?: string;
  description?: string;
  template?: Template;
  useOpenAPI?: boolean;
  database?: Template;
  flags: Flags;
  databaseConnectionString?: string;

  indexFile?: string;
  schemaFile?: string;
  seedFile?: string;
}

export function initContext(): Context {
  const projectName = parseProjectName(process.argv);

  return {
    cwd: process.cwd(),
    name: projectName ?? PROJECT_NAME,
    packageManager: getPackageManager() ?? "npm",
    flags: [],
  };
}

/**
 * Checks first (non-system) argument for existence, ignoring flags
 * @param args - An array of command line arguments.
 * @returns The `string` project name if matched, or `undefined`
 */
function parseProjectName(args: string[]): string | undefined {
  const projectName = args.at(2);

  if (!projectName || projectName.startsWith("-")) {
    return undefined;
  }

  return projectName;
}
