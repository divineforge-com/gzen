import { canWalkAt, PATHS, spawnFor, ZONES } from "./zones.ts";
import { controlSelfTest } from "./createWorld.ts";

const failures = [...controlSelfTest()];

const start = { x: -32, z: 25 };
if (!canWalkAt(start.x, start.z)) failures.push("spawn is not walkable");
if (canWalkAt(0, 80)) failures.push("open sea accepted a step");

for (const zone of ZONES) {
  if (!canWalkAt(zone.altar.x, zone.altar.z)) failures.push(`${zone.id} altar is blocked`);
  if (canWalkAt(zone.blocks[0].x, zone.blocks[0].z)) failures.push(`${zone.id} building does not block`);
  const spot = spawnFor(zone);
  if (!canWalkAt(spot.x, spot.z)) failures.push(`${zone.id} teleport spot is blocked`);
}

for (const path of PATHS) {
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const x = path.ax + (path.bx - path.ax) * t;
    const z = path.az + (path.bz - path.az) * t;
    if (!canWalkAt(x, z)) failures.push(`path broken at ${x.toFixed(1)}, ${z.toFixed(1)}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("world frame self-test passed");
