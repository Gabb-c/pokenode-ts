import { Resvg } from "@resvg/resvg-js";
import { SITE_TITLE, THEME_COLOR } from "./site";

/** Raster copies of the SVG logo, for consumers that ignore SVG icons (Google Search, iOS). */
export const RASTER_ICONS = {
  "apple-touch-icon.png": 180,
  "icon-192.png": 192,
  "icon-512.png": 512,
} as const;

const FAVICON_SIZES = [16, 32, 48] as const;

const renderPng = (svg: string, size: number): Buffer =>
  new Resvg(svg, { fitTo: { mode: "width", value: size } }).render().asPng();

/** PNG-compressed ICO entries, which every current browser and Google Search read. */
const toIco = (images: readonly { size: number; png: Buffer }[]): Buffer => {
  const HEADER = 6;
  const ENTRY = 16;
  const header = Buffer.alloc(HEADER + ENTRY * images.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = header.length;
  images.forEach(({ size, png }, index) => {
    const entry = HEADER + ENTRY * index;
    // 0 stands for 256 in the one-byte dimension fields
    header.writeUInt8(size % 256, entry);
    header.writeUInt8(size % 256, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(png.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += png.length;
  });

  return Buffer.concat([header, ...images.map(({ png }) => png)]);
};

/** Every generated icon, keyed by its path under the site root. */
export const renderIcons = (svg: string): Map<string, Buffer> => {
  const icons = new Map<string, Buffer>();
  for (const [file, size] of Object.entries(RASTER_ICONS)) icons.set(file, renderPng(svg, size));
  icons.set(
    "favicon.ico",
    toIco(FAVICON_SIZES.map((size) => ({ size, png: renderPng(svg, size) }))),
  );
  return icons;
};

export const webManifest = (description: string): string =>
  JSON.stringify({
    name: SITE_TITLE,
    short_name: SITE_TITLE,
    description,
    start_url: "/",
    display: "standalone",
    theme_color: THEME_COLOR,
    background_color: "#FFFFFF",
    icons: [192, 512].map((size) => ({
      src: `/icon-${size}.png`,
      sizes: `${size}x${size}`,
      type: "image/png",
    })),
  });
