import * as THREE from "three";
import { PATHS, ZONES, type ZoneDef } from "./zones.ts";

const palette = {
  water: new THREE.MeshLambertMaterial({ color: 0xb7d4e2, flatShading: true }),
  fjordWater: new THREE.MeshLambertMaterial({ color: 0x6f93a8, flatShading: true }),
  path: new THREE.MeshLambertMaterial({ color: 0xcfc3b2, flatShading: true }),
  wall: new THREE.MeshLambertMaterial({ color: 0xf7f3ec, flatShading: true }),
  roof: new THREE.MeshLambertMaterial({ color: 0x2c3a4a, flatShading: true }),
  wood: new THREE.MeshLambertMaterial({ color: 0x8a6244, flatShading: true }),
  bamboo: new THREE.MeshLambertMaterial({ color: 0x2d6b4f, flatShading: true }),
  leaf: new THREE.MeshLambertMaterial({ color: 0x3e8f62, flatShading: true }),
  willow: new THREE.MeshLambertMaterial({ color: 0x6a9a55, flatShading: true }),
  stone: new THREE.MeshLambertMaterial({ color: 0xb7b3ae, flatShading: true }),
  snow: new THREE.MeshLambertMaterial({ color: 0xf4f7f8, flatShading: true }),
  rock: new THREE.MeshLambertMaterial({ color: 0x8d8494, flatShading: true }),
  pine: new THREE.MeshLambertMaterial({ color: 0x1e3d32, flatShading: true }),
  gold: new THREE.MeshLambertMaterial({ color: 0xe5b96f, flatShading: true }),
  lantern: new THREE.MeshLambertMaterial({
    color: 0xe7a15a,
    emissive: 0xd97845,
    emissiveIntensity: 0.55,
    flatShading: true,
  }),
  altar: new THREE.MeshLambertMaterial({ color: 0x6b5b4d, flatShading: true }),
  ink: new THREE.MeshLambertMaterial({ color: 0x2f2118, flatShading: true }),
};

function add(parent: THREE.Object3D, geo: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number): THREE.Mesh {
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function island(parent: THREE.Object3D, zone: ZoneDef): void {
  const ground = new THREE.MeshLambertMaterial({ color: zone.ground, flatShading: true });
  const rim = new THREE.MeshLambertMaterial({ color: zone.rim, flatShading: true });
  const top = add(parent, new THREE.CylinderGeometry(zone.radius, zone.radius * 0.92, 1.1, 7), ground, zone.x, 0.15, zone.z);
  top.receiveShadow = true;
  add(parent, new THREE.CylinderGeometry(zone.radius * 0.98, zone.radius * 1.05, 0.35, 7), rim, zone.x, -0.45, zone.z);
}

function pathMeshes(parent: THREE.Object3D): void {
  for (const path of PATHS) {
    const dx = path.bx - path.ax;
    const dz = path.bz - path.az;
    const length = Math.hypot(dx, dz);
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(path.half * 2, 0.18, length), palette.path);
    mesh.position.set((path.ax + path.bx) / 2, 0.64, (path.az + path.bz) / 2);
    mesh.rotation.y = Math.atan2(dx, dz);
    mesh.receiveShadow = true;
    parent.add(mesh);
  }
  add(parent, new THREE.CylinderGeometry(5, 5.2, 0.22, 8), palette.path, 0, 0.62, 0);
}

function altar(parent: THREE.Object3D, x: number, z: number): void {
  add(parent, new THREE.CylinderGeometry(0.7, 0.85, 0.45, 6), palette.altar, x, 0.7, z);
  add(parent, new THREE.BoxGeometry(0.28, 0.7, 0.28), palette.stone, x, 1.15, z);
  const flame = add(parent, new THREE.OctahedronGeometry(0.22, 0), palette.lantern, x, 1.6, z);
  flame.name = "altar-flame";
}

function lanternPost(parent: THREE.Object3D, x: number, z: number): void {
  add(parent, new THREE.CylinderGeometry(0.05, 0.05, 1.3, 5), palette.wood, x, 1.1, z);
  add(parent, new THREE.BoxGeometry(0.28, 0.34, 0.28), palette.lantern, x, 1.85, z);
}

function house(parent: THREE.Object3D, x: number, z: number, rot: number): void {
  const g = new THREE.Group();
  g.position.set(x, 0.7, z);
  g.rotation.y = rot;
  add(g, new THREE.BoxGeometry(2.4, 1.3, 1.8), palette.wall, 0, 0.7, 0);
  const roof = add(g, new THREE.ConeGeometry(1.9, 0.9, 4), palette.roof, 0, 1.7, 0);
  roof.rotation.y = Math.PI / 4;
  add(g, new THREE.BoxGeometry(0.5, 0.7, 0.08), palette.ink, 0, 0.45, 0.92);
  parent.add(g);
}

function willow(parent: THREE.Object3D, x: number, z: number): void {
  add(parent, new THREE.CylinderGeometry(0.08, 0.12, 1.6, 5), palette.wood, x, 1.4, z);
  add(parent, new THREE.IcosahedronGeometry(0.7, 0), palette.willow, x, 2.3, z);
  add(parent, new THREE.IcosahedronGeometry(0.45, 0), palette.willow, x + 0.4, 1.7, z + 0.2);
}

function bambooClump(parent: THREE.Object3D, x: number, z: number): void {
  for (let i = 0; i < 5; i++) {
    const ox = Math.cos(i * 1.3) * 0.45;
    const oz = Math.sin(i * 1.7) * 0.45;
    const h = 2.4 + (i % 3) * 0.45;
    add(parent, new THREE.CylinderGeometry(0.05, 0.07, h, 5), palette.bamboo, x + ox, 0.7 + h / 2, z + oz);
  }
}

