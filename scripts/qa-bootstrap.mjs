import { mkdir, writeFile, readFile } from "node:fs/promises";
import { hashPassword, token } from "../src/lib/crypto.mjs";
import { spawnSync } from "node:child_process";
const email = "qa-admin@example.invalid",
  password = token(),
  secret = token();
const hash = await hashPassword(password);
const dbPassword = token();
try {
  const old = JSON.parse(await readFile("qa/runtime.json", "utf8"));
  if (/^georgia-pro-qa-\d+$/.test(old.container)) {
    const label = spawnSync(
      "docker",
      [
        "inspect",
        "--format",
        '{{index .Config.Labels "georgiapro.qa"}}',
        old.container,
      ],
      { encoding: "utf8" },
    );
    if (label.stdout.trim() === "true")
      spawnSync("docker", ["stop", old.container], { encoding: "utf8" });
  }
} catch {}
const name = "georgia-pro-qa-" + Date.now();
// A new isolated test container; no pre-existing database or container is touched.
const result = spawnSync(
  "docker",
  [
    "run",
    "--detach",
    "--rm",
    "--label",
    "georgiapro.qa=true",
    "--name",
    name,
    "-e",
    "POSTGRES_USER=gpsqa",
    "-e",
    `POSTGRES_PASSWORD=${dbPassword}`,
    "-e",
    "POSTGRES_DB=gpsqa",
    "-p",
    "127.0.0.1:0:5432",
    "postgres:16",
  ],
  { encoding: "utf8" },
);
if (result.status !== 0)
  throw new Error(
    "Could not start isolated PostgreSQL test container: " + result.stderr,
  );
const portResult = spawnSync("docker", ["port", name, "5432/tcp"], {
  encoding: "utf8",
});
const port = portResult.stdout.trim().split(":").at(-1);
await mkdir("qa", { recursive: true });
await writeFile(
  "qa/runtime.json",
  JSON.stringify({
    email,
    password,
    hash,
    secret,
    container: name,
    databaseUrl: `postgresql://gpsqa:${dbPassword}@127.0.0.1:${port}/gpsqa`,
  }),
  { mode: 0o600 },
);
console.log(
  "Isolated QA database started; ephemeral test credentials generated. No credentials printed.",
);
for (let i = 0; i < 30; i++) {
  const ready = spawnSync(
    "docker",
    ["exec", name, "pg_isready", "-U", "gpsqa"],
    { encoding: "utf8" },
  );
  if (ready.status === 0) break;
  await new Promise((r) => setTimeout(r, 500));
}
const migrated = spawnSync(process.execPath, ["scripts/migrate.mjs"], {
  encoding: "utf8",
  env: {
    ...process.env,
    DATABASE_URL: `postgresql://gpsqa:${dbPassword}@127.0.0.1:${port}/gpsqa`,
    DATABASE_SSL: "false",
  },
});
if (migrated.status !== 0) throw new Error(migrated.stderr);
console.log(migrated.stdout);
