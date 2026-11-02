# signalbound.xyz

The Signalbound studio site: one static page, no build step. Signalbound is the
studio; [potion.game](https://potion.game) is the game it makes.

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | The page. Hero, "Now pouring" game card for potion.game, studio principles, footer. |
| `site.css` | Page styles. Builds on `label.css`. |
| `label.css` | The shared potion label system (cream card, facts panel, bag grid), copied from the potion.game brand kit. |
| `fonts/` | Silkscreen and VT323 (OFL, see `fonts/LICENSE.md`). |
| `assets/` | Studio mark, lockup and wordmark, the game's crowned-flask mark (static and 4-frame idle, from the game repo) and its potion.game lockup (flask + lowercase wordmark, generated; animated, ink and static variants), potion sprites. All pixel art; scale only in whole multiples. |
| `tools/logo.mjs` | Draws the studio ghost, wordmark and lockup from pixel maps; exports the favicons, `apple-touch-icon.png`, `icon-512.png` and the inline hero mark. |
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

## Links to flip when potion.game points at the game

`potion.game` currently shows the registrar's parking page, so the site sends
players to the testnet build. When the domain serves the game, replace these in
`index.html`:

- `https://testnet.signalbound.xyz` → `https://potion.game` (two CTAs and the footer link)
- `https://testnet.signalbound.xyz/game-rules/2026-10-29-balance.html` → the game's current rules page
- `https://testnet.signalbound.xyz/terms/2026-10-27.html` → the game's current Terms of Use

## Brand rules

- Pixel art is scaled only in whole multiples: studio lockup 82×16 (3× header, 6× OG
  card), studio mark 13×16 (2× footer, 10× hero, 8× on phones), potion.game lockup
  98×28 (3× on the game card, 2× on narrow phones, 3× ink variant on the OG card).
- Signalbound is the studio and owns the ghost. potion.game is the game and keeps its
  own crowned-flask icon and potion sprites, untouched; its lockup pairs that flask with
  a lowercase pixel wordmark (".game" in liquid red). The game card is where the
  label voice lives (warnings, potion facts); the studio copy stays plain.
- Colours and type come from `label.css`: paper `#f3e7c9`, ink `#15110e`, night
  `#101215`, red `#c8372d`, liquid `#e85d3a`, plus signal teal `#5ad1c8` for the studio;
  Silkscreen for display, VT323 for body.
