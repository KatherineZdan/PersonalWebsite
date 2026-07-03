import { useEffect, useRef } from 'react';
import styles from './PaintCanvas.module.css';

/**
 * "Wet Paint" hero canvas.
 *
 * Two stacked canvases: the base layer animates an abstract composition of
 * brushstrokes painting themselves in; the wet layer on top lets the
 * visitor drag daubs of paint with the cursor and throw splats on click.
 * Honours prefers-reduced-motion by rendering the finished composition
 * immediately with no pointer painting.
 */

type Pt = { x: number; y: number };

type Bristle = {
  offset: number; // perpendicular offset from the spine, -1..1
  width: number; // fraction of stroke width
  alpha: number;
};

type Stroke = {
  spine: Pt[]; // dense polyline (normalised 0..1 coords)
  color: string;
  width: number; // at full viewport scale, in px
  alpha: number;
  bristles: Bristle[];
  start: number; // ms after mount
  dur: number; // ms to fully paint
  progress: number; // 0..1 revealed
};

const PALETTE = {
  vermilion: '#e5482b',
  ember: '#c73a20',
  ochre: '#c98f2d',
  paper: '#f4f1ea',
  umber: '#3a3428',
  smoke: '#9b968c',
};

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Catmull-Rom through control points, sampled densely. */
function smoothPath(ctrl: Pt[], samplesPerSeg = 26): Pt[] {
  const pts: Pt[] = [];
  const P = [ctrl[0], ...ctrl, ctrl[ctrl.length - 1]];
  for (let i = 0; i < P.length - 3; i++) {
    const [p0, p1, p2, p3] = [P[i], P[i + 1], P[i + 2], P[i + 3]];
    for (let j = 0; j < samplesPerSeg; j++) {
      const t = j / samplesPerSeg;
      const t2 = t * t;
      const t3 = t2 * t;
      pts.push({
        x:
          0.5 *
          (2 * p1.x +
            (-p0.x + p2.x) * t +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y:
          0.5 *
          (2 * p1.y +
            (-p0.y + p2.y) * t +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      });
    }
  }
  pts.push(ctrl[ctrl.length - 1]);
  return pts;
}

function makeBristles(count: number): Bristle[] {
  const bristles: Bristle[] = [];
  for (let i = 0; i < count; i++) {
    bristles.push({
      offset: rand(-1, 1),
      width: rand(0.14, 0.4),
      alpha: rand(0.3, 0.85),
    });
  }
  return bristles;
}

/**
 * Art-directed composition: a few large gestures that frame the headline
 * (which sits centre-left), plus small accents. Normalised coordinates.
 */
function composeStrokes(): Stroke[] {
  const strokes: Stroke[] = [];
  let t = 250;

  const add = (
    ctrl: Pt[],
    color: string,
    width: number,
    alpha: number,
    dur: number,
    bristleCount = 12,
  ) => {
    strokes.push({
      spine: smoothPath(ctrl),
      color,
      width,
      alpha,
      bristles: makeBristles(bristleCount),
      start: t,
      dur,
      progress: 0,
    });
    t += dur * rand(0.35, 0.55); // overlap: next stroke starts mid-gesture
  };

  const j = (v: number, amt = 0.04) => v + rand(-amt, amt);

  // 1. Big vermilion arc sweeping across the upper right.
  add(
    [
      { x: j(0.42), y: j(0.16) },
      { x: j(0.62), y: j(0.06) },
      { x: j(0.84), y: j(0.14) },
      { x: j(0.96), y: j(0.38) },
      { x: j(0.88), y: j(0.62) },
    ],
    PALETTE.vermilion,
    58,
    0.92,
    1500,
    14,
  );

  // 2. Ochre diagonal answering it from the lower left.
  add(
    [
      { x: j(0.04), y: j(0.88) },
      { x: j(0.22), y: j(0.78) },
      { x: j(0.44), y: j(0.82) },
      { x: j(0.6), y: j(0.72) },
    ],
    PALETTE.ochre,
    44,
    0.55,
    1250,
  );

  // 3. Pale paper scumble drifting behind the headline area.
  add(
    [
      { x: j(0.1), y: j(0.34) },
      { x: j(0.3), y: j(0.26) },
      { x: j(0.52), y: j(0.32) },
      { x: j(0.7), y: j(0.24) },
    ],
    PALETTE.paper,
    72,
    0.08,
    1400,
    16,
  );

  // 4. Deep umber undercurrent along the bottom edge.
  add(
    [
      { x: j(0.3), y: j(0.97) },
      { x: j(0.55), y: j(0.9) },
      { x: j(0.8), y: j(0.95) },
      { x: j(0.98), y: j(0.86) },
    ],
    PALETTE.umber,
    64,
    0.8,
    1300,
  );

  // 5. Ember flick crossing the big arc.
  add(
    [
      { x: j(0.7), y: j(0.5) },
      { x: j(0.8), y: j(0.34) },
      { x: j(0.92), y: j(0.22) },
    ],
    PALETTE.ember,
    22,
    0.85,
    850,
    8,
  );

  // 6. Smoke-grey whisper upper left, almost dry-brush.
  add(
    [
      { x: j(0.06), y: j(0.12) },
      { x: j(0.18), y: j(0.2) },
      { x: j(0.34), y: j(0.1) },
    ],
    PALETTE.smoke,
    30,
    0.32,
    900,
  );

  // 7–9. Small accent ticks, scattered.
  for (let i = 0; i < 3; i++) {
    const cx = rand(0.12, 0.9);
    const cy = rand(0.1, 0.9);
    const a = rand(0, Math.PI * 2);
    const len = rand(0.04, 0.09);
    add(
      [
        { x: cx, y: cy },
        { x: cx + Math.cos(a) * len, y: cy + Math.sin(a) * len },
      ],
      pick([PALETTE.vermilion, PALETTE.ochre, PALETTE.paper]),
      rand(8, 16),
      rand(0.4, 0.9),
      rand(350, 550),
      6,
    );
  }

  return strokes;
}

const easeOutCubic = (k: number) => 1 - Math.pow(1 - k, 3);

export function PaintCanvas({ onSettled }: { onSettled?: () => void }) {
  const baseRef = useRef<HTMLCanvasElement>(null);
  const wetRef = useRef<HTMLCanvasElement>(null);
  const settledRef = useRef(onSettled);
  settledRef.current = onSettled;

  useEffect(() => {
    const base = baseRef.current;
    const wet = wetRef.current;
    if (!base || !wet) return;
    const ctxB = base.getContext('2d');
    const ctxW = wet.getContext('2d');
    if (!ctxB || !ctxW) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let scale = 1; // stroke width scale relative to a 1440px canvas
    const strokes = composeStrokes();
    let raf = 0;
    let startTime = 0;
    let settledFired = false;

    const px = (p: Pt): Pt => ({ x: p.x * W, y: p.y * H });

    const fireSettled = () => {
      if (settledFired) return;
      settledFired = true;
      settledRef.current?.();
    };

    /**
     * Draw a stroke's revealed portion as continuous paths — one per
     * bristle plus a solid core. The taper is geometric: bristle offsets
     * pinch toward the spine at both ends, so constant line widths still
     * read as a tapered mark with no banding.
     */
    const drawStroke = (s: Stroke) => {
      const n = s.spine.length - 1;
      const upto = Math.max(Math.floor(s.progress * n), 1);
      if (s.progress <= 0) return;

      // Precompute pixel points and normals once per stroke draw.
      const pts: Pt[] = [];
      const nrms: Pt[] = [];
      for (let i = 0; i <= upto; i++) {
        pts[i] = px(s.spine[i]);
        const a = px(s.spine[Math.max(i - 1, 0)]);
        const b = px(s.spine[Math.min(i + 1, n)]);
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        nrms[i] = { x: -dy / len, y: dx / len };
      }
      // Belly profile: bristles pinch toward the spine at both ends.
      const prof = (i: number) => {
        const u = i / n;
        return 0.3 + 0.7 * Math.sin(Math.PI * u);
      };

      const wFull = s.width * scale;

      ctxB.lineCap = 'round';
      ctxB.lineJoin = 'round';

      // Core pass.
      ctxB.strokeStyle = s.color;
      ctxB.globalAlpha = s.alpha * 0.45;
      ctxB.lineWidth = Math.max(wFull * 0.34, 1);
      ctxB.beginPath();
      for (let i = 0; i <= upto; i++) {
        if (i === 0) ctxB.moveTo(pts[i].x, pts[i].y);
        else ctxB.lineTo(pts[i].x, pts[i].y);
      }
      ctxB.stroke();

      // Bristle passes.
      for (const br of s.bristles) {
        ctxB.strokeStyle = s.color;
        ctxB.globalAlpha = s.alpha * br.alpha * 0.75;
        ctxB.lineWidth = Math.max(wFull * br.width * 0.55, 0.75);
        ctxB.beginPath();
        for (let i = 0; i <= upto; i++) {
          const half = wFull * prof(i) * 0.5;
          const x = pts[i].x + nrms[i].x * br.offset * half;
          const y = pts[i].y + nrms[i].y * br.offset * half;
          if (i === 0) ctxB.moveTo(x, y);
          else ctxB.lineTo(x, y);
        }
        ctxB.stroke();
      }
      ctxB.globalAlpha = 1;
    };

    const renderBase = () => {
      ctxB.clearRect(0, 0, W, H);
      for (const s of strokes) drawStroke(s);
    };

    const sizeCanvas = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(Math.max(rect.width, 1) * dpr);
      canvas.height = Math.round(Math.max(rect.height, 1) * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return rect;
    };

    const resize = () => {
      const rect = sizeCanvas(base, ctxB);
      sizeCanvas(wet, ctxW); // wet layer resets on resize; acceptable
      W = Math.max(rect.width, 1);
      H = Math.max(rect.height, 1);
      scale = Math.max(W / 1440, 0.5);
      renderBase();
    };
    resize();

    if (reduced) {
      strokes.forEach((s) => {
        s.progress = 1;
      });
      renderBase();
      fireSettled();
    } else {
      const frame = (now: number) => {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        let allDone = true;
        for (const s of strokes) {
          if (s.progress >= 1) continue;
          const k = (elapsed - s.start) / s.dur;
          if (k <= 0) {
            allDone = false;
            continue;
          }
          s.progress = easeOutCubic(Math.min(k, 1));
          if (k < 1) allDone = false;
          else s.progress = 1;
        }
        renderBase();
        if (!allDone) {
          raf = requestAnimationFrame(frame);
        } else {
          fireSettled();
        }
      };
      raf = requestAnimationFrame(frame);
    }

    // Text shouldn't wait for the last accent flicks.
    const settleTimer = setTimeout(fireSettled, 2200);

    // ---- Pointer painting on the wet layer (the visitor's brush) ----
    const wetColors = [
      PALETTE.vermilion,
      PALETTE.ochre,
      PALETTE.paper,
      PALETTE.ember,
      PALETTE.smoke,
    ];
    let last: Pt | null = null;
    let hue = 0; // index into wetColors, advanced slowly
    let strokeDist = 0;
    const wetBristles = makeBristles(5);

    const toLocal = (e: PointerEvent): Pt | null => {
      const rect = wet.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;
      return { x, y };
    };

    const onMove = (e: PointerEvent) => {
      if (reduced) return;
      const p = toLocal(e);
      if (!p) {
        last = null;
        return;
      }
      if (!last) {
        last = p;
        return;
      }
      const dx = p.x - last.x;
      const dy = p.y - last.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 3) return;
      strokeDist += dist;
      if (strokeDist > 320) {
        hue = (hue + 1) % wetColors.length;
        strokeDist = 0;
      }
      const speed = Math.min(dist, 60);
      const w = Math.max(18 - speed * 0.22, 5) * scale;
      const nx = -dy / dist;
      const ny = dx / dist;
      ctxW.lineCap = 'round';
      for (const br of wetBristles) {
        const ox = nx * br.offset * w * 0.5;
        const oy = ny * br.offset * w * 0.5;
        ctxW.strokeStyle = wetColors[hue];
        ctxW.globalAlpha = 0.16 * br.alpha;
        ctxW.lineWidth = Math.max(w * br.width, 0.75);
        ctxW.beginPath();
        ctxW.moveTo(last.x + ox, last.y + oy);
        ctxW.lineTo(p.x + ox, p.y + oy);
        ctxW.stroke();
      }
      ctxW.globalAlpha = 1;
      last = p;
    };

    const onLeaveWindow = () => {
      last = null;
    };

    const onClick = (e: PointerEvent) => {
      if (reduced) return;
      const p = toLocal(e);
      if (!p) return;
      // A small splat: radial flicks around the click point.
      const color = wetColors[hue];
      const n = 7 + Math.floor(rand(0, 5));
      ctxW.lineCap = 'round';
      for (let i = 0; i < n; i++) {
        const a = rand(0, Math.PI * 2);
        const r0 = rand(2, 8) * scale;
        const r1 = r0 + rand(10, 44) * scale;
        ctxW.strokeStyle = color;
        ctxW.globalAlpha = rand(0.2, 0.55);
        ctxW.lineWidth = rand(1.5, 5) * scale;
        ctxW.beginPath();
        ctxW.moveTo(p.x + Math.cos(a) * r0, p.y + Math.sin(a) * r0);
        ctxW.lineTo(p.x + Math.cos(a) * r1, p.y + Math.sin(a) * r1);
        ctxW.stroke();
      }
      ctxW.globalAlpha = 1;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onClick, { passive: true });
    window.addEventListener('blur', onLeaveWindow);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settleTimer);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onClick);
      window.removeEventListener('blur', onLeaveWindow);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className={styles.stack} aria-hidden="true">
      <canvas ref={baseRef} className={styles.canvas} />
      <canvas ref={wetRef} className={styles.canvas} />
    </div>
  );
}
