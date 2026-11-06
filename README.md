# signalbound.xyz

The Signalbound studio site: one static page, no build step. Signalbound is the
studio; [Rookrift](https://rookrift.xyz) tells The Unfinished Tapestry, a chess
story woven across twelve chapters, and
Potion Game is its upcoming pixel bag battler (domain potion.game).

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | The page. Hero, two side-by-side game cards (Rookrift, Potion Game) with expandable details, studio principles, footer. Cards stack on phones. |
| `site.css` | Page styles. Builds on `label.css`. |
| `label.css` | The shared potion label system (cream card, facts panel, bag grid), copied from the potion.game brand kit. |
| `fonts/` | Silkscreen, VT323, Jacquard 24 and Pixelify Sans (OFL, see `fonts/LICENSE.md`). |
| `assets/` | Studio mark, lockup and wordmark, the game's crowned-flask mark and its Potion Game lockup (both copied from the game repo's `web/public/assets`, never redrawn here), potion sprites and supplied game banners. Scale pixel-art assets only in whole multiples. |
| `tools/logo.mjs` | Draws the studio ghost, wordmark and lockup from pixel maps; exports the favicons, `apple-touch-icon.png`, `icon-512.png` and the inline hero mark. |
| `assets/rookrift/banner.png` | Supplied 2448×1344 “The Unfinished Tapestry” Rookrift banner. Displayed in full without cropping. |
| `assets/rookrift/` | The current banner and retained castle, Rookie and pawn artwork from the original banner component. |
| `assets/potion-game-thumbnail.png` | Default 1224×672 Potion Game thumbnail selected by the user, with the existing Potion Game logo and “Small bag. Big trouble.” headline. Displayed in full without cropping. |
| `tools/rookrift.mjs` | Exports the Rookrift banner artwork as static PNG/SVG assets, without the prototype runtime. Run with Node; requires `rsvg-convert`. |
| `og/og.html` → `og.png` | Link-preview card, 1200×630. |
| `og/x-banner.html` | X profile header, 1500×500; render it the same way as the OG card with `--window-size=1500,500`. The studio avatar for X is the padded icon from `tools/logo.mjs` (`iconSVG({ size: 25, background: true })` at 16 px per cell). |

## Preview locally

```bash
python3 -m http.server 4181
```

Then open http://localhost:4181/.

## Regenerate the studio logo and icons

```bash
node tools/logo.mjs
```

Needs `rsvg-convert` (librsvg) and ImageMagick's `magick`. Edit the pixel maps and
glyph tables at the top of the script; everything else is derived.

## Regenerate the link-preview card

Edit `og/og.html`, then screenshot it with headless Chrome:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1200,630 --virtual-time-budget=4000 --screenshot="$PWD/og.png" "file://$PWD/og/og.html"
```

## Deploy

Hosted on **Vercel**, next to the testnet build. The repository is imported as a
Vercel project with framework preset "Other", no build command and the repository
root as the output directory, so every push to `main` deploys the page as is.

DNS lives at Cloudflare. In Project → Settings → Domains add `signalbound.xyz`
(and `www.signalbound.xyz` as a redirect to the apex); Vercel then shows the exact
records to create. As of November 2026 that is an `A` record for the apex pointing
at `76.76.21.21` and a `CNAME` for `www` pointing at the project's Vercel DNS
target. Create both as "DNS only" (grey cloud) so Vercel can issue the certificate.
The existing `testnet.signalbound.xyz` record is untouched.

## Potion Game launch

Potion Game is marked "Soon" with no play or rules links on the studio page.
Its expanded details use the same text sections as Rookrift, without a facts panel.
When the game launches, update the card's status and replace the disabled "Coming soon" button with
a play link; add its link to the footer too.

The footer still links to the existing Terms of Use at
`https://testnet.potion.game/terms/2026-10-27.html`; update this to the current terms
at launch.

## Brand rules

- Pixel art is scaled only in whole multiples: studio lockup 82×16 (3× header, 6× OG
  card), studio mark 13×16 (2× footer, 10× hero, 8× on phones), Potion Game lockup
  67×32 (3× on the game card, 2× on narrow phones, 3× on the OG card and X banner).
- Signalbound is the studio and owns the ghost. Potion Game is the game and keeps its
  own crowned-flask icon, lockup and potion sprites, untouched: the lockup here is the
  game's own file. The name is written "Potion Game"; potion.game is only the domain. The game card is where the
  label voice lives (warnings, potion facts); the studio copy stays plain.
- Colours and type come from `label.css`: paper `#f3e7c9`, ink `#15110e`, night
  `#101215`, red `#c8372d`, liquid `#e85d3a`, plus signal teal `#5ad1c8` for the studio;
  Silkscreen for display, VT323 for body.
- Rookrift uses the supplied “The Unfinished Tapestry” banner without overlays or
  cropping. Its card retains violet borders, orange actions, Jacquard 24 feature
  headings and the Pixelify Sans tagline. Its self-hosted fonts and their OFL
  licenses are in `fonts/`; its card comes before Potion Game.
