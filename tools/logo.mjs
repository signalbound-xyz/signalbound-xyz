#!/usr/bin/env node
// Signalbound studio logo. Pixel maps → SVG (mark, icon, wordmark, lockup),
// PNG icons via rsvg-convert, favicon.ico via ImageMagick, and the inline hero
// mark in index.html (between the studio-mark markers). Run from anywhere:
//   node tools/logo.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const ASSETS = path.join(ROOT, "assets");

// Palette: the site's ink/cream/red plus one studio colour, signal teal.
const COLOR = {
  K: "#15110e", // ink
  C: "#f3e7c9", // cream
  R: "#e85d3a", // antenna tip
  T: "#5ad1c8", // signal teal
  P: "#f0a08a", // cheeks
  H: "#f3e7c9", // bulb highlight
  S: "#3a2a1f", // wordmark shadow on night
  D: "#cdb98c", // wordmark shadow on paper
  N: "#101215", // night (icon backgrounds)
};

// The mark: a ghost bound to a signal. 13 × 16 cells.
const MARK = [
  "...T.HRR.T...",
  "..T..RRR..T..",
  "..T..RRR..T..",
  "...T..K..T...",
  "...KKKKKKK...",
  ".KKCCCCCCCKK.",
  "KCCCCCCCCCCCK",
  "KCCKKCCCKKCCK",
  "KCCKKCCCKKCCK",
  "KCPCCCCCCCPCK",
  "KCCCKCCCKCCCK",
  "KCCCCKKKCCCCK",
  "KCCCCCCCCCCCK",
  "KCCCCCCCCCCCK",
  "KCCCCCCCCCCCK",
  "KCCKCCKCCKCCK",
];
const MARK_W = 13;
const MARK_H = 16;

// 5 × 7 capitals for the wordmark.
const FONT5 = {
  S: [".XXX.", "X...X", "X....", ".XXX.", "....X", "X...X", ".XXX."],
  I: ["XXXXX", "..X..", "..X..", "..X..", "..X..", "..X..", "XXXXX"],
  G: [".XXX.", "X...X", "X....", "X.XXX", "X...X", "X...X", ".XXX."],
  N: ["X...X", "XX..X", "X.X.X", "X..XX", "X...X", "X...X", "X...X"],
  A: [".XXX.", "X...X", "X...X", "XXXXX", "X...X", "X...X", "X...X"],
  L: ["X....", "X....", "X....", "X....", "X....", "X....", "XXXXX"],
  B: ["XXXX.", "X...X", "X...X", "XXXX.", "X...X", "X...X", "XXXX."],
  O: [".XXX.", "X...X", "X...X", "X...X", "X...X", "X...X", ".XXX."],
  U: ["X...X", "X...X", "X...X", "X...X", "X...X", "X...X", ".XXX."],
  D: ["XXXX.", "X...X", "X...X", "X...X", "X...X", "X...X", "XXXX."],
};
// 3 × 5 capitals for the small STUDIO tag.
const FONT3 = {
  S: ["XXX", "X..", "XXX", "..X", "XXX"],
  T: ["XXX", ".X.", ".X.", ".X.", ".X."],
  U: ["X.X", "X.X", "X.X", "X.X", "XXX"],
  D: ["XX.", "X.X", "X.X", "X.X", "XX."],
  I: ["XXX", ".X.", ".X.", ".X.", "XXX"],
  O: ["XXX", "X.X", "X.X", "X.X", "XXX"],
};

function gridPixels(rows, x0 = 0, y0 = 0) {
  const out = [];
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch !== ".") out.push({ x: x + x0, y: y + y0, c: ch });
    });
  });
  return out;
}
function textPixels(text, font, x0, y0, c, gap = 1) {
  const out = [];
  let x = x0;
  for (const L of text) {
    const g = font[L];
    if (!g) throw new Error(`no glyph for ${L}`);
    g.forEach((row, y) => [...row].forEach((b, i) => b === "X" && out.push({ x: x + i, y: y0 + y, c })));
    x += g[0].length + gap;
  }
  return out;
}
function textWidth(text, font, gap = 1) {
  return [...text].reduce((w, L) => w + font[L][0].length + gap, 0) - gap;
}
function paths(pixels) {
  const byColor = new Map();
  for (const p of pixels) byColor.set(p.c, (byColor.get(p.c) ?? "") + `M${p.x} ${p.y}h1v1h-1z`);
  return [...byColor].map(([c, d]) => `<path fill="${COLOR[c]}" d="${d}"/>`).join("");
}
function svg({ w, h, body, label, scale = 1, attrs = "", aria = true }) {
  const a11y = aria ? ` role="img" aria-label="${label}"` : ` aria-hidden="true"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * scale}" height="${h * scale}" shape-rendering="crispEdges"${a11y}${attrs}>${body}</svg>\n`;
}
function shadowed(pixels, c = "S") {
  return [...pixels.map((p) => ({ x: p.x + 1, y: p.y + 1, c })), ...pixels];
}

