# Kanasu Gari

A local Next.js website for Kanasu Gari's handmade crochet collection. Cream, plum, dusty rose and sage; editorial imagery and tactile interactive browsing.

## Run on Windows

```powershell
npm.cmd install
npm.cmd run dev
```

Open http://localhost:3000. `npm.cmd` avoids PowerShell's script execution restriction. Production check: `npm.cmd run build`. Start a production build with `npm.cmd start`.

## Implemented

- Responsive homepage, collection categories and scroll reveals.
- Product carousel with touch scrolling, mouse dragging and arrow controls.
- Persistent local favorites and saved-only filtering.
- Product detail dialog with keyboard focus management, Escape close and enquiry action.
- Interactive handmade shelf with layered hover/focus states.
- Custom enquiry builder with product, color and a free-text note; copies a message for the visitor to send on Instagram.
- Original product video posters, hover playback and links to source posts.
- Brand introduction, social journal, FAQ and reduced-motion CSS.

This version is enquiry-led. Product availability and pricing are confirmed by the maker. No payment, inventory, order submission or messaging backend is connected. Selecting a color records a preference; it does not guarantee a material or alter the pictured product.

## Content and assets

`lib/products.ts` contains products and source links. The catalogue is based on the public Instagram research in `research/instagram/`. Product titles are editorial display names; descriptions distinguish unconfirmed details. Update these with approved catalogue details before launch.

`public/media/` contains six original product clips and two source photos downloaded from source media URLs; `public/images/` contains extracted posters. The posts remain linked. `scripts/fetch-media.mjs` downloads the researched clips, and `scripts/prepare-media.mjs` prepares posters with ffmpeg-static. CDN links in the research snapshot may expire.

The hero/still-life is AI-generated concept imagery and is labeled as such in the UI; it does not depict an exact sale item. See `ASSETS.md` for provenance and prompt. Product cards use real collection media. Maker biography, testimonials, prices and fulfillment promises have not been invented.

## Verification

The initial production build completed successfully, including TypeScript validation. The local homepage returned HTTP 200. Browser automation could not capture Chrome because the browser access host was unavailable and the native window was minimized; visual desktop/mobile and interaction QA remain to be completed in a browser.

## Remaining before launch

Confirm the logo, maker story, current catalogue, pricing, available customizations, delivery/payment policies and final contact flow. Review media permissions and replace video screenshots with clean product photography where available. Add direct checkout only if required. No hosted deployment has been created.
