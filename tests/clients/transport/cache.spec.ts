import { PokenodeError } from "@config/errors";
import { HttpResponse, http } from "msw/http";
import { server } from "../../helpers/setup";
import { BERRY_URL, countingHandler, RecordingStore, TestClient } from "../../helpers/transport";

describe("BaseClient cache", () => {
  it("should serve a repeated request from the cache", async () => {
    const calls = countingHandler(BERRY_URL);
    const client = new TestClient();

    await client.get("/berry", 1);
    await client.get("/berry", 1);

    expect(calls.count).toBe(1);
  });

  it("should hit the network every time when the cache is disabled", async () => {
    const calls = countingHandler(BERRY_URL);
    const client = new TestClient({ cache: false });

    await client.get("/berry", 1);
    await client.get("/berry", 1);

    expect(calls.count).toBe(2);
  });

  it("should read and write through a custom store", async () => {
    const calls = countingHandler(BERRY_URL);
    const store = new RecordingStore();
    const client = new TestClient({ cache: store });

    await client.get("/berry", 1);
    await client.get("/berry", 1);

    expect(calls.count).toBe(1);
    expect(store.reads).toEqual([BERRY_URL, BERRY_URL]);
    expect(store.writes).toEqual([[BERRY_URL, { id: 1 }]]);
  });

  it("should await an asynchronous store", async () => {
    const calls = countingHandler(BERRY_URL);
    const store = new RecordingStore({ async: true });
    const client = new TestClient({ cache: store });

    await client.get("/berry", 1);

    await expect(client.get("/berry", 1)).resolves.toEqual({ id: 1 });
    expect(calls.count).toBe(1);
  });

  it("should not share a cache between clients", async () => {
    const calls = countingHandler(BERRY_URL);

    await new TestClient().get("/berry", 1);
    await new TestClient().get("/berry", 1);

    expect(calls.count).toBe(2);
  });

  it("should expose the store it built for itself", async () => {
    countingHandler(BERRY_URL);
    const client = new TestClient();

    await client.get("/berry", 1);

    expect(client.cache?.get(BERRY_URL)).toEqual({ id: 1 });
  });

  it("should expose no store when caching is disabled", () => {
    expect(new TestClient({ cache: false }).cache).toBeUndefined();
  });

  it("should refetch after the cache is cleared", async () => {
    const calls = countingHandler(BERRY_URL);
    const client = new TestClient();

    await client.get("/berry", 1);
    await client.clearCache();
    await client.get("/berry", 1);

    expect(calls.count).toBe(2);
  });

  it("should leave a store that cannot clear alone", async () => {
    const client = new TestClient({ cache: new RecordingStore() });

    await expect(client.clearCache()).resolves.toBeUndefined();
  });

  it("should not cache a failed response", async () => {
    let calls = 0;

    server.use(
      http.get(BERRY_URL, () => {
        calls += 1;
        return HttpResponse.json({ detail: "Not found." }, { status: 404 });
      }),
    );

    const client = new TestClient();

    await expect(client.get("/berry", 1)).rejects.toThrow(PokenodeError);
    await expect(client.get("/berry", 1)).rejects.toThrow(PokenodeError);

    expect(calls).toBe(2);
  });
});