function pine(parent: THREE.Object3D, x: number, z: number, s = 1): void {
  add(parent, new THREE.CylinderGeometry(0.1, 0.14, 0.7, 5), palette.wood, x, 0.9, z);
  add(parent, new THREE.ConeGeometry(0.7 * s, 1.5 * s, 5), palette.pine, x, 1.9, z);
  add(parent, new THREE.ConeGeometry(0.5 * s, 1.1 * s, 5), palette.pine, x, 2.7, z);
}

function mountain(parent: THREE.Object3D, x: number, z: number, h: number, r: number): void {
  add(parent, new THREE.ConeGeometry(r, h, 5), palette.rock, x, 0.7 + h / 2, z);
  add(parent, new THREE.ConeGeometry(r * 0.45, h * 0.38, 5), palette.snow, x, 0.7 + h * 0.82, z);
}

export function buildScenery(parent: THREE.Object3D): void {
  const sea = add(parent, new THREE.CircleGeometry(96, 28), palette.water, 0, -0.35, 0);
  sea.rotation.x = -Math.PI / 2;
  sea.receiveShadow = true;

  for (const zone of ZONES) island(parent, zone);
  pathMeshes(parent);

  const j = ZONES[0];
  house(parent, j.blocks[0].x, j.blocks[0].z, 0.4);
  house(parent, j.x - 2, j.z + 2, 0.2);
  willow(parent, j.x + 4, j.z - 2);
  willow(parent, j.x - 6, j.z + 1);
  add(parent, new THREE.BoxGeometry(5.5, 0.08, 0.9), palette.fjordWater, j.x + 1.5, 0.78, j.z - 1);
  lanternPost(parent, j.x + 3, j.z + 3);
  lanternPost(parent, j.x - 3, j.z - 4);
  altar(parent, j.altar.x, j.altar.z);

  const b = ZONES[1];
  bambooClump(parent, b.x - 3, b.z - 2);
  bambooClump(parent, b.x + 3, b.z - 1);
  bambooClump(parent, b.x + 1, b.z + 3);
  bambooClump(parent, b.x - 2, b.z + 2);
  const pavilion = new THREE.Group();
  pavilion.position.set(b.blocks[0].x, 0.7, b.blocks[0].z);
  add(pavilion, new THREE.CylinderGeometry(1.7, 1.7, 0.15, 6), palette.wood, 0, 0.2, 0);
  add(pavilion, new THREE.CylinderGeometry(0.08, 0.08, 1.3, 5), palette.wood, 1.1, 0.9, 1.1);
  add(pavilion, new THREE.CylinderGeometry(0.08, 0.08, 1.3, 5), palette.wood, -1.1, 0.9, 1.1);
  add(pavilion, new THREE.CylinderGeometry(0.08, 0.08, 1.3, 5), palette.wood, 1.1, 0.9, -1.1);
  add(pavilion, new THREE.CylinderGeometry(0.08, 0.08, 1.3, 5), palette.wood, -1.1, 0.9, -1.1);
  const proof = add(pavilion, new THREE.ConeGeometry(2.2, 0.8, 6), palette.wood, 0, 1.7, 0);
  proof.castShadow = true;
  parent.add(pavilion);
  altar(parent, b.altar.x, b.altar.z);

  const h = ZONES[2];
  mountain(parent, h.x - 2, h.z - 2, 5.2, 3.2);
  mountain(parent, h.x + 3, h.z + 1, 3.4, 2.2);
  add(parent, new THREE.CylinderGeometry(0.9, 1.1, 0.7, 8), palette.stone, h.blocks[0].x, 1.05, h.blocks[0].z);
  add(parent, new THREE.CylinderGeometry(0.55, 0.75, 0.7, 8), palette.wall, h.blocks[0].x, 1.6, h.blocks[0].z);
  add(parent, new THREE.ConeGeometry(0.7, 0.7, 8), palette.gold, h.blocks[0].x, 2.2, h.blocks[0].z);
  for (let i = 0; i < 6; i++) {
    const flag = add(
      parent,
      new THREE.BoxGeometry(0.45, 0.28, 0.05),
      new THREE.MeshLambertMaterial({
        color: [0xc84b31, 0xe5b96f, 0x2d6b4f, 0x4c6cb3, 0xf4efe6, 0xd97845][i],
        flatShading: true,
      }),
      h.x - 4 + i * 0.8,
      2.4,
      h.z + 3,
    );
    flag.name = "flag";
  }
  altar(parent, h.altar.x, h.altar.z);

  const f = ZONES[3];
  const pool = add(parent, new THREE.CircleGeometry(4.2, 8), palette.fjordWater, f.x + 1, 0.78, f.z - 1);
  pool.rotation.x = -Math.PI / 2;
  pine(parent, f.x - 4, f.z - 3, 1.1);
  pine(parent, f.x - 2, f.z + 4, 0.8);
  pine(parent, f.x + 5, f.z + 2, 1.2);
  pine(parent, f.x + 3, f.z - 4, 0.9);
  add(parent, new THREE.BoxGeometry(2.6, 0.12, 1.1), palette.wood, f.blocks[0].x, 0.9, f.blocks[0].z);
  add(parent, new THREE.BoxGeometry(1.1, 0.28, 0.45), palette.wood, f.x + 2.2, 0.95, f.z - 1.4);
  altar(parent, f.altar.x, f.altar.z);

  add(parent, new THREE.CylinderGeometry(0.45, 0.55, 0.8, 6), palette.stone, 0, 0.85, 0);
  add(parent, new THREE.OctahedronGeometry(0.28, 0), palette.lantern, 0, 1.45, 0);
}
