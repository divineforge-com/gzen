import * as THREE from "three";
import {
  cameraPlanarBasis,
  placeFollowCamera,
  stepPose,
  yawToFace,
  type Pose,
} from "./frame.ts";
import { canWalkAt, spawnFor, zoneLabel, ZONES, type ZoneId } from "./zones.ts";
import { buildScenery } from "./scenery.ts";
import { makeWanderer, wandererFront } from "./wanderer.ts";

export type Focus =
  | {
      kind: "teaching";
      zone: ZoneId;
      title: string;
      zh: string;
      line: string;
      source: string;
      sat: boolean;
    }
  | {
      kind: "fellow";
      id: string;
      name: string;
      zone: string;
      line: string;
      ask: string;
      reply: string | null;
    }
  | { kind: "note"; id: string; body: string; zone: string };

export type HudSnapshot = {
  zoneName: string;
  kanji: string;
  prompt: string | null;
  teachings: number;
  ready: boolean;
};

type Note = { id: string; x: number; z: number; body: string; zone: string; at: number };
type Save = {
  replies: Record<string, string>;
  teachings: string[];
  notes: Note[];
};

const SAVE_KEY = "gzen.world.v1";
const REACH = 2.35;

function loadSave(): Save {
  const empty: Save = { replies: {}, teachings: [], notes: [] };
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<Save>;
    return {
      replies: parsed.replies && typeof parsed.replies === "object" ? parsed.replies : {},
      teachings: Array.isArray(parsed.teachings) ? parsed.teachings.filter((id) => typeof id === "string") : [],
      notes: Array.isArray(parsed.notes) ? parsed.notes.filter(validNote) : [],
    };
  } catch {
    return empty;
  }
}

function validNote(note: Note): note is Note {
  return !!note && typeof note.id === "string" && typeof note.body === "string" && Number.isFinite(note.x) && Number.isFinite(note.z);
}

export type WorldController = {
  setMove: (forward: number, strafe: number, turn: number) => void;
  setPaused: (paused: boolean) => void;
  interact: () => Focus | null;
  markTeaching: (zone: ZoneId) => void;
  replyTo: (fellowId: string, body: string) => void;
  leaveNote: (body: string) => void;
  teleport: (id: ZoneId | "crossing") => void;
  snapshot: () => HudSnapshot;
  selfTest: () => string[];
  dispose: () => void;
};

