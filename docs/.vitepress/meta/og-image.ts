import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

export const OG_IMAGE = { width: 1200, height: 630 } as const;

export interface OgCard {
  title: string;
  description: string;
  /** Shown top right, in place of a URL bar. */
  label: string;
  /** Endpoint paths of the PokéAPI section the page covers. */
  paths: readonly string[];
}

// mirrors dex-card.vue and the light-mode brand ramp in custom.css
const COLOR = {
  shell: "#FF3962",
  screen: "#E6EFEC",
  ink: "#151820",
  rule: "#5A6275",
  chip: "#D50B3A",
  chipBackground: "rgba(255, 57, 98, 0.14)",
} as const;

const INSTALL = "$ npm install pokenode-ts";

/** More rows of chips would push the description off the card. */
const MAX_CHIPS = 6;

const require = createRequire(import.meta.url);
const readFont = (file: string): Buffer => readFileSync(require.resolve(file));

const FONTS = [
  {
    name: "Chakra Petch",
    data: readFont("@fontsource/chakra-petch/files/chakra-petch-latin-700-normal.woff"),
    weight: 700,
  },
  {
    name: "Martian Mono",
    data: readFont("@fontsource/martian-mono/files/martian-mono-latin-400-normal.woff"),
    weight: 400,
  },
  {
    name: "Martian Mono",
    data: readFont("@fontsource/martian-mono/files/martian-mono-latin-600-normal.woff"),
    weight: 600,
  },
] as const;

type Style = Record<string, string | number>;
interface Node {
  type: "div";
  props: { style: Style; children: string | Node[] };
}

const div = (style: Style, children: string | Node[]): Node => ({
  type: "div",
  props: { style: { display: "flex", ...style }, children },
});

const chip = (text: string): Node =>
  div(
    {
      padding: "6px 14px",
      borderRadius: 6,
      background: COLOR.chipBackground,
      color: COLOR.chip,
      fontFamily: "Martian Mono",
      fontWeight: 600,
      fontSize: 20,
    },
    text,
  );

const chips = (paths: readonly string[]): Node[] => {
  const shown = paths.slice(0, MAX_CHIPS).map(chip);
  const hidden = paths.length - MAX_CHIPS;
  return hidden > 0 ? [...shown, chip(`+${hidden} more`)] : shown;
};

const header = (label: string): Node =>
  div({ alignItems: "center", justifyContent: "space-between", color: "#FFFFFF" }, [
    div(
      { fontFamily: "Chakra Petch", fontWeight: 700, fontSize: 34, letterSpacing: 3 },
      "POKENODE-TS",
    ),
    div({ fontFamily: "Martian Mono", fontSize: 20, opacity: 0.85 }, label),
  ]);

const screen = ({ title, description, paths }: OgCard): Node =>
  div(
    {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
      marginTop: 28,
      padding: "52px 60px",
      borderRadius: "12px 12px 12px 72px",
      background: COLOR.screen,
    },
    [
      div({ flexDirection: "column" }, [
        div(
          {
            fontFamily: "Chakra Petch",
            fontWeight: 700,
            fontSize: 68,
            lineHeight: 1.05,
            color: COLOR.ink,
          },
          title,
        ),
        div(
          {
            display: "block",
            marginTop: 24,
            fontFamily: "Martian Mono",
            fontSize: 24,
            lineHeight: 1.55,
            color: COLOR.rule,
            lineClamp: 3,
          },
          description,
        ),
      ]),
      paths.length > 0
        ? div({ flexWrap: "wrap", gap: 10 }, chips(paths))
        : div({ fontFamily: "Martian Mono", fontSize: 22, color: COLOR.rule }, INSTALL),
    ],
  );

const card = (page: OgCard): Node =>
  div(
    {
      width: "100%",
      height: "100%",
      flexDirection: "column",
      padding: "36px 40px 40px",
      background: COLOR.shell,
    },
    [header(page.label), screen(page)],
  );

export const renderOgImage = async (page: OgCard): Promise<Buffer> => {
  const svg = await satori(card(page), { ...OG_IMAGE, fonts: [...FONTS] });
  return new Resvg(svg).render().asPng();
};

/** `guides/cache.md` → `/og/guides/cache.png`. */
export const ogImagePath = (relativePath: string): string =>
  `/og/${relativePath.replace(/\.md$/, "")}.png`;
