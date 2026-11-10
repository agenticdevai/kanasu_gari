import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* Shared WebGL stage: studio environment reflections (for silk sheen + metallic zari),
   neutral tone mapping, resize handling, and a render loop that pauses off-screen. */
export function createStage(host: HTMLElement, opts: { fov?: number; cam?: [number, number, number]; look?: [number, number, number]; exposure?: number } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = opts.exposure ?? 1.05;
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;

  const camera = new THREE.PerspectiveCamera(opts.fov ?? 30, 1, 0.05, 100);
  camera.position.set(...(opts.cam ?? [0, 0, 6]));
  camera.lookAt(...(opts.look ?? [0, 0, 0]));

  const key = new THREE.DirectionalLight(0xfff1dc, 1.5);
  key.position.set(2.5, 4, 5);
  const rim = new THREE.DirectionalLight(0xffe0b0, 0.9);
  rim.position.set(-4, 2, -3);
  const side = new THREE.DirectionalLight(0xffffff, 0.7);
  side.position.set(-3.5, 1, 2.5);
  scene.add(key, rim, side, new THREE.AmbientLight(0xffffff, 0.2));

  let w = 1, h = 1;
  const resize = () => {
    w = Math.max(1, host.clientWidth);
    h = Math.max(1, host.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "120px" });
  io.observe(host);

  let raf = 0;
  let last = performance.now();
  const start = (frame: (dt: number, t: number) => void) => {
    const tick = () => {
      raf = requestAnimationFrame(tick);
      // one clock (performance.now) for both ends; rAF timestamps can predate it -> negative dt
      const now = performance.now();
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = now;
      if (!visible) return;
      frame(dt, now / 1000);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);
  };

  /* world-space size of the view at depth z=0 */
  const viewSize = () => {
    const d = camera.position.z;
    const vh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * d;
    return { vw: vh * camera.aspect, vh };
  };

  const dispose = () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (mat) (Array.isArray(mat) ? mat : [mat]).forEach((x) => x.dispose());
    });
    envRT.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };

  return { renderer, scene, camera, start, viewSize, dispose, size: () => ({ w, h }) };
}
export type Stage = ReturnType<typeof createStage>;
