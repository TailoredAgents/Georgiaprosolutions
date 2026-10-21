import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { readFile, writeFile } from "node:fs/promises";
import { hashPassword, token } from "../src/lib/crypto.mjs";
const rl = createInterface({ input: stdin, output: stdout });
const email = (await rl.question("Administrator email: ")).trim().toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  rl.close();
  throw new Error("Enter a valid administrator email.");
}
// Generate a strong password instead of echoing a user-entered secret in a terminal prompt.
const password = token().slice(0, 28);
const hash = await hashPassword(password);
const secret = token();
let env = "";
try {
  env = await readFile(".env.local", "utf8");
} catch {}
for (const [key, value] of Object.entries({
  ADMIN_EMAIL: email,
  ADMIN_PASSWORD_HASH: hash,
  SESSION_SECRET: secret,
})) {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");
  env = pattern.test(env)
    ? env.replace(pattern, () => line)
    : env + (env.endsWith("\n") || !env ? "" : "\n") + line + "\n";
}
await writeFile(".env.local", env, { mode: 0o600 });
rl.close();
console.log("\nAdministrator configured in ignored .env.local.\n");
console.log(`Email: ${email}\nGenerated password: ${password}\n`);
console.log(
  "Save this password in your password manager. It is shown only now. Restart the server.",
);
console.log(
  "For Render, copy ADMIN_EMAIL, ADMIN_PASSWORD_HASH, and SESSION_SECRET into private service environment variables. Never commit .env.local.",
);
console.log(
  "Changing credentials invalidates previous sessions. Re-running this command rotates the password and session secret.",
);
