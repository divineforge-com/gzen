/**
 * Lightweight portal interactivity — theme, doors, ambient.
 * Respects prefers-reduced-motion.
 */

const STORAGE_KEY = "gzen-theme";
type ThemeId = "monastery" | "ignite";

const THEME_COLORS: Record<ThemeId, string> = {
  monastery: "#04050a",
  ignite: "#0a0705",
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function currentTheme(): ThemeId {
  const t = document.documentElement.getAttribute("data-theme");
  return t === "ignite" ? "ignite" : "monastery";
}

function applyTheme(theme: ThemeId) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* private mode */
  }
  const meta = document.getElementById("meta-theme-color");
  if (meta) meta.setAttribute("content", THEME_COLORS[theme]);
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.setAttribute(
      "aria-label",
      theme === "ignite"
        ? "Warm ignition on. Switch to cool monastery."
        : "Cool monastery on. Switch to warm ignition.",
    );
  }
}

function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  applyTheme(currentTheme());

  btn.addEventListener("click", () => {
    applyTheme(currentTheme() === "ignite" ? "monastery" : "ignite");
  });

  // Optional: T toggles temperature when not typing
  window.addEventListener("keydown", (e) => {
    if (e.key !== "t" && e.key !== "T") return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const el = e.target as HTMLElement | null;
    if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) {
      return;
    }
    e.preventDefault();
    applyTheme(currentTheme() === "ignite" ? "monastery" : "ignite");
  });
}

function initMagneticDoors() {
  if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;

  const doors = document.querySelectorAll<HTMLElement>(".door");

  doors.forEach((door) => {
    const onMove = (e: PointerEvent) => {
      const rect = door.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = (x / rect.width - 0.5) * 2;
      const py = (y / rect.height - 0.5) * 2;
      door.style.setProperty("--mx", `${px}`);
      door.style.setProperty("--my", `${py}`);
      door.style.transform = `translateY(-3px) perspective(600px) rotateX(${(-py * 2.5).toFixed(2)}deg) rotateY(${(px * 2.5).toFixed(2)}deg)`;
    };

    const onLeave = () => {
      door.style.transform = "";
      door.style.removeProperty("--mx");
      door.style.removeProperty("--my");
    };

    door.addEventListener("pointermove", onMove);
    door.addEventListener("pointerleave", onLeave);
    door.addEventListener("blur", onLeave);
  });
}

function initKeyboardHint() {
  const doors = Array.from(document.querySelectorAll<HTMLAnchorElement>(".door"));
  if (!doors.length) return;

  window.addEventListener("keydown", (e) => {
    const key = e.key.toUpperCase();
    if (!["K", "I", "L", "O"].includes(key)) return;
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
      return;
    }
    const door = doors.find((d) => d.dataset.door === key);
    if (door) {
      e.preventDefault();
      door.focus();
      door.classList.add("door-key-flash");
      window.setTimeout(() => door.classList.remove("door-key-flash"), 350);
    }
  });
}

function initAmbientPointer() {
  if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;

  const shell = document.getElementById("shell");
  if (!shell) return;

  let raf = 0;
  let lx = 0.5;
  let ly = 0.3;

  const paint = () => {
    shell.style.setProperty("--px", `${(lx * 100).toFixed(2)}%`);
    shell.style.setProperty("--py", `${(ly * 100).toFixed(2)}%`);
    raf = 0;
  };

  window.addEventListener(
    "pointermove",
    (e) => {
      lx = e.clientX / window.innerWidth;
      ly = e.clientY / window.innerHeight;
      if (!raf) raf = requestAnimationFrame(paint);
    },
    { passive: true },
  );
}

initThemeToggle();
initMagneticDoors();
initKeyboardHint();
initAmbientPointer();
