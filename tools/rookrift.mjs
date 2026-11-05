// Artwork adapted from the user-supplied Rookrift banner component.
// Export static assets; the studio page does not need the prototype runtime.
// Run: node tools/rookrift.mjs (requires rsvg-convert).
import { mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const assets = fileURLToPath(new URL("../assets/rookrift/", import.meta.url));
mkdirSync(assets, { recursive: true });

const ROOKIE = [
  "..ooo.oooo.ooo..",
  "..ofo.ohfo.oso..",
  "..offffffffsso..",
  "..oooooooooooo..",
  "...offfffffso...",
  "...ofheffheso...",
  "...ofeeffeeso...",
  "...offfffffso...",
  "...ofmffffmso...",
  "...offmmmmfso...",
  "...offfffffso...",
  ".o.offfffffso.o.",
  "..ooffffffssoo..",
  "...offfffffso...",
  "...oooooooooo...",
  "....oo....oo....",
  "...oggo..oggo...",
  "...ogggo.ogggo..",
  "...ooooo.ooooo..",
];
const PAWN = [
  "................",
  "................",
  "......oooo......",
  ".....ohfffo.....",
  ".....offfso.....",
  ".....offsso.....",
  "......osso......",
  ".....offfso.....",
  "......offo......",
  "......offo......",
  ".....offfso.....",
  "....offffsso....",
  "...offffffsso...",
  "...oooooooooo...",
  "................",
  "................",
];

function drawScene(cv) {
  if (!cv) return;
  const W = 306,
    H = 168;
  cv.width = W;
  cv.height = H;
  const x = cv.getContext("2d");
  let seed = 23;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const rect = (X, Y, w, h, c) => {
    x.fillStyle = c;
    x.fillRect(Math.round(X), Math.round(Y), Math.round(w), Math.round(h));
  };
  const px = (X, Y, c) => rect(X, Y, 1, 1, c);
  const line = (x0, y0, x1, y1, c) => {
    x0 |= 0;
    y0 |= 0;
    x1 |= 0;
    y1 |= 0;
    const dx = Math.abs(x1 - x0),
      dy = -Math.abs(y1 - y0),
      sx = x0 < x1 ? 1 : -1,
      sy = y0 < y1 ? 1 : -1;
    let e = dx + dy,
      n = 0;
    while (n++ < 400) {
      px(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * e;
      if (e2 >= dy) {
        e += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        e += dx;
        y0 += sy;
      }
    }
  };
  const bands = [
    "#050309",
    "#08060f",
    "#0d0916",
    "#130c1e",
    "#1a1026",
    "#22132c",
    "#2a1630",
  ];
  const bh = Math.ceil((H * 0.66) / bands.length);
  bands.forEach((c, i) => {
    rect(0, i * bh, W, bh, c);
    if (i < bands.length - 1)
      for (let yy = 0; yy < 2; yy++)
        for (let xx = 0; xx < W; xx++)
          if ((xx + yy) % 2 === 0) px(xx, (i + 1) * bh - 2 + yy, bands[i + 1]);
  });
  rect(0, bands.length * bh, W, H, bands[bands.length - 1]);
  for (let i = 0; i < 110; i++) {
    const X = rnd() * W,
      Y = rnd() * H * 0.55,
      v = rnd();
    px(X, Y, v > 0.85 ? "#e9dfc6" : v > 0.5 ? "#6f6584" : "#3d3152");
    if (v > 0.97) {
      px(X - 1, Y, "#6f6584");
      px(X + 1, Y, "#6f6584");
      px(X, Y - 1, "#6f6584");
      px(X, Y + 1, "#6f6584");
    }
  }
  const mx = 262,
    my = 34,
    mr = 19;
  for (let yy = -mr - 10; yy <= mr + 10; yy++)
    for (let xx = -mr - 10; xx <= mr + 10; xx++) {
      const d = xx * xx + yy * yy;
      if (d <= mr * mr)
        px(mx + xx, my + yy, xx + yy > mr * 0.9 ? "#cdbf9d" : "#ece2c8");
      else if (d <= (mr + 4) * (mr + 4)) {
        if ((xx + yy) % 2 === 0) px(mx + xx, my + yy, "#3a2a48");
      } else if (d <= (mr + 10) * (mr + 10)) {
        if ((xx + yy) % 4 === 0 && yy % 2 === 0)
          px(mx + xx, my + yy, "#2a1d38");
      }
    }
  [
    [-6, -5, 3],
    [5, 3, 4],
    [-2, 9, 2],
    [8, -9, 2],
  ].forEach(([a, b, r]) => {
    for (let yy = -r; yy <= r; yy++)
      for (let xx = -r; xx <= r; xx++)
        if (xx * xx + yy * yy <= r * r) px(mx + a + xx, my + b + yy, "#d6caa8");
  });
  [
    [214, 38, 72, 3],
    [236, 45, 50, 2],
    [196, 26, 40, 2],
  ].forEach(([X, Y, w, h]) => {
    rect(X, Y, w, h, "#120b1c");
    rect(X + 4, Y + h, w - 8, 1, "#120b1c");
  });
  let y0 = H * 0.56;
  for (let X = 0; X < W; X++) {
    y0 += (rnd() - 0.5) * 2.4;
    y0 = Math.max(H * 0.48, Math.min(H * 0.62, y0));
    rect(X, y0, 1, H - y0, "#150e21");
  }
  const ox = 128;
  for (let X = ox - 20; X < W; X++) {
    const top = H * 0.62 + Math.pow((X - (ox + 88)) / 90, 2) * 40;
    rect(X, top, 1, H - top, "#100a18");
  }
  const C = "#09060f",
    base = Math.round(H * 0.625);
  rect(ox + 48, base - 14, 82, 14, C);
  for (let k = 48; k < 130; k += 3) rect(ox + k, base - 16, 2, 2, C);
  const tower = (X, w, h, roof) => {
    X += ox;
    rect(X, base - h, w, h, C);
    if (roof) {
      for (let i = 0; i < roof; i++) {
        const ww = Math.max(1, Math.round((w + 2) * (1 - i / roof)));
        rect(X - 1 + Math.floor((w + 2 - ww) / 2), base - h - i - 1, ww, 1, C);
      }
    } else for (let k = 0; k < w; k += 2) rect(X + k, base - h - 2, 1, 2, C);
  };
  tower(40, 10, 42, 11);
  tower(62, 8, 54, 13);
  tower(82, 14, 68, 18);
  tower(106, 8, 48, 10);
  tower(124, 10, 38, 0);
  [
    [44, base - 30],
    [65, base - 40],
    [88, base - 50],
    [92, base - 50],
    [89, base - 34],
    [109, base - 30],
    [127, base - 26],
    [56, base - 9],
    [100, base - 8],
  ].forEach(([X, Y], i) =>
    rect(
      ox + X,
      Y,
      i % 3 === 0 ? 2 : 1,
      2,
      i % 4 === 1 ? "#E96A40" : "#ffb347",
    ),
  );
  px(ox + 88, base - 87, "#ff5a4a");
  let y1 = H * 0.76;
  for (let X = 0; X < W; X++) {
    y1 += (rnd() - 0.5) * 1.6;
    y1 = Math.max(H * 0.72, Math.min(H * 0.8, y1));
    rect(X, y1, 1, H - y1, "#0b0712");
  }
  const tree = (X, Y, len, ang, d, c, t) => {
    const X2 = X + Math.cos(ang) * len,
      Y2 = Y - Math.sin(ang) * len;
    line(X, Y, X2, Y2, c);
    if (t > 1) line(X + 1, Y, X2 + 1, Y2, c);
    if (t > 2) line(X - 1, Y, X2 - 1, Y2, c);
    if (d > 0) {
      tree(X2, Y2, len * 0.72, ang + 0.3 + rnd() * 0.4, d - 1, c, t - 1);
      tree(X2, Y2, len * 0.66, ang - 0.35 - rnd() * 0.4, d - 1, c, t - 1);
      if (rnd() > 0.6)
        tree(X2, Y2, len * 0.5, ang + (rnd() - 0.5) * 0.4, d - 2, c, 1);
    }
  };
  tree(110, H * 0.76, 12, 1.5, 4, "#07040b", 2);
  tree(150, H * 0.75, 9, 1.62, 3, "#07040b", 1);
  tree(80, H * 0.77, 8, 1.45, 3, "#07040b", 1);
  for (let yy = Math.round(H * 0.74); yy < H * 0.84; yy++)
    for (let xx = 0; xx < W; xx++)
      if ((xx + yy) % 2 === 0 && Math.sin(xx * 0.05 + yy * 0.4) > 0.2) {
        x.fillStyle = "rgba(110,92,150,0.16)";
        x.fillRect(xx, yy, 1, 1);
      }
  rect(0, H * 0.86, W, H, "#050308");
  for (let X = 0; X < W; X += 2) {
    const h = Math.floor(rnd() * 3);
    rect(X, H * 0.86 - h, 1, h, "#050308");
  }
  const G = "#1a1424",
    GH = "#2b2338";
  [
    [150, 8, 10],
    [176, 6, 8],
    [206, 7, 11],
    [226, 6, 8],
  ].forEach(([X, w, h]) => {
    const Y = Math.round(H * 0.86) - h;
    rect(X, Y + 1, w, h, G);
    rect(X + 1, Y, w - 2, 1, G);
    rect(X, Y + 1, 1, h, GH);
    rect(X + 2, Y + 3, w - 4, 1, "#0e0a14");
  });
  [
    [194, 10],
    [60, 9],
  ].forEach(([X, h]) => {
    const Y = Math.round(H * 0.86) - h;
    rect(X, Y, 2, h, G);
    rect(X - 2, Y + 2, 6, 2, G);
  });
  tree(8, H * 0.88, 20, 1.42, 5, "#030205", 3);
  tree(300, H * 0.88, 16, 1.72, 4, "#030205", 3);
  [
    [226, 60],
    [234, 56],
    [244, 64],
    [206, 70],
  ].forEach(([X, Y]) => {
    ["#030205"].forEach((c) => {
      px(X, Y, c);
      px(X - 1, Y - 1, c);
      px(X + 1, Y - 1, c);
      px(X - 2, Y - 1, c);
      px(X + 2, Y - 1, c);
    });
  });
  for (let i = 0; i < 5; i++) {
    const X = ox + 50 + rnd() * 80,
      Y = H * 0.83 + rnd() * 4;
    px(X, Y, "#E4EB91");
  }
}

function svg(width, height, paths) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" shape-rendering="crispEdges">${paths}</svg>\n`;
}

function sprite(rows, palette) {
  const paths = Object.entries(palette)
    .map(([key, fill]) => {
      const d = rows
        .flatMap((row, y) =>
          [...row].flatMap((pixel, x) =>
            pixel === key ? [`M${x} ${y}h1v1h-1z`] : [],
          ),
        )
        .join("");
      return `<path fill="${fill}" d="${d}"/>`;
    })
    .join("");
  return svg(rows[0].length, rows.length, paths);
}

// Record the supplied canvas drawing as SVG, then rasterize at its native size.
const fills = [];
const context = {
  fillStyle: "#000000",
  fillRect(x, y, width, height) {
    if (width <= 0 || height <= 0) return;
    let group = fills.at(-1);
    if (!group || group.fill !== this.fillStyle) {
      group = { fill: this.fillStyle, paths: [] };
      fills.push(group);
    }
    group.paths.push(`M${x} ${y}h${width}v${height}h${-width}z`);
  },
};
const canvas = { getContext: () => context };
drawScene(canvas);
const landscape = svg(
  canvas.width,
  canvas.height,
  fills
    .map(({ fill, paths }) => `<path fill="${fill}" d="${paths.join("")}"/>`)
    .join(""),
);
execFileSync("rsvg-convert", ["-o", `${assets}castle.png`], {
  input: landscape,
});
writeFileSync(
  `${assets}rookie.svg`,
  sprite(ROOKIE, {
    o: "#140f18",
    f: "#eee6d2",
    s: "#b5a98e",
    h: "#ffffff",
    e: "#140f18",
    m: "#3a1a14",
    g: "#E96A40",
  }),
);
writeFileSync(
  `${assets}pawn.svg`,
  sprite(PAWN, { o: "#050307", f: "#6e4c94", s: "#41295e", h: "#a487c8" }),
);
console.log("Exported Rookrift castle, Rookie, and pawn artwork.");
