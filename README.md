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
| `assets/` | Signalbound lockup and mark, potion.game wordmark, potion sprites. All pixel art; scale only in whole multiples. |
| `og/og.html` → `og.png` | Link-preview card, 1200×630. |
| `CNAME`, `.nojekyll` | GitHub Pages custom domain and "serve files as they are". |

## Preview locally

```bash
python3 -m http.server 4181
```

Then open http://localhost:4181/.

## Regenerate the link-preview card

Edit `og/og.html`, then screenshot it with headless Chrome:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1200,630 --virtual-time-budget=4000 --screenshot="$PWD/og.png" "file://$PWD/og/og.html"
```

## Deploy

**GitHub Pages:** Settings → Pages → Source "Deploy from a branch", branch `main`,
folder `/ (root)`. The `CNAME` file sets the custom domain to `signalbound.xyz`;
tick "Enforce HTTPS" once the certificate is issued.

DNS at the registrar: `A` records for the apex (`signalbound.xyz`) pointing at
`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, and
optionally a `CNAME` for `www` → `signalbound-xyz.github.io`. The existing
`testnet.signalbound.xyz` record is untouched.

**Vercel or any static host** works just as well: import the repository, framework
"Other", no build command, output directory `/`.

## Links to flip when potion.game points at the game

`potion.game` currently shows the registrar's parking page, so the site sends
players to the testnet build. When the domain serves the game, replace these in
`index.html`:

- `https://testnet.signalbound.xyz` → `https://potion.game` (two CTAs and the footer link)
- `https://testnet.signalbound.xyz/game-rules/2026-10-29-balance.html` → the game's current rules page
- `https://testnet.signalbound.xyz/terms/2026-10-27.html` → the game's current Terms of Use

## Brand rules

- Pixel art is scaled only in whole multiples: lockup 102×32 (2× header, 6× OG card),
  mark 18×28 (2× footer, 8× hero seal), potion.game wordmark 82×14 (6×, 4×, 3×).
- Signalbound is the maker's mark, potion.game is the product. The game card is where
  the label voice lives (warnings, potion facts); the studio copy stays plain.
- Colours and type come from `label.css`: paper `#f3e7c9`, ink `#15110e`, night
  `#101215`, red `#c8372d`, liquid `#e85d3a`; Silkscreen for display, VT323 for body.
