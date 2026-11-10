"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createStage } from "@/lib/scene/stage";
import { Cloth } from "@/lib/scene/cloth";
import { yarnMaterial, yarnTextures, type YarnSpec } from "@/lib/scene/yarn";

/* Two pleated silk curtain panels; they sway, then gather to the sides and swing open. */
export default function Curtain3D({ openAt, onDone, onFail }: { openAt: number; onDone: () => void; onFail: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const cb = useRef({ onDone, onFail });
  cb.current = { onDone, onFail };

  useEffect(() => {
    const el = host.current!;
    let stage: ReturnType<typeof createStage>;
    try {
      stage = createStage(el, { fov: 35, cam: [0, 0, 5], exposure: 1.15 });
    } catch {
      cb.current.onFail();
      return;
    }
    const { scene } = stage;
    const { vw, vh } = stage.viewSize();
    const spec: YarnSpec = { base: "#563449", accent: "#70475f", zari: "#d99aa5", pattern: "plain", shape: "curtain" };
    const COLS = 30, ROWS = 32, FOLDS = 13;
    const pw = (vw / 2) * 1.12, ph = vh * 1.12, top = (vh / 2) * 1.04;

    const panels = [-1, 1].map((side) => {
      const tex = yarnTextures(spec, 640, 768);
      if (side === 1) {
        // mirror so the zari border sits on the inner (centre) edge of both panels
        [tex.map, tex.orm, tex.bump].forEach((t) => {
          t.wrapS = THREE.RepeatWrapping;
          t.repeat.x = -1;
        });
      }
      const outer = side * (vw / 2) * 1.06;
      const span = -side * pw * 0.94;
      const cloth = new Cloth(COLS, ROWS, (c, r) => {
        const u = c / (COLS - 1), v = r / (ROWS - 1);
        return [outer + span * u, top - v * ph, Math.sin(u * Math.PI * FOLDS) * 0.09];
      });
      cloth.pinRow(0);
      cloth.iterations = 8;
      const base = cloth.pin.slice();
      const geo = new THREE.PlaneGeometry(1, 1, COLS - 1, ROWS - 1);
      const mesh = new THREE.Mesh(geo, yarnMaterial(tex, spec));
      scene.add(mesh);
      return { side, cloth, geo, tex, outer, base };
    });

    const t0 = performance.now() / 1000;
    let acc = 0, doneAt = 0;
    const f = (x: number, y: number, z: number, _i: number, out: Float32Array, t: number, open: number, side: number) => {
      out[2] += Math.sin(t * 1.4 + x * 1.3 + y * 0.8) * 0.9;
      out[0] += side * open * 3.5 * (0.5 + Math.sin(t * 2 + y) * 0.3);
    };

    stage.start((dt, now) => {
      const t = now - t0;
      const raw = Math.max(0, Math.min(1, (t - openAt / 1000) / 1.5));
      const open = raw < 0.5 ? 4 * raw ** 3 : 1 - (-2 * raw + 2) ** 3 / 2;
      const step = 1 / 60;
      acc = Math.min(acc + dt, 1 / 20);
      const steps = Math.floor(acc / step);
      acc -= steps * step;
      for (const p of panels) {
        // gather the top pins toward the outer edge and slide the panel off-screen
        for (let c = 0; c < COLS; c++) {
          const o = c * 3;
          const x0 = p.base[o];
          const x = p.outer + (x0 - p.outer) * (1 - 0.72 * open) + p.side * open * pw * 0.45;
          const u = c / (COLS - 1);
          p.cloth.setPin(c, x, p.base[o + 1], Math.sin(u * Math.PI * FOLDS) * (0.09 + 0.22 * open));
        }
        for (let s = 0; s < steps; s++) p.cloth.step(step, 6, (x, y, z, i, out) => f(x, y, z, i, out, t, open, p.side));
        const attr = p.geo.attributes.position as THREE.BufferAttribute;
        (attr.array as Float32Array).set(p.cloth.pos);
        attr.needsUpdate = true;
        p.geo.computeVertexNormals();
      }
      if (raw >= 1 && !doneAt) doneAt = t;
      if (doneAt && t - doneAt > 0.25) cb.current.onDone();
    });

    return () => {
      panels.forEach((p) => p.tex.dispose());
      stage.dispose();
    };
  }, [openAt]);

  return <div ref={host} className="curtain3d" />;
}
