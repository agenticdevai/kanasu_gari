# KanasuGari: interactive website reference analysis

Reviewed on 10 November 2026.

Reference source: `C:/Users/vijit/Documents/noolam-saree-3d-main`.
Live reference: https://saree-website-cyan.vercel.app/#look

## Findings

The reference is a single-page Next.js 15.5.29 application with React 19.1.0, TypeScript 5.7.2, Three.js 0.170.0 and Lenis 1.3.26. It uses plain CSS, custom SVG art and icons, and native HTML video. Its package does not include Tailwind, GSAP, Framer Motion, React Three Fiber, a commerce SDK or a CMS SDK.

`app/page.tsx` composes the page from independent section components. `app/layout.tsx` supplies metadata and Inter, Anton and Cormorant Garamond through next/font. `app/globals.css` defines the visual system and responsive rules, including breakpoints at 1100px and 680px.

The KanasuGari workspace contained only `.git` when inspected. No existing application or brand assets were available to adapt.

## UI and interaction map

| Experience | Source | Implementation |
| --- | --- | --- |
| Opening fabric curtain | `Intro.tsx`, `three/Curtain3D.tsx` | Timed WebGL cloth reveal, CSS/SVG fallback, temporary scroll lock |
| Floating navigation | `Navbar.tsx` | Glass effect, scroll-dependent state, anchor navigation and bag indicator |
| Full-screen hero | `Hero.tsx` | Layered image/art, gradient overlays, slow CSS zoom and calls to action |
| Collection moods | `SixMoods.tsx` | Arch-shaped cards, hover treatments, staggered reveals |
| Try the Look | `TryTheLook.tsx` | Pointer drag and horizontal-wheel carousel; position controls scale, blur, opacity and stacking; selected look updates a product panel and bundle price |
| Pick a Silk | `PickASilk.tsx` | Scrollable card arc, pointer-driven CSS tilt and glare, add animation |
| Interactive rack | `TheRack.tsx`, `three/SilkRack3D.tsx` | Category filters, raycast interaction, hanging simulated garments |
| Product inspection | `three/SilkDetail3D.tsx` | Drag rotation, pointer fabric impulses, front/back view; React handles size selection and add action |
| Film | `MuseFilm.tsx` | Native video, sound control, surrounding animated imagery |
| Reels | `MuseReels.tsx` | Curved card presentation, playback/progress logic and full-screen viewer |
| Bridal edit | `Bridal.tsx` | Curved product presentation and selection |
| Weave | `Weave.tsx` | Three.js ribbons braid according to scroll position; selection updates pricing |
| Ticker and footer | `Ticker.tsx`, `Footer.tsx` | CSS marquee and brand/navigation content |

The name “Try the Look” describes a styled carousel. It does not implement camera-based or body-aware virtual try-on.

## How the 3D works

1. `lib/silk/texture.ts` paints fabric patterns onto canvas and creates Three.js textures, including surface maps. Silk sheen and metallic borders come from physical materials.
2. `lib/silk/cloth.ts` represents cloth as particles and constraints. Verlet integration, gravity, damping and repeated constraint solving move the fabric while pinned particles hold it to the hanger. Pointer impulses ruffle nearby particles.
3. `lib/silk/garment.ts` combines generated garment geometry, cloth and a hanger.
4. `lib/silk/stage.ts` provides the WebGL renderer, perspective camera, lights, studio reflections, resize handling and resource cleanup. Pixel ratio is capped at 1.75; simulation/render work is skipped when the stage is off-screen, although its animation callback continues.
5. React components create the scene after mounting and dispose it when unmounted. This is direct Three.js, without a React Three Fiber layer.

Most other apparent depth effects are CSS transforms, perspective, blur, shadows and stacking. They do not require WebGL.

## Data and media

`lib/data.ts` holds static products, prices, category filters, looks and editorial content. `components/store.tsx` exposes bag count, total, likes and toast notifications through React Context. State is not persisted; it is not a complete cart with editable line items or server-validated pricing.

`Photo.tsx` attempts PNG, JPG, JPEG and WebP assets and falls back to procedural SVG from `Art.tsx`. The inspected checkout has no `public` folder. `IMAGE-PROMPTS.md` and `scripts/images.mjs` document intended image production and asset checks. Production photography and videos are separate deliverables.

The deployed page returned successfully and exposes the same broad section structure, but some product labels, copy and metadata differ from local source. Treat the local code and deployed website as related revisions. Live-page retrieval verified content, not the appearance or behavior of every animation.

## What is still needed for a production store

- A real product catalogue with images, variants, accurate prices and availability.
- A persistent cart with line items, quantity changes and removal.
- Server-validated checkout, payment, order handling, shipping and tax rules if online purchasing is required.
- Content management or another clear process for maintaining products and stories.
- Keyboard and touch interaction checks, focus management, sufficient image descriptions and motion preferences across all animated sections.
- Lazy loading for expensive 3D scenes, device-appropriate quality and static fallbacks when WebGL is unavailable. The intro has a fallback; do not assume every other scene does.
- Image optimization and video loading budgets, mobile performance checks, analytics and production metadata.
- Review of code and asset reuse rights. The README credits a separate original concept; attribution is not a substitute for checking licensing.

## KanasuGari adaptation plan

Preserve the reference's interaction language: a memorable entrance, large editorial imagery, tactile product browsing, smooth reveals, a focused product inspection experience and short brand films. Give KanasuGari its own typography, colors, composition, imagery and copy.

Before choosing the final sections, establish what KanasuGari offers, its audience, brand assets and whether conversion means purchase, enquiry or discovery. Fabric simulation fits textile products; other categories need interactions that demonstrate their own materials and use.

Suggested implementation sequence:

1. Define brand tokens, navigation, product/content types and the primary conversion flow.
2. Build a responsive hero, collection categories, product cards, brand story and contact/footer using real content where available.
3. Add one signature interactive browsing section with touch and keyboard support.
4. Add 3D only where it improves product understanding, with a static alternative and on-demand loading.
5. Connect catalogue management and the agreed purchase or enquiry flow.
6. Verify desktop/mobile layouts, reduced motion, failure states and loading performance before deployment.

No application scaffolding, dependency installation or deployment was performed during this analysis.