export function mountWorld(
  container: HTMLElement,
  hooks: { onFrame?: (snapshot: HudSnapshot) => void; onFocus?: (focus: Focus | null) => void } = {},
): WorldController {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(0xd7e4ec, 1);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xd7e4ec, 28, 78);
  scene.add(new THREE.HemisphereLight(0xfff6ea, 0x8aa4b5, 1.05));
  const sun = new THREE.DirectionalLight(0xfff1dc, 1.35);
  sun.position.set(-18, 28, 14);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 80;
  sun.shadow.camera.left = -40;
  sun.shadow.camera.right = 40;
  sun.shadow.camera.top = 40;
  sun.shadow.camera.bottom = -40;
  scene.add(sun);
  scene.add(sun.target);

  buildScenery(scene);

  const save = loadSave();
  const noteMeshes: THREE.Object3D[] = [];
  const noteGroup = new THREE.Group();
  scene.add(noteGroup);

  const playerRig = makeWanderer(0xd97845);
  scene.add(playerRig.root);

  const fellows = ZONES.map((zone) => {
    const rig = makeWanderer(zone.fellow.sash);
    rig.root.position.set(zone.fellow.x, 0.7, zone.fellow.z);
    scene.add(rig.root);
    return { zone, rig, phase: zone.fellow.x * 0.1 };
  });

  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 200);
  const home = ZONES[0];
  const spawn = { x: home.x + 4, z: home.z - 3 };
  let pose: Pose = {
    x: spawn.x,
    y: 0.7,
    z: spawn.z,
    yaw: yawToFace(-spawn.x, -spawn.z),
  };

  const input = { forward: 0, strafe: 0, turn: 0 };
  let paused = false;
  let walkPhase = 0;
  let running = true;
  let joyActive = false;
  const keys = new Set<string>();
  const params = new URLSearchParams(location.search);
  const autowalk = params.get("autowalk") === "1";
  const shot = params.get("shot") === "1";
  const act = params.get("act");

  const persist = () => localStorage.setItem(SAVE_KEY, JSON.stringify(save));

  const paintNotes = () => {
    for (const mesh of noteMeshes) noteGroup.remove(mesh);
    noteMeshes.length = 0;
    for (const note of save.notes) {
      const post = new THREE.Mesh(
        new THREE.BoxGeometry(0.34, 0.42, 0.08),
        new THREE.MeshLambertMaterial({ color: 0xf7f1e4, flatShading: true }),
      );
      post.position.set(note.x, 1.15, note.z);
      post.castShadow = true;
      noteGroup.add(post);
      noteMeshes.push(post);
    }
  };
  paintNotes();

  const channel = "BroadcastChannel" in window ? new BroadcastChannel("gzen-world") : null;
  channel?.addEventListener("message", (event: MessageEvent) => {
    const data = event.data as { type?: string; note?: Note; id?: string; body?: string };
    if (data?.type === "note" && data.note && validNote(data.note) && !save.notes.some((note) => note.id === data.note!.id)) {
      save.notes.push(data.note);
      persist();
      paintNotes();
    }
    if (data?.type === "reply" && typeof data.id === "string" && typeof data.body === "string") {
      save.replies[data.id] = data.body;
      persist();
    }
  });

  const resize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w < 2 || h < 2) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    container.dataset.size = `${w}x${h}`;
    renderer.setSize(w, h, false);
    placeFollowCamera(camera, pose);
    renderer.render(scene, camera);
  };
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(container);

  const nearest = (): Focus | null => {
    let best = REACH;
    let focus: Focus | null = null;
    for (const zone of ZONES) {
      const dAltar = Math.hypot(pose.x - zone.altar.x, pose.z - zone.altar.z);
      if (dAltar < best) {
        best = dAltar;
        focus = { kind: "teaching", zone: zone.id, ...zone.teaching, sat: save.teachings.includes(zone.id) };
      }
      const fellow = fellows.find((item) => item.zone.id === zone.id);
      const fx = fellow ? fellow.rig.root.position.x : zone.fellow.x;
      const fz = fellow ? fellow.rig.root.position.z : zone.fellow.z;
      const dFellow = Math.hypot(pose.x - fx, pose.z - fz);
      if (dFellow < best) {
        best = dFellow;
        focus = {
          kind: "fellow",
          id: zone.fellow.id,
          name: zone.fellow.name,
          zone: zone.name,
          line: zone.fellow.line,
          ask: zone.fellow.ask,
          reply: save.replies[zone.fellow.id] ?? null,
        };
      }
    }
    for (const note of save.notes) {
      const d = Math.hypot(pose.x - note.x, pose.z - note.z);
      if (d < best) {
        best = d;
        focus = { kind: "note", id: note.id, body: note.body, zone: note.zone };
      }
    }
    return focus;
  };

  const applyPose = () => {
    playerRig.root.position.set(pose.x, pose.y, pose.z);
    playerRig.root.rotation.y = pose.yaw;
    playerRig.root.updateMatrixWorld(true);
  };

  const canvas = renderer.domElement;
  canvas.addEventListener("pointerdown", (event) => {
    const rect = canvas.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    if (event.pointerType !== "mouse" && localX < rect.width * 0.45) {
      joyActive = true;
    }
    canvas.setPointerCapture(event.pointerId);
    canvas.dataset.dragX = String(event.clientX);
    canvas.dataset.dragY = String(event.clientY);
    canvas.dataset.dragging = joyActive ? "joy" : "look";
  });
  canvas.addEventListener("pointermove", (event) => {
    if (canvas.dataset.dragging === "joy") {
      const ox = Number(canvas.dataset.dragX);
      const oy = Number(canvas.dataset.dragY);
      input.strafe = Math.max(-1, Math.min(1, (event.clientX - ox) / 56));
      input.forward = Math.max(-1, Math.min(1, (oy - event.clientY) / 56));
    } else if (canvas.dataset.dragging === "look") {
      const ox = Number(canvas.dataset.dragX);
      input.turn += -(event.clientX - ox) * 0.007;
      canvas.dataset.dragX = String(event.clientX);
    }
  });
  const endPointer = () => {
    if (canvas.dataset.dragging === "joy") {
      joyActive = false;
      input.forward = 0;
      input.strafe = 0;
    }
    canvas.dataset.dragging = "";
  };
  canvas.addEventListener("pointerup", endPointer);
  canvas.addEventListener("pointercancel", endPointer);

  window.addEventListener("keydown", (event) => {
    const target = event.target as HTMLElement | null;
    if (target && (target.tagName === "TEXTAREA" || target.tagName === "INPUT")) return;
    keys.add(event.code);
    if (event.code === "KeyE" && !paused) {
      event.preventDefault();
      hooks.onFocus?.(nearest());
    }
  });
  window.addEventListener("keyup", (event) => keys.delete(event.code));

  const at = params.get("at");
  if (at === "crossing") pose = { x: 3.2, y: 0.7, z: 0.4, yaw: yawToFace(-1, 0) };
  else if (at === "jiangnan" || at === "bamboo" || at === "himalaya" || at === "fjord") {
    const zone = ZONES.find((item) => item.id === at);
    if (zone) {
      const spot = spawnFor(zone);
      pose = { x: spot.x, y: 0.7, z: spot.z, yaw: yawToFace(zone.altar.x - spot.x, zone.altar.z - spot.z) };
    }
  }

  if (act === "teach") {
    const zone = ZONES[0];
    pose = { x: zone.altar.x + 1.1, y: 0.7, z: zone.altar.z + 0.2, yaw: yawToFace(zone.altar.x - (zone.altar.x + 1.1), zone.altar.z - (zone.altar.z + 0.2)) };
  }

  let frames = 0;
  let last = performance.now();
  const loop = (now: number) => {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (!paused && !joyActive) {
      input.forward = (keys.has("KeyW") || keys.has("ArrowUp") ? 1 : 0) - (keys.has("KeyS") || keys.has("ArrowDown") ? 1 : 0);
      input.strafe = (keys.has("KeyD") || keys.has("ArrowRight") ? 1 : 0) - (keys.has("KeyA") || keys.has("ArrowLeft") ? 1 : 0);
      if (autowalk) input.forward = 1;
    }

    if (!paused) {
      const prevX = pose.x;
      const prevZ = pose.z;
      pose = { ...pose, yaw: pose.yaw + input.turn };
      input.turn = 0;
      placeFollowCamera(camera, pose);
      const { f, r } = cameraPlanarBasis(camera);
      pose = stepPose(pose, input, dt, canWalkAt, f, r);
      if (Math.hypot(pose.x - prevX, pose.z - prevZ) > 0.001) walkPhase += dt * 8;
      else walkPhase *= 0.8;
    } else {
      placeFollowCamera(camera, pose);
    }

    applyPose();
    const swinging = Math.sin(walkPhase);
    playerRig.leftLeg.rotation.x = swinging * 0.55;
    playerRig.rightLeg.rotation.x = -swinging * 0.55;

    for (const fellow of fellows) {
      fellow.phase += dt * 0.45;
      const t = (Math.sin(fellow.phase) + 1) / 2;
      const homeX = fellow.zone.fellow.x;
      const homeZ = fellow.zone.fellow.z;
      const ax = homeX;
      const az = homeZ;
      const bx = homeX + 1.4;
      const bz = homeZ + 0.4;
      const x = ax + (bx - ax) * t;
      const z = az + (bz - az) * t;
      fellow.rig.root.position.set(x, 0.7, z);
      const dir = Math.cos(fellow.phase);
      fellow.rig.root.rotation.y = yawToFace(dir * (bx - ax), dir * (bz - az));
      fellow.rig.leftLeg.rotation.x = Math.sin(fellow.phase * 2) * 0.35;
      fellow.rig.rightLeg.rotation.x = -Math.sin(fellow.phase * 2) * 0.35;
    }

    sun.position.set(pose.x - 18, 28, pose.z + 14);
    sun.target.position.set(pose.x, 0, pose.z);
    sun.target.updateMatrixWorld();
    renderer.render(scene, camera);
    hooks.onFrame?.({
      zoneName: zoneLabel(pose.x, pose.z).name,
      kanji: zoneLabel(pose.x, pose.z).kanji,
      prompt: paused ? null : promptFor(nearest()),
      teachings: save.teachings.length,
      ready: true,
    });
    const sized = container.clientWidth > 2 && container.clientHeight > 2;
    if (sized) frames += 1;
    if (frames === 2 && act === "teach") hooks.onFocus?.(nearest());
    if (!(shot && sized && frames > 3)) requestAnimationFrame(loop);
  };
  applyPose();
  placeFollowCamera(camera, pose);
  requestAnimationFrame(loop);
  container.dataset.ready = "1";

  const promptFor = (focus: Focus | null): string | null => {
    if (!focus) return null;
    if (focus.kind === "teaching") return `Sit with ${focus.title}`;
    if (focus.kind === "fellow") return `Speak with ${focus.name}`;
    return "Read a note left on the path";
  };

  return {
    setMove(forward, strafe, turn) {
      input.forward = forward;
      input.strafe = strafe;
      input.turn += turn;
    },
    setPaused(next) {
      paused = next;
    },
    interact() {
      return nearest();
    },
    markTeaching(zone) {
      if (!save.teachings.includes(zone)) save.teachings.push(zone);
      persist();
    },
    replyTo(fellowId, body) {
      const text = body.trim().slice(0, 180);
      if (!text) return;
      save.replies[fellowId] = text;
      persist();
      channel?.postMessage({ type: "reply", id: fellowId, body: text });
    },
    leaveNote(body) {
      const text = body.trim().slice(0, 140);
      if (!text) return;
      const fwd = new THREE.Vector3(-Math.sin(pose.yaw), 0, -Math.cos(pose.yaw));
      let x = pose.x + fwd.x * 1.1;
      let z = pose.z + fwd.z * 1.1;
      if (!canWalkAt(x, z)) {
        x = pose.x;
        z = pose.z;
      }
      const note: Note = {
        id: `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e4).toString(36)}`,
        x,
        z,
        body: text,
        zone: zoneLabel(pose.x, pose.z).name,
        at: Date.now(),
      };
      save.notes.push(note);
      if (save.notes.length > 40) save.notes.shift();
      persist();
      paintNotes();
      channel?.postMessage({ type: "note", note });
    },
    teleport(id) {
      if (id === "crossing") {
        pose = { x: 3.2, y: 0.7, z: 0.4, yaw: yawToFace(-1, 0) };
      } else {
        const zone = ZONES.find((item) => item.id === id);
        if (!zone) return;
        const spot = spawnFor(zone);
        pose = { x: spot.x, y: 0.7, z: spot.z, yaw: yawToFace(zone.altar.x - spot.x, zone.altar.z - spot.z) };
      }
      applyPose();
      placeFollowCamera(camera, pose);
    },
    snapshot() {
      const label = zoneLabel(pose.x, pose.z);
      return {
        zoneName: label.name,
        kanji: label.kanji,
        prompt: paused ? null : promptFor(nearest()),
        teachings: save.teachings.length,
        ready: true,
      };
    },
    selfTest() {
      return controlSelfTest();
    },
    dispose() {
      running = false;
      observer.disconnect();
      channel?.close();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

export function controlSelfTest(): string[] {
  const failures: string[] = [];
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  const rig = makeWanderer(0xd97845);
  const open = () => true;
  const expect = (name: string, ok: boolean, detail: string) => {
    if (!ok) failures.push(`${name}: ${detail}`);
  };

  const press = (forward: number, strafe: number) => {
    let pose: Pose = { x: 0, y: 0, z: 0, yaw: 0 };
    placeFollowCamera(camera, pose);
    const { f, r } = cameraPlanarBasis(camera);
    const next = stepPose(pose, { forward, strafe }, 0.5, open, f, r);
    pose = next;
    rig.root.position.set(pose.x, pose.y, pose.z);
    rig.root.rotation.y = pose.yaw;
    rig.root.updateMatrixWorld(true);
    const moved = new THREE.Vector3(pose.x, 0, pose.z);
    const facing = new THREE.Vector3(-Math.sin(pose.yaw), 0, -Math.cos(pose.yaw));
    const front = wandererFront(rig);
    return { pose, moved, facing, front, f, r };
  };

  const w = press(1, 0);
  expect("W moves toward −z", w.moved.z < -0.5 && Math.abs(w.moved.x) < 0.2, `moved ${w.moved.x.toFixed(2)}, ${w.moved.z.toFixed(2)}`);
  expect("W faces travel", w.facing.dot(w.moved.clone().normalize()) > 0.9, `dot ${w.facing.dot(w.moved.clone().normalize()).toFixed(2)}`);
  expect("W nose matches heading", w.front.dot(w.facing) > 0.9, `dot ${w.front.dot(w.facing).toFixed(2)}`);
  expect("camera forward is −z at yaw 0", w.f.z < -0.9 && Math.abs(w.f.x) < 0.1, `f ${w.f.x.toFixed(2)}, ${w.f.z.toFixed(2)}`);
  expect("camera right is +x at yaw 0", w.r.x > 0.9, `r ${w.r.x.toFixed(2)}`);

  const d = press(0, 1);
  expect("D moves toward +x", d.moved.x > 0.5 && Math.abs(d.moved.z) < 0.2, `moved ${d.moved.x.toFixed(2)}, ${d.moved.z.toFixed(2)}`);
  expect("D faces travel", d.facing.dot(d.moved.clone().normalize()) > 0.9, `dot ${d.facing.dot(d.moved.clone().normalize()).toFixed(2)}`);
  expect("D nose matches heading", d.front.dot(d.facing) > 0.9, `dot ${d.front.dot(d.facing).toFixed(2)}`);

  const s = press(-1, 0);
  expect("S moves toward +z", s.moved.z > 0.5, `moved ${s.moved.z.toFixed(2)}`);
  expect("S faces travel", s.facing.dot(s.moved.clone().normalize()) > 0.9, `dot ${s.facing.dot(s.moved.clone().normalize()).toFixed(2)}`);

  const a = press(0, -1);
  expect("A moves toward −x", a.moved.x < -0.5, `moved ${a.moved.x.toFixed(2)}`);

  let turned: Pose = { x: 0, y: 0, z: 0, yaw: -Math.PI / 2 };
  placeFollowCamera(camera, turned);
  const basis = cameraPlanarBasis(camera);
  turned = stepPose(turned, { forward: 1, strafe: 0 }, 0.5, open, basis.f, basis.r);
  expect("yaw −π/2 walks toward +x", turned.x > 0.5 && Math.abs(turned.z) < 0.25, `pose ${turned.x.toFixed(2)}, ${turned.z.toFixed(2)}`);
  expect("basis at yaw −π/2 points +x", basis.f.x > 0.9, `f ${basis.f.x.toFixed(2)}, ${basis.f.z.toFixed(2)}`);

  return failures;
}
