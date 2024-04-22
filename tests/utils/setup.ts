import { setupServer } from "msw/node";

import { BERRY_HANDLERS } from "../berry/mocks/handlers";

const HANDLERS = [...BERRY_HANDLERS];

const server = setupServer(...HANDLERS);

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
