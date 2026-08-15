/** `icon` is a filename under `.vitepress/assets/`; omit it to use one of VitePress' built-in icons. */
type SocialLink = { link: string; icon?: string };

export const SOCIAL_LINKS = {
  GITHUB: { link: "https://github.com/Gabb-c/pokenode-ts" },
  NPM: { link: "https://www.npmjs.com/package/pokenode-ts", icon: "npm-icon.svg" },
  JSDELIVR: {
    link: "https://www.jsdelivr.com/package/npm/pokenode-ts",
    icon: "jsdelivr-icon.svg",
  },
  BUNDLEPHOBIA: {
    link: "https://bundlephobia.com/package/pokenode-ts",
    icon: "bundlephobia-icon.svg",
  },
  PACKAGEPHOBIA: {
    link: "https://packagephobia.com/result?p=pokenode-ts",
    icon: "packagephobia-icon.svg",
  },
} as const satisfies Record<string, SocialLink>;
