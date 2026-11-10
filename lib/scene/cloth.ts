/* Position-based (Verlet) cloth. Particles map 1:1 to a THREE.PlaneGeometry's vertices
   (row-major, top row first), so UVs and indices come for free.
   Rest lengths are taken from the *initial* shape, so pleats and folds you seed persist. */

export class Cloth {
  readonly count: number;
  pos: Float32Array;
  prev: Float32Array;
  pinned: Uint8Array;
  pin: Float32Array;
  private a: Uint32Array;
  private b: Uint32Array;
  private rest: Float32Array;
  private stiff: Float32Array;
  damping = 0.982;
  iterations = 10;

  constructor(public cols: number, public rows: number, init: (c: number, r: number) => [number, number, number]) {
    this.count = cols * rows;
    this.pos = new Float32Array(this.count * 3);
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) this.pos.set(init(c, r), (r * cols + c) * 3);
    this.prev = this.pos.slice();
    this.pinned = new Uint8Array(this.count);
    this.pin = new Float32Array(this.count * 3);

    const A: number[] = [], B: number[] = [], K: number[] = [];
    const link = (i: number, j: number, k: number) => (A.push(i), B.push(j), K.push(k));
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        if (c + 1 < cols) link(i, i + 1, 1);
        if (r + 1 < rows) link(i, i + cols, 1);
        if (c + 1 < cols && r + 1 < rows) (link(i, i + cols + 1, 0.8), link(i + 1, i + cols, 0.8));
        if (c + 2 < cols) link(i, i + 2, 0.35);
        if (r + 2 < rows) link(i, i + 2 * cols, 0.35);
      }
    this.a = Uint32Array.from(A);
    this.b = Uint32Array.from(B);
    this.stiff = Float32Array.from(K);
    this.rest = new Float32Array(A.length);
    const p = this.pos;
    for (let k = 0; k < A.length; k++) {
      const i = A[k] * 3, j = B[k] * 3;
      this.rest[k] = Math.hypot(p[j] - p[i], p[j + 1] - p[i + 1], p[j + 2] - p[i + 2]);
    }
  }

  pinRow(r: number) {
    for (let c = 0; c < this.cols; c++) {
      const i = r * this.cols + c;
      this.pinned[i] = 1;
      this.pin.set(this.pos.subarray(i * 3, i * 3 + 3), i * 3);
    }
  }
  setPin(i: number, x: number, y: number, z: number) {
    this.pin[i * 3] = x;
    this.pin[i * 3 + 1] = y;
    this.pin[i * 3 + 2] = z;
  }

  /* force(x,y,z,i,out) writes an acceleration into out[0..2] */
  step(dt: number, gravity: number, force?: (x: number, y: number, z: number, i: number, out: Float32Array) => void) {
    const p = this.pos, q = this.prev, d = this.damping, dt2 = dt * dt;
    const f = new Float32Array(3);
    for (let i = 0; i < this.count; i++) {
      const o = i * 3;
      if (this.pinned[i]) {
        q[o] = p[o];
        q[o + 1] = p[o + 1];
        q[o + 2] = p[o + 2];
        p[o] = this.pin[o];
        p[o + 1] = this.pin[o + 1];
        p[o + 2] = this.pin[o + 2];
        continue;
      }
      f[0] = 0;
      f[1] = -gravity;
      f[2] = 0;
      if (force) force(p[o], p[o + 1], p[o + 2], i, f);
      for (let k = 0; k < 3; k++) {
        const v = (p[o + k] - q[o + k]) * d;
        q[o + k] = p[o + k];
        p[o + k] += v + f[k] * dt2;
      }
    }
    const { a, b, rest, stiff, pinned } = this;
    for (let it = 0; it < this.iterations; it++) {
      for (let k = 0; k < a.length; k++) {
        const ia = a[k], ib = b[k];
        const wa = pinned[ia] ? 0 : 1, wb = pinned[ib] ? 0 : 1;
        const w = wa + wb;
        if (!w) continue;
        const i = ia * 3, j = ib * 3;
        const dx = p[j] - p[i], dy = p[j + 1] - p[i + 1], dz = p[j + 2] - p[i + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
        const c = ((dist - rest[k]) / dist / w) * stiff[k];
        p[i] += dx * c * wa;
        p[i + 1] += dy * c * wa;
        p[i + 2] += dz * c * wa;
        p[j] -= dx * c * wb;
        p[j + 1] -= dy * c * wb;
        p[j + 2] -= dz * c * wb;
      }
    }
  }

  /* add velocity to particles near (x,y,z) — "poke the silk" */
  impulse(x: number, y: number, z: number, radius: number, vx: number, vy: number, vz: number) {
    const p = this.pos, q = this.prev, r2 = radius * radius;
    for (let i = 0; i < this.count; i++) {
      if (this.pinned[i]) continue;
      const o = i * 3;
      const d2 = (p[o] - x) ** 2 + (p[o + 1] - y) ** 2 + (p[o + 2] - z) ** 2;
      if (d2 > r2) continue;
      const w = 1 - Math.sqrt(d2) / radius;
      q[o] -= vx * w;
      q[o + 1] -= vy * w;
      q[o + 2] -= vz * w;
    }
  }
}
