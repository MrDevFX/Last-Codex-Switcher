import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetDir = path.join(root, "build", "tauri-target");

fs.mkdirSync(path.dirname(targetDir), { recursive: true });

const run = (command, args) => {
  const executable =
    process.platform === "win32" && command === "corepack" ? "corepack.cmd" : command;
  const result = spawnSync(executable, args, {
    cwd: root,
    env: {
      ...process.env,
      CARGO_TARGET_DIR: targetDir,
    },
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

run("corepack", ["pnpm", "build"]);
run("cargo", ["run", "--manifest-path", "src-tauri/Cargo.toml", "--bin", "codex-web"]);
