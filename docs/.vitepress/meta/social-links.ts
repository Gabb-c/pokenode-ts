type SocialLink = { link: string; path: string };
type SocialLinksKeys = Record<string, SocialLink>;

export const SOCIAL_LINKS: SocialLinksKeys = {
  GITHUB: { link: "https://github.com/Gabb-c/pokenode-ts", path: "" },
  NPM: { link: "https://www.npmjs.com/package/pokenode-ts", path: "npm-icon.svg" },
  JSDELIVR: { link: "https://www.jsdelivr.com/package/npm/pokenode-ts", path: "jsdelivr-icon.svg" },
  BUNDLEPHOBIA: {
    link: "https://bundlephobia.com/package/pokenode-ts",
    path: "bundlephobia-icon.svg",
  },
  PACKAGEPHOBIA: {
    link: "https://packagephobia.com/result?p=pokenode-ts",
    path: "packagephobia-icon.svg",
  },
} as const;
