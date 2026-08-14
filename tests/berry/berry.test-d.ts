import { BerryClient } from "@clients";
import { MemoryCache } from "@config/cache";

import type { ClientArgs } from "../../src/clients/base";

describe("Berry", () => {
  let client: BerryClient;

  beforeAll(() => {
    client = new BerryClient();
  });

  it("should be instantiated correctly", () => {
    expectTypeOf(client).toEqualTypeOf<BerryClient>();
    expectTypeOf(BerryClient).toBeConstructibleWith({});
    expectTypeOf(BerryClient).toBeConstructibleWith({ logs: true });
    expectTypeOf(BerryClient).toBeConstructibleWith({
      baseURL: "https://example.test/api/v2",
      cache: new MemoryCache({ ttl: 1000, maxEntries: 10 }),
    });
    expectTypeOf(BerryClient).toBeConstructibleWith({ cache: false });
    // A plain wrapper must be assignable: `typeof globalThis.fetch` would reject it.
    expectTypeOf<(url: string, init?: RequestInit) => Promise<Response>>().toExtend<
      NonNullable<ClientArgs["fetch"]>
    >();
    expectTypeOf(globalThis.fetch).toExtend<NonNullable<ClientArgs["fetch"]>>();
  });
});