// Mark body with groups so CSS can animate the antenna tip and the arcs.
function markBody(x0 = 0, y0 = 0) {
  const all = gridPixels(MARK, x0, y0);
  const mid = x0 + 6;
  const arcL = all.filter((p) => p.c === "T" && p.x < mid);
  const arcR = all.filter((p) => p.c === "T" && p.x > mid);
  const tip = all.filter((p) => p.c === "R" || p.c === "H");
  const body = all.filter((p) => !"TRH".includes(p.c));
  return `<g class="arc arc-l">${paths(arcL)}</g><g class="arc arc-r">${paths(arcR)}</g><g class="tip">${paths(tip)}</g><g class="body">${paths(body)}</g>`;
}
export function markSVG(opts = {}) {
  return svg({ w: MARK_W, h: MARK_H, body: markBody(), label: "Signalbound", ...opts });
}
// Padded 16 × 16 for favicons; optional night background for app icons.
export function iconSVG({ size = 16, background = false, scale = 1 } = {}) {
  const x0 = Math.floor((size - MARK_W) / 2);
  const y0 = Math.floor((size - MARK_H) / 2);
  const bg = background ? `<rect width="${size}" height="${size}" fill="${COLOR.N}"/>` : "";
  return svg({ w: size, h: size, body: bg + markBody(x0, y0), label: "Signalbound", scale });
}
export function wordmarkSVG({ scale = 1 } = {}) {
  const letters = textPixels("SIGNALBOUND", FONT5, 0, 0, "C");
  const w = textWidth("SIGNALBOUND", FONT5) + 1;
  return svg({ w, h: 8, body: paths(shadowed(letters)), label: "Signalbound", scale });
}
export function lockupSVG({ scale = 1 } = {}) {
  const wordX = MARK_W + 3;
  const word = textPixels("SIGNALBOUND", FONT5, wordX, 1, "C");
  const wordW = textWidth("SIGNALBOUND", FONT5);
  const tagW = textWidth("STUDIO", FONT3);
  const tag = textPixels("STUDIO", FONT3, wordX + wordW - tagW, 10, "T");
  const w = wordX + wordW + 1; // +1 for the shadow column
  const body = markBody(0, 0) + paths(shadowed([...word, ...tag]));
  return svg({ w, h: MARK_H, body, label: "Signalbound Studio", scale });
}

// Lowercase glyphs for the potion.game wordmark: 2-px strokes, rows relative to
// the x-height top (ascenders negative, descenders 7..9). Same letterforms as the
// game's brand kit; the icon beside them is the game's own crowned flask.
const FONT_LC = {
  p: [[0, "######."], [1, "#######"], [2, "##...##"], [3, "##...##"], [4, "##...##"], [5, "#######"], [6, "######."], [7, "##....."], [8, "##....."], [9, "##....."]],
  o: [[0, ".#####."], [1, "#######"], [2, "##...##"], [3, "##...##"], [4, "##...##"], [5, "#######"], [6, ".#####."]],
  t: [[-3, ".##.."], [-2, ".##.."], [-1, "#####"], [0, "#####"], [1, ".##.."], [2, ".##.."], [3, ".##.."], [4, ".##.."], [5, ".##.#"], [6, "..###"]],
  i: [[-3, "##"], [-2, "##"], [0, "##"], [1, "##"], [2, "##"], [3, "##"], [4, "##"], [5, "##"], [6, "##"]],
  n: [[0, "##.###."], [1, "#######"], [2, "##...##"], [3, "##...##"], [4, "##...##"], [5, "##...##"], [6, "##...##"]],
  g: [[0, ".######"], [1, "#######"], [2, "##...##"], [3, "##...##"], [4, "##...##"], [5, "#######"], [6, ".######"], [7, ".....##"], [8, "#######"], [9, ".#####."]],
  a: [[0, ".#####."], [1, ".....##"], [2, ".######"], [3, "#######"], [4, "##...##"], [5, "#######"], [6, ".######"]],
  m: [[0, "#######."], [1, "########"], [2, "##.##.##"], [3, "##.##.##"], [4, "##.##.##"], [5, "##.##.##"], [6, "##.##.##"]],
  e: [[0, ".#####."], [1, "#######"], [2, "##...##"], [3, "#######"], [4, "##....."], [5, "#######"], [6, ".#####."]],
  ".": [[5, "##"], [6, "##"]],
};
const LC_ASCENT = 3; // rows above the x-height top
const LC_ROWS = 13; // -3..9

