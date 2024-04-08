import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

import { berryHandlers } from "./berry/mocks";

const handlers = [...berryHandlers];

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
