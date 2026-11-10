# Asset provenance

## Concept hero

- Tool: built-in image generation.
- Original: `public/images/hero-crochet.png`.
- Optimized website asset: `public/images/hero-crochet.webp` (about 207 KB).
- Usage: hero, story and unavailable-media fallback; labeled as concept styling.
- Prompt: “Use case: product-mockup. Asset type: editorial website hero image for Kanasu Gari handmade crochet concept. Generate a beautiful premium realistic still-life photo, landscape 3:2 composition. A handmade soft cream long-eared crochet bunny sitting center-right on draped warm ivory linen, next to a small terracotta pot with three crocheted daisy flowers, yellow centers, cream petals, sage leaves. On left foreground one dusty rose yarn ball and a smaller pale sage yarn ball, a wooden crochet hook and trailing yarn thread. Behind subtle blush fabric. Warm natural morning window light from upper left, visible exquisite handmade cotton stitches, tactile fibers, muted cream blush sage palette, quiet joyful artisanal boutique mood, soft film texture and depth of field. Objects fill composition with generous cream negative space above. Photographic, no cartoon, no text, no branding, no watermarks. This is illustrative concept imagery, not an exact representation of existing products.”

## Original collection media

Six video clips, two source photos, and prepared JPG posters are from public Kanasu Gari Instagram posts. `lib/products.ts` maps each local asset to the canonical post. The downloadable URL snapshot and captions are preserved in `research/instagram/kanasu-gari-posts.json`.

The extracted frames retain original video content and overlays. Clean studio product photos can replace these posters without changing the product data model. The generated hero is not a substitute for accurate catalogue photography.
