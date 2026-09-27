import * as THREE from "three";

/** Y-up, right-handed. Object3D local forward is −z.
 *  rotation.y = yaw sends that forward to (−sin yaw, 0, −cos yaw).
 *  yaw 0 faces world −z. forward × up = right, so yaw 0 has right = +x.
 */
export const UP = new THREE.Vector3(0, 1, 0);

export const WALK_SPEED = 4.2;
export const PLAYER_RADIUS = 0.42;

export type MoveInput = {
  forward: number;
  strafe: number;
  /** Radians added to yaw this step, before the wish vector is built. */
  turn: number;
};

export type Pose = {
  x: number;
  y: number;
  z: number;
  yaw: number;
};

const scratch = {
  fwd: new THREE.Vector3(),
  wish: new THREE.Vector3(),
  look: new THREE.Vector3(),
};

export function forwardFromYaw(yaw: number, out = new THREE.Vector3()): THREE.Vector3 {
  return out.set(-Math.sin(yaw), 0, -Math.cos(yaw));
}

/** Face world direction d with a −z front. d = (0,0,−1) → 0. d = (+x) → −π/2. */
export function yawToFace(x: number, z: number): number {
  return Math.atan2(-x, -z);
}

export function placeFollowCamera(camera: THREE.PerspectiveCamera, pose: Pose): void {
  const fwd = forwardFromYaw(pose.yaw, scratch.fwd);
  scratch.look.set(pose.x, pose.y + 1.3, pose.z);
  camera.position.copy(scratch.look).addScaledVector(fwd, -6.6);
  camera.position.y += 2.7;
  camera.up.set(0, 1, 0);
  camera.lookAt(scratch.look);
  camera.updateMatrixWorld();
}

export function cameraPlanarBasis(camera: THREE.Camera): { f: THREE.Vector3; r: THREE.Vector3 } {
  const f = new THREE.Vector3();
  camera.getWorldDirection(f);
  f.y = 0;
  if (f.lengthSq() < 1e-8) f.set(0, 0, -1);
  f.normalize();
  const r = new THREE.Vector3().crossVectors(f, UP);
  if (r.lengthSq() < 1e-8) r.set(1, 0, 0);
  r.normalize();
  return { f, r };
}

/**
 * One step using the camera's planar basis (forward × up = right).
 * Turn the body before calling this, then place the follow camera, then read that basis.
 * Travel yaws the body to face the wish, so heading and velocity stay one frame.
 */
export function stepPose(
  pose: Pose,
  input: Pick<MoveInput, "forward" | "strafe">,
  dt: number,
  canWalk: (x: number, z: number) => boolean,
  camForward: THREE.Vector3,
  camRight: THREE.Vector3,
): Pose {
  const wish = scratch.wish;
  wish.set(0, 0, 0);
  wish.addScaledVector(camForward, input.forward).addScaledVector(camRight, input.strafe);
  if (wish.lengthSq() > 1) wish.normalize();

  let yaw = pose.yaw;
  if (wish.lengthSq() > 1e-6) yaw = yawToFace(wish.x, wish.z);

  const dist = WALK_SPEED * Math.min(1, wish.length()) * dt;
  if (dist < 1e-6) return { ...pose, yaw };

  const nx = pose.x + wish.x * dist;
  const nz = pose.z + wish.z * dist;
  if (canWalk(nx, nz)) return { x: nx, y: pose.y, z: nz, yaw };
  if (canWalk(nx, pose.z)) return { x: nx, y: pose.y, z: pose.z, yaw };
  if (canWalk(pose.x, nz)) return { x: pose.x, y: pose.y, z: nz, yaw };
  return { x: pose.x, y: pose.y, z: pose.z, yaw };
}