function lowerPixels(text, x0, y0, colorFor) {
  const out = [];
  let x = x0;
  for (const ch of text) {
    const glyph = FONT_LC[ch];
    if (!glyph) throw new Error(`no lowercase glyph for ${ch}`);
    let width = 0;
    for (const [row, bits] of glyph) {
      width = Math.max(width, bits.length);
      [...bits].forEach((b, i) => b === "#" && out.push({ x: x + i, y: y0 + row + LC_ASCENT, c: colorFor(ch) }));
    }
    x += width + 1;
  }
  return { pixels: out, width: x - x0 - 1 };
}
// The game's own mark, inlined (an SVG inside <img> may not load external images).
// signalbound-mark-idle.svg carries the 4-frame idle animation (SMIL), so the
// lockup animates by itself; the static mark is used for the reduced-motion copy.
function gameMarkInner(file = "signalbound-mark-idle.svg") {
  const raw = fs.readFileSync(path.join(ASSETS, file), "utf8").replace(/<metadata>[\s\S]*?<\/metadata>/, "");
  return raw.slice(raw.indexOf(">") + 1, raw.lastIndexOf("</svg>")).trim();
}
const GAME_MARK_W = 18;
const GAME_MARK_H = 28;
export function gameLockupSVG({ scale = 1, ink = false, animated = true } = {}) {
  const textX = GAME_MARK_W + 3;
  const textY = Math.floor((GAME_MARK_H - LC_ROWS) / 2); // 7: rows 7..19, shadow to 20
  let seenDot = false;
  const colorFor = (ch) => {
    if (ch === ".") seenDot = true;
    return seenDot ? "R" : ink ? "K" : "C"; // "potion" cream (ink on paper), ".game" liquid
  };
  const { pixels, width } = lowerPixels("potion.game", textX, textY, colorFor);
  const w = textX + width + 1;
  const body = `<g class="game-mark">${gameMarkInner(animated ? "signalbound-mark-idle.svg" : "signalbound-mark.svg")}</g>` + paths(shadowed(pixels, ink ? "D" : "S"));
  return svg({ w, h: GAME_MARK_H, body, label: "potion.game", scale });
}

// ---------- write files ----------
fs.mkdirSync(ASSETS, { recursive: true });
const files = {
  "assets/studio-mark.svg": markSVG(),
  "assets/studio-icon.svg": iconSVG(),
  "assets/studio-wordmark.svg": wordmarkSVG(),
  "assets/studio-lockup.svg": lockupSVG(),
  "favicon.svg": iconSVG(),
  "assets/potion-game-lockup.svg": gameLockupSVG(),
  "assets/potion-game-lockup-ink.svg": gameLockupSVG({ ink: true }),
  "assets/potion-game-lockup-static.svg": gameLockupSVG({ animated: false }),
};
for (const [rel, body] of Object.entries(files)) {
  fs.writeFileSync(path.join(ROOT, rel), body);
  console.log("svg ", rel);
}

function render(svgText, outRel, size) {
  const tmp = path.join(ROOT, ".logo-tmp.svg");
  fs.writeFileSync(tmp, svgText);
  const r = spawnSync("rsvg-convert", ["-w", String(size), "-h", String(size), "-o", path.join(ROOT, outRel), tmp], { stdio: "inherit" });
  fs.rmSync(tmp, { force: true });
  if (r.status !== 0) throw new Error(`rsvg-convert failed for ${outRel}`);
  console.log("png ", outRel, `${size}px`);
}
render(iconSVG(), "favicon-16x16.png", 16);
render(iconSVG(), "favicon-32x32.png", 32);
render(iconSVG(), "favicon-64x64.png", 64);
render(iconSVG({ size: 20, background: true }), "apple-touch-icon.png", 180); // 9× on a 20-cell canvas
render(iconSVG({ size: 32, background: true }), "icon-512.png", 512); // 16× on a 32-cell canvas
const ico = spawnSync("magick", ["favicon-16x16.png", "favicon-32x32.png", "favicon-64x64.png", "favicon.ico"], { cwd: ROOT, stdio: "inherit" });
if (ico.status !== 0) throw new Error("magick failed for favicon.ico");
console.log("ico  favicon.ico");

// Inline hero mark in index.html.
const indexPath = path.join(ROOT, "index.html");
if (fs.existsSync(indexPath)) {
  const html = fs.readFileSync(indexPath, "utf8");
  const start = "<!-- studio-mark:start -->";
  const end = "<!-- studio-mark:end -->";
  const a = html.indexOf(start);
  const b = html.indexOf(end);
  if (a !== -1 && b !== -1) {
    const inline = markSVG({ scale: 10, aria: false, attrs: ' class="px studio-ghost"' }).trim();
    fs.writeFileSync(indexPath, html.slice(0, a + start.length) + "\n        " + inline + "\n        " + html.slice(b));
    console.log("html index.html: inline mark updated");
  } else {
    console.log("html index.html: no studio-mark markers, skipped");
  }
}
