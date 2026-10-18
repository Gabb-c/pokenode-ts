import { PokenodeError } from "@config/errors";
import { BASE_URL } from "@constants";
import { HttpResponse, http } from "msw/http";
import { delay } from "msw/utils/delay";
import { server } from "../../helpers/setup";
import { BERRY_URL, countingHandler, TestClient } from "../../helpers/transport";

describe("BaseClient requests", () => {
  it("should fetch a resource by identifier", async () => {
    const calls = countingHandler(BERRY_URL);

    await expect(new TestClient().get("/berry", 1)).resolves.toEqual({ id: 1 });
    expect(calls.urls[0]).toBe(BERRY_URL);
  });

  it("should treat the id 0 as a real identifier", async () => {
    const calls = countingHandler(`${BASE_URL.REST}/berry/0`);

    await new TestClient().get("/berry", 0);

    expect(calls.count).toBe(1);
  });

  it("should send pagination as query parameters", async () => {
    const calls = countingHandler(`${BASE_URL.REST}/berry`, { count: 0, results: [] });

    await new TestClient().list("/berry", 20, 50);

    expect(calls.urls[0]).toBe(`${BASE_URL.REST}/berry?offset=20&limit=50`);
  });

  it("should pass the url and our init to a custom fetch", async () => {
    const calls: [string, RequestInit | undefined][] = [];
    const client = new TestClient({
      fetch: (url, init) => {
        calls.push([url, init]);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    await expect(client.get("/berry", 1)).resolves.toEqual({ id: 1 });

    const [url, init] = calls[0] as [string, RequestInit];
    expect(url).toBe(BERRY_URL);
    expect(init.headers).toEqual({ Accept: "application/json" });
  });

  // `FetchLike` is deliberately narrower than `typeof globalThis.fetch`: the
  // wider type rejects an ordinary wrapper. Both of these have to keep
  // compiling, so widening or tightening the option breaks the build here.
  it("should accept the global fetch as its transport", async () => {
    const calls = countingHandler(BERRY_URL);

    await new TestClient({ fetch: globalThis.fetch }).get("/berry", 1);

    expect(calls.count).toBe(1);
  });

  it("should accept a plain fetch wrapper as its transport", async () => {
    const calls = countingHandler(BERRY_URL);
    const wrapper = (url: string, init?: RequestInit) => fetch(url, init);

    await new TestClient({ fetch: wrapper }).get("/berry", 1);

    expect(calls.count).toBe(1);
  });

  it("should not impose an abort signal of its own", async () => {
    let received: RequestInit | undefined;
    const client = new TestClient({
      fetch: (_url, init) => {
        received = init;
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    await client.get("/berry", 1);

    expect(received?.signal).toBeUndefined();
  });

  it("should surface an abort from a caller-supplied signal untouched", async () => {
    server.use(
      http.get(BERRY_URL, async () => {
        await delay(200);
        return HttpResponse.json({ id: 1 });
      }),
    );

    const client = new TestClient({
      fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(10) }),
    });

    const error = await client.get("/berry", 1).catch((caught: unknown) => caught);

    expect(PokenodeError.isPokenodeError(error)).toBe(false);
    expect((error as Error).name).toBe("TimeoutError");
  });
});
