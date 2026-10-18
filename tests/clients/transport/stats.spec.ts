import { PokenodeError } from "@config/errors";
import { BASE_URL } from "@constants";
import { HttpResponse, http } from "msw/http";
import { server } from "../../helpers/setup";
import {
  BERRY_URL,
  countingHandler,
  failingHandler,
  IMMEDIATE,
  revalidatingHandler,
  TestClient,
} from "../../helpers/transport";

describe("BaseClient.stats", () => {
  it("should start at zero", () => {
    expect(new TestClient().stats).toEqual({
      network: 0,
      cache: 0,
      inFlight: 0,
      revalidated: 0,
      roundTrips: 0,
    });
  });

  it("should count a cache hit apart from the round trip that filled it", async () => {
    const calls = countingHandler(BERRY_URL);
    const client = new TestClient();

    await client.get("/berry", 1);
    await client.get("/berry", 1);

    expect(calls.count).toBe(1);
    expect(client.stats).toMatchObject({ network: 1, cache: 1, roundTrips: 1 });
  });

  it("should count a caller that joined a request already on the wire", async () => {
    countingHandler(BERRY_URL);
    const client = new TestClient({ cache: false });

    await Promise.all([client.get("/berry", 1), client.get("/berry", 1)]);

    expect(client.stats).toMatchObject({ network: 1, inFlight: 1, roundTrips: 1 });
  });

  // A revalidation is a request the API answered, so it counts as a round trip —
  // what it saved is the body, not the trip.
  it("should count a revalidation as a round trip of its own", async () => {
    revalidatingHandler();
    const client = new TestClient({ cache: false, revalidate: true });

    await client.get("/berry", 1);
    await client.get("/berry", 1);

    expect(client.stats).toMatchObject({ network: 1, revalidated: 1, roundTrips: 2 });
  });

  it("should count nothing for a request that failed", async () => {
    server.use(http.get(BERRY_URL, () => HttpResponse.json({}, { status: 404 })));
    const client = new TestClient();

    await expect(client.get("/berry", 1)).rejects.toThrow(PokenodeError);

    expect(client.stats.network).toBe(0);
  });

  it("should share its counts with a scoped client", async () => {
    countingHandler(BERRY_URL);
    const client = new TestClient();
    const scoped = client.with({ timeout: 1_000 });

    await client.get("/berry", 1);
    await scoped.get("/berry", 1);

    expect(scoped.stats).toMatchObject({ network: 1, cache: 1 });
    expect(client.stats).toEqual(scoped.stats);
  });

  // The number the API saw, which is not the number of resolutions: a retried
  // request is one `network` and three requests, and the attempts are the half a
  // caller cannot otherwise see.
  it("should count every attempt a retried request made", async () => {
    const calls = failingHandler([503, 500]);
    const client = new TestClient({ retry: IMMEDIATE });

    await client.get("/berry", 1);

    expect(calls.count).toBe(3);
    expect(client.stats).toMatchObject({ network: 1, roundTrips: 3 });
  });

  it("should count the round trip a revalidation made", async () => {
    revalidatingHandler();
    const client = new TestClient({ cache: false, revalidate: true });

    await client.get("/berry", 1);
    await client.get("/berry", 1);

    expect(client.stats).toMatchObject({ revalidated: 1, roundTrips: 2 });
  });

  it("should count no round trip for a cache hit", async () => {
    countingHandler(BERRY_URL);
    const client = new TestClient();

    await client.get("/berry", 1);
    await client.get("/berry", 1);

    expect(client.stats).toMatchObject({ cache: 1, roundTrips: 1 });
  });

  it("should subtract a snapshot from the counts since", async () => {
    countingHandler(`${BASE_URL.REST}/berry/:id`);
    const client = new TestClient();

    await client.get("/berry", 1);
    const before = client.stats;

    await client.get("/berry", 2);
    await client.get("/berry", 2);

    expect(client.statsSince(before)).toEqual({
      network: 1,
      cache: 1,
      inFlight: 0,
      revalidated: 0,
      roundTrips: 1,
    });
  });

  it("should return a snapshot rather than a live view", async () => {
    countingHandler(BERRY_URL);
    const client = new TestClient();

    const before = client.stats;
    await client.get("/berry", 1);

    expect(before.network).toBe(0);
    expect(client.stats.network).toBe(1);
  });
});
