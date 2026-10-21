import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
const qa = JSON.parse(await readFile("qa/runtime.json", "utf8"));
for (const mode of ["preview", "production"]) {
  const result = spawnSync(
    process.execPath,
    ["node_modules/next/dist/bin/next", "build"],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        NEXT_DIST_DIR:
          mode === "preview" ? ".next-qa-preview" : ".next-qa-live",
        SITE_MODE: mode,
        SITE_URL: `http://localhost:${mode === "preview" ? 43188 : 43189}`,
        ADMIN_EMAIL: qa.email,
        ADMIN_PASSWORD_HASH: qa.hash,
        SESSION_SECRET: qa.secret,
        DATABASE_URL: mode === "production" ? qa.databaseUrl : "",
        DATABASE_SSL: "false",
        ANALYTICS_ENABLED: mode === "production" ? "true" : "false",
        NEXT_PUBLIC_ANALYTICS_ENABLED: mode === "production" ? "true" : "false",
        ALLOW_INDEXING: "false",
      },
    },
  );
  if (result.status !== 0) process.exit(result.status || 1);
}
