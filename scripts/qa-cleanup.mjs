import { readFile, unlink } from "node:fs/promises";
import { spawnSync } from "node:child_process";
try {
  const qa = JSON.parse(await readFile("qa/runtime.json", "utf8"));
  if (!/^georgia-pro-qa-\d+$/.test(qa.container)) {
    throw new Error("Unexpected container name; no cleanup performed.");
  }
  const inspected = spawnSync(
    "docker",
    [
      "inspect",
      "--format",
      '{{index .Config.Labels "georgiapro.qa"}}',
      qa.container,
    ],
    { encoding: "utf8" },
  );
  if (inspected.stdout.trim() === "true") {
    const stopped = spawnSync("docker", ["stop", qa.container], {
      encoding: "utf8",
    });
    if (stopped.status !== 0)
      throw new Error("Unable to stop the QA container.");
  }
  await unlink("qa/runtime.json");
  console.log(
    "Isolated QA container and temporary QA credential file cleaned up.",
  );
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  console.log("No temporary QA runtime file remains.");
}
