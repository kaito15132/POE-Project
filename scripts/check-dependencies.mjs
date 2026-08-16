import { existsSync } from "node:fs";

const requiredEntrypoints = [
  "node_modules/next/package.json",
  "node_modules/react/package.json",
  "node_modules/@prisma/client/package.json",
  "node_modules/prisma/package.json",
];

const missing = requiredEntrypoints.filter((entrypoint) => !existsSync(entrypoint));

if (missing.length > 0) {
  console.error([
    "Project dependencies are not prepared.",
    "Run `npm ci` once during the environment setup phase; do not install packages repeatedly during agent work.",
    `Missing: ${missing.join(", ")}`,
  ].join("\n"));
  process.exit(1);
}

console.log("Project dependencies are available.");
