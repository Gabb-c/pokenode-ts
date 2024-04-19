import { BerryClient } from "@clients";

describe("Berry", () => {
  let client: BerryClient;

  beforeAll(() => {
    client = new BerryClient();
  });

  it("should be instantiated correctly", () => {
    expectTypeOf(client).toEqualTypeOf<BerryClient>();
    expectTypeOf(BerryClient).toBeConstructibleWith({});
    expectTypeOf(BerryClient).toBeConstructibleWith({ logs: true });
  });
});
