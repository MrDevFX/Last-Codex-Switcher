import { spawnSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const buildRoot = path.join(root, "build");
const targetDir = path.join(buildRoot, "tauri-target");
const localConfigPath = path.join(buildRoot, "tauri.local.build.json");
const tauriBin = require.resolve("@tauri-apps/cli/tauri.js");

const rawArgs = process.argv.slice(2);
const signed = rawArgs.includes("--signed");
const args = rawArgs.filter((arg) => arg !== "--signed");
const hasExplicitConfig =
  args.includes("--config") || args.some((arg) => arg.startsWith("--config="));

fs.mkdirSync(buildRoot, { recursive: true });

const tauriArgs = [...args];
let generatedLocalConfig = false;
if (args[0] === "build" && !signed && !hasExplicitConfig) {
  fs.writeFileSync(
    localConfigPath,
    `${JSON.stringify({ bundle: { createUpdaterArtifacts: false } }, null, 2)}\n`,
    "utf8"
  );
  generatedLocalConfig = true;
  tauriArgs.push("--config", localConfigPath);
}

const result = spawnSync(process.execPath, [tauriBin, ...tauriArgs], {
  cwd: root,
  env: {
    ...process.env,
    CARGO_TARGET_DIR: targetDir,
  },
  stdio: "inherit",
});

if (result.error) {
  console.error(result.error.message);
}

if (generatedLocalConfig) {
  fs.rmSync(localConfigPath, { force: true });
}

process.exit(result.status ?? 1);
