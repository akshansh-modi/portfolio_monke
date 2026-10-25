import { useEffect, useRef } from "react";
import monke from "./assets/monke.svg";

type Part = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; r: number; k: number; ph: number; delay: number };

const DENSITY = 8000;
const REPEL = 70;
const TAU = Math.PI * 2;

// "original" palette from the design: the SVG's own colours, quantized so particles batch into few fill calls
const q = (v: number) => Math.min(255, Math.round(v / 24) * 24);
const colorFor = (r: number, g: number, b: number) => `rgb(${q(r)},${q(g)},${q(b)})`;

export default function MonkeCanvas() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stage = stageRef.current!, c = canvasRef.current!, ctx = c.getContext("2d")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0, on: false };
    let bursts: { x: number; y: number }[] = [];
    let parts: Part[] = [];
    let buckets = new Map<string, Part[]>();
    let img: HTMLImageElement | null = null;
    let w = 0, h = 0, t0: number | null = null, visible = true, raf = 0;

    const build = () => {
      if (!img) return;
      w = stage.clientWidth; h = stage.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // ponytail: capped, full retina res halves fps at this particle count
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const size = Math.min(w, h) * 0.86, N = 220;
      const off = document.createElement("canvas");
      off.width = off.height = N;
      const o = off.getContext("2d")!;
      o.drawImage(img, 0, 0, N, N);
      const data = o.getImageData(0, 0, N, N).data;
      const pts: number[][] = [];
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        const i = (y * N + x) * 4;
        if (data[i + 3] > 20) pts.push([x, y, data[i], data[i + 1], data[i + 2]]);
      }
      for (let i = pts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pts[i], pts[j]] = [pts[j], pts[i]];
      }

      const ox = (w - size) / 2, oy = (h - size) / 2, s = size / N;
      const old = parts, first = !old.length && !reduced;
      const cx = w / 2, cy = h / 2, far = Math.hypot(w, h) * 0.7;
      buckets = new Map();
      parts = pts.slice(0, DENSITY).map(([px, py, r, g, b], k) => {
        const hx = ox + px * s, hy = oy + py * s, prev = old[k], a = Math.random() * TAU;
        const part: Part = {
          hx, hy, vx: 0, vy: 0,
          // keep old positions on resize; fly in from offscreen on first build
          x: prev ? prev.x : first ? cx + Math.cos(a) * far : hx,
          y: prev ? prev.y : first ? cy + Math.sin(a) * far : hy,
          r: Math.random() * (w >= 500 ? 2.2 : 2.6) + 0.6,
          k: 0.022 + Math.random() * 0.03,
          ph: Math.random() * TAU,
          delay: first ? (Math.hypot(hx - cx, hy - cy) / (size * 0.6)) * 700 + Math.random() * 400 : 0,
        };
        const col = colorFor(r, g, b);
        if (!buckets.has(col)) buckets.set(col, []);
        buckets.get(col)!.push(part);
        return part;
      });
      t0 = null;
    };

    const step = (t: number) => {
      if (!parts.length) return;
      if (t0 == null) t0 = t;
      const el = t - t0, m = mouse;
      const speed = Math.min(Math.hypot(m.vx, m.vy), 40), boost = 1 + speed / 12;
      const RR = REPEL * (1 + speed / 60), RR2 = RR * RR;
      const wob = reduced ? 0 : 1.2;
      const bs = bursts; bursts = [];
      for (const p of parts) {
        if (el < p.delay) continue;
        const tx = p.hx + Math.sin(t * 0.0013 + p.ph) * wob, ty = p.hy + Math.cos(t * 0.0011 + p.ph * 1.3) * wob;
        if (m.on) {
          const dx = p.x - m.x, dy = p.y - m.y, d2 = dx * dx + dy * dy;
          if (d2 < RR2) {
            const d = Math.sqrt(d2) || 1, f = (1 - d / RR) ** 2 * 7 * boost;
            p.vx += (dx / d) * f + (-dy / d) * f * 0.35 + m.vx * 0.06 * (1 - d / RR);
            p.vy += (dy / d) * f + (dx / d) * f * 0.35 + m.vy * 0.06 * (1 - d / RR);
          }
        }
        for (const b of bs) {
          const dx = p.x - b.x, dy = p.y - b.y, d = Math.hypot(dx, dy) || 1;
          if (d < 220) { const f = (1 - d / 220) * 26; p.vx += (dx / d) * f; p.vy += (dy / d) * f; }
        }
        p.vx += (tx - p.x) * p.k; p.vy += (ty - p.y) * p.k;
        p.vx *= 0.86; p.vy *= 0.86; p.x += p.vx; p.y += p.vy;
      }
      m.vx *= 0.85; m.vy *= 0.85;
      ctx.clearRect(0, 0, w, h);
      for (const [col, arr] of buckets) {
        ctx.fillStyle = col;
        ctx.beginPath();
        for (const p of arr) { ctx.moveTo(p.x + p.r, p.y); ctx.arc(p.x, p.y, p.r, 0, TAU); }
        ctx.fill();
      }
    };

    const pos = (x: number, y: number) => { const r = c.getBoundingClientRect(); return [x - r.left, y - r.top]; };
    const move = (x: number, y: number) => {
      const [mx, my] = pos(x, y), m = mouse;
      if (m.on) { m.vx = m.vx * 0.5 + (mx - m.x) * 0.5; m.vy = m.vy * 0.5 + (my - m.y) * 0.5; }
      m.x = mx; m.y = my; m.on = true;
    };
    const onMove = (e: PointerEvent) => move(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => { const t = e.touches[0]; if (t) move(t.clientX, t.clientY); };
    const onLeave = () => { Object.assign(mouse, { x: -9999, y: -9999, vx: 0, vy: 0, on: false }); };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // touch gets the flow only, no boop burst
      const [x, y] = pos(e.clientX, e.clientY); bursts.push({ x, y });
    };
    c.addEventListener("pointermove", onMove);
    c.addEventListener("touchmove", onTouch, { passive: true });
    c.addEventListener("pointerleave", onLeave);
    c.addEventListener("touchend", onLeave);
    c.addEventListener("pointerdown", onDown);

    const image = new Image();
    image.onload = () => { img = image; build(); };
    image.src = monke;

    const ro = new ResizeObserver(build);
    ro.observe(stage);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(stage);
    const tick = (t: number) => { if (visible) step(t); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      image.onload = null;
      c.removeEventListener("pointermove", onMove);
      c.removeEventListener("touchmove", onTouch);
      c.removeEventListener("pointerleave", onLeave);
      c.removeEventListener("touchend", onLeave);
      c.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div ref={stageRef} className="stage">
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="stage-tag">poke the monke · click to boop</span>
    </div>
  );
}
