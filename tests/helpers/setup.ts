import { setupServer } from "msw/node";

export const server = setupServer();

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
