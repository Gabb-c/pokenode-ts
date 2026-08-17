import type { DefaultTheme } from "vitepress";

type Route = { text: string; link: string };

const guides: Route[] = [
  { text: "Getting started", link: "/guides/getting-started" },
  { text: "Errors", link: "/guides/errors" },
  { text: "Cache", link: "/guides/cache" },
  { text: "Logging", link: "/guides/logging" },
  { text: "Custom Fetch", link: "/guides/fetch" },
  { text: "Cancellation", link: "/guides/cancellation" },
  { text: "Pagination", link: "/guides/pagination" },
  { text: "Sprites", link: "/guides/sprites" },
  { text: "Migrating to 2.0", link: "/guides/migration" },
  { text: "Contributing", link: "/guides/contributing" },
];

const clients: Route[] = [
  { text: "Main Client", link: "/clients/main-client" },
  { text: "Berry Client", link: "/clients/berry-client" },
  { text: "Contest Client", link: "/clients/contest-client" },
  { text: "Currency Client", link: "/clients/currency-client" },
  { text: "Encounter Client", link: "/clients/encounter-client" },
  { text: "Evolution Client", link: "/clients/evolution-client" },
  { text: "Game Client", link: "/clients/game-client" },
  { text: "Item Client", link: "/clients/item-client" },
  { text: "Location Client", link: "/clients/location-client" },
  { text: "Machine Client", link: "/clients/machine-client" },
  { text: "Move Client", link: "/clients/move-client" },
  { text: "Pokemon Client", link: "/clients/pokemon-client" },
  { text: "Utility Client", link: "/clients/utility-client" },
];

export const sidebarRoutes: DefaultTheme.SidebarItem[] = [
  { text: "Guides", collapsed: false, items: guides },
  { text: "Clients", collapsed: false, items: clients },
];

export const navbarItems: DefaultTheme.NavItem[] = [
  { text: "Guides", items: guides },
  { text: "Clients", items: clients },
];
