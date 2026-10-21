import test from "node:test";
import assert from "node:assert/strict";
import {
  hashPassword,
  verifyPassword,
  token,
  keyedDigest,
  csvCell,
} from "../src/lib/crypto.mjs";
test("password hashes are salted and reject incorrect passwords and malformed parameters", async () => {
  const value = token();
  const first = await hashPassword(value),
    second = await hashPassword(value);
  assert.notEqual(first, second);
  assert.equal(await verifyPassword(value, first), true);
  assert.equal(await verifyPassword(value + "x", first), false);
  assert.equal(
    await verifyPassword(value, "scrypt$1048576$8$1$bad$bad"),
    false,
  );
});
test("session tokens carry 256 bits and keyed digests change with secrets", () => {
  const value = token();
  assert.equal(Buffer.from(value, "base64url").length, 32);
  assert.notEqual(keyedDigest(value, "a"), keyedDigest(value, "b"));
});
test("CSV neutralizes spreadsheet formula injection including leading whitespace", () => {
  for (const value of [
    "=1+1",
    "+SUM(A1)",
    "-10",
    "@SUM(1)",
    '  =HYPERLINK("evil")',
    "\tformula",
  ])
    assert.ok(csvCell(value).startsWith("\"'"));
  assert.equal(csvCell('ordinary "text"'), '"ordinary ""text"""');
});
