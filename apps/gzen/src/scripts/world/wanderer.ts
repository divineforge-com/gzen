import * as THREE from "three";

export type Wanderer = {
  root: THREE.Group;
  nose: THREE.Object3D;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
};

const robeMat = new THREE.MeshLambertMaterial({ color: 0xf4efe6, flatShading: true });
const skinMat = new THREE.MeshLambertMaterial({ color: 0xe0b896, flatShading: true });
const hairMat = new THREE.MeshLambertMaterial({ color: 0x2a241f, flatShading: true });
const shoeMat = new THREE.MeshLambertMaterial({ color: 0xd9cbb8, flatShading: true });

function mesh(geo: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number): THREE.Mesh {
  const m = new THREE.Mesh(geo, material);
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}

/** Low-poly wanderer. Feet at y=0. Local forward is −z. The nose sits on −z and is the facing oracle. */
export function makeWanderer(sashColor: number): Wanderer {
  const root = new THREE.Group();
  root.name = "wanderer";
  const sashMat = new THREE.MeshLambertMaterial({ color: sashColor, flatShading: true });

  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.1, 0.46, 0);
  leftLeg.add(mesh(new THREE.BoxGeometry(0.14, 0.38, 0.14), skinMat, 0, -0.19, 0));
  leftLeg.add(mesh(new THREE.BoxGeometry(0.16, 0.08, 0.28), shoeMat, 0, -0.4, -0.02));
  root.add(leftLeg);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.1, 0.46, 0);
  rightLeg.add(mesh(new THREE.BoxGeometry(0.14, 0.38, 0.14), skinMat, 0, -0.19, 0));
  rightLeg.add(mesh(new THREE.BoxGeometry(0.16, 0.08, 0.28), shoeMat, 0, -0.4, -0.02));
  root.add(rightLeg);

  root.add(mesh(new THREE.CylinderGeometry(0.22, 0.34, 0.55, 6), robeMat, 0, 0.74, 0));
  root.add(mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.1, 6), sashMat, 0, 0.98, 0));
  root.add(mesh(new THREE.BoxGeometry(0.12, 0.22, 0.08), sashMat, 0.02, 0.86, -0.18));
  root.add(mesh(new THREE.BoxGeometry(0.44, 0.36, 0.26), robeMat, 0, 1.24, 0));
  root.add(mesh(new THREE.BoxGeometry(0.12, 0.36, 0.12), robeMat, -0.28, 1.18, 0));
  root.add(mesh(new THREE.BoxGeometry(0.12, 0.36, 0.12), robeMat, 0.28, 1.18, 0));
  root.add(mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), skinMat, -0.28, 0.96, -0.02));
  root.add(mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), skinMat, 0.28, 0.96, -0.04));
  root.add(mesh(new THREE.BoxGeometry(0.28, 0.28, 0.26), skinMat, 0, 1.64, 0));
  root.add(mesh(new THREE.BoxGeometry(0.3, 0.14, 0.28), hairMat, 0, 1.8, 0.02));

  const nose = mesh(new THREE.BoxGeometry(0.05, 0.05, 0.08), hairMat, 0, 1.64, -0.16);
  nose.name = "nose";
  root.add(nose);

  return { root, nose, leftLeg, rightLeg };
}

/** Horizontal nose direction in world space. Independent of the yaw formula. */
export function wandererFront(wanderer: Wanderer): THREE.Vector3 {
  const noseW = new THREE.Vector3();
  const headW = wanderer.root.localToWorld(new THREE.Vector3(0, 1.64, 0));
  wanderer.nose.getWorldPosition(noseW);
  return noseW.sub(headW).setY(0).normalize();
}
