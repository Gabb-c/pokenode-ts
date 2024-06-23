import { setupServer } from "msw/node";

import { BERRY_HANDLERS } from "../berry/mocks/handlers";

const HANDLERS = [...BERRY_HANDLERS];

const server = setupServer(...HANDLERS);

// Events
server.events.on("unhandledException", ({ request: { method, url }, error }) => {
  console.log(`${method} ${url} errored! See details below.`);
  console.error(error);
});

// Vitest hooks
beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
