import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

import { BERRY_HANDLERS } from "../berry/mocks/handlers";

const HANDLERS = [...BERRY_HANDLERS];

const server = setupServer(...HANDLERS);

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
