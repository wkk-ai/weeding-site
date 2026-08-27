import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const disabledDir = path.join(root, ".preview-disabled");

const toDisable = [
  "src/app/api",
  "src/app/app",
  "src/app/s",
];

function disableRoutes() {
  rmSync(disabledDir, { recursive: true, force: true });
  mkdirSync(disabledDir, { recursive: true });

  for (const rel of toDisable) {
    const full = path.join(root, rel);
    if (!existsSync(full)) continue;
    cpSync(full, path.join(disabledDir, rel), { recursive: true });
    rmSync(full, { recursive: true, force: true });
  }
}

function restoreRoutes() {
  if (!existsSync(disabledDir)) return;

  for (const rel of toDisable) {
    const from = path.join(disabledDir, rel);
    const to = path.join(root, rel);
    if (!existsSync(from)) continue;
    rmSync(to, { recursive: true, force: true });
    cpSync(from, to, { recursive: true });
  }

  rmSync(disabledDir, { recursive: true, force: true });
}

disableRoutes();
rmSync(path.join(root, ".next"), { recursive: true, force: true });

const build = spawnSync("npx", ["next", "build", "--webpack"], {
  cwd: root,
  stdio: "inherit",
  env: {
    ...process.env,
    STATIC_EXPORT: "1",
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL ?? "https://wedding.worldhealthshop.com",
    NEXT_PUBLIC_APP_DOMAIN:
      process.env.NEXT_PUBLIC_APP_DOMAIN ?? "wedding.worldhealthshop.com",
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://your-project.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "preview-mode",
  },
});

restoreRoutes();

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

console.log("Static preview build complete: out/");
