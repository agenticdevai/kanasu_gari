# Kanasu Gari — immersive revision

The initial boutique layout has been superseded. Its page and styles are preserved in `research/website-v1.tsx` and `research/website-v1.css`.

The revised application follows the reference composition and interaction mechanisms:

| Reference | Kanasu Gari |
| --- | --- |
| WebGL silk curtain | Plum, crochet-textured curtain, using the reference's particle cloth physics |
| Floating glass pill navigation and full-screen hero | Glass pill navigation, full-bleed crochet concept scene, bold layered headlines |
| Six arched moods | Six arched collection windows with real product photos |
| Draggable look carousel and panel | Depth/blur carousel, selected creation panel and custom enquiry |
| Pick-a-silk arc | Bright typographic cards, geometric arc, mouse/touch dragging, pointer tilt and glare |
| 3D rack and inspection | Procedural crochet bunny, flowers, bag, cushion, keychain, gajra and rangoli; hover, select and drag rotation |
| Film with flanking photos | Original collection film with flanking product imagery |
| Curved reel theater | Perspective reel carousel with play/pause and modal video playback |
| Scroll-driven ribbon braid | Three volumetric yarn tubes braid with scroll; shade choices update live materials |
| Fixed ticker and dark footer | Plum brand ticker and large typographic footer |

`lib/scene/stage.ts` and `lib/scene/cloth.ts` were adapted from the user-supplied reference checkout. `Curtain3D.tsx` adapts its opening curtain. The new `lib/scene/yarn.ts` draws stitch textures and constructs stylized 3D craft objects. The model previews are illustrations, not scans of actual products, and the UI distinguishes them from the original photos.

The application uses Next.js, React, direct Three.js and Lenis. Three.js sections load in separate client chunks. WebGL rendering is paused off-screen by the shared stage, and static alternatives are provided when scene creation fails. Motion preferences disable the intro and continuous decorative movement where supported.

The production build and TypeScript checks passed during this revision. The browser access host was unavailable; native computer use was stopped by the user. Visual desktop/mobile and WebGL interaction QA remain unverified. The development server runs at http://127.0.0.1:3000.

No checkout or server-side order processing is connected. Enquiries are prepared locally for the visitor to copy and send through Instagram. Prices, stock, making times and yarn availability remain confirmed with the maker.
