import { BASE_URL } from "@constants";

import { BERRY_URL, countingHandler, RecordingStore, TestClient } from "../../helpers/transport";

describe("BaseClient URLs", () => {
  it("should honour a custom baseURL", async () => {
    const calls = countingHandler("https://example.test/api/v2/berry/1");

    await new TestClient({ baseURL: "https://example.test/api/v2" }).get("/berry", 1);

    expect(calls.count).toBe(1);
  });

  it("should tolerate a trailing slash on the baseURL", async () => {
    const calls = countingHandler("https://example.test/api/v2/berry/1");

    await new TestClient({ baseURL: "https://example.test/api/v2/" }).get("/berry", 1);

    expect(calls.count).toBe(1);
  });

  it("should resolve a resource from its absolute URL", async () => {
    const calls = countingHandler(BERRY_URL);

    await new TestClient().getByURL(BERRY_URL);

    expect(calls.count).toBe(1);
  });

  it("should resolve an absolute URL against the client baseURL", async () => {
    const calls = countingHandler("https://example.test/api/v2/berry/1");

    await new TestClient({ baseURL: "https://example.test/api/v2" }).getByURL(BERRY_URL);

    expect(calls.count).toBe(1);
  });

  it("should drop the trailing slash the PokéAPI puts on its own URLs", async () => {
    const calls = countingHandler(BERRY_URL);

    await new TestClient().getByURL(`${BERRY_URL}/`);

    expect(calls.urls[0]).toBe(BERRY_URL);
  });

  it("should normalize a long run of slashes without backtracking", async () => {
    const requested: string[] = [];
    // A run of slashes that does not end the string is what a backtracking
    // pattern walks quadratically. This resolves in milliseconds, or the test
    // times out.
    const baseURL = `https://example.test/${"/".repeat(200_000)}api/v2`;
    const client = new TestClient({
      baseURL,
      cache: false,
      fetch: (url) => {
        requested.push(url);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    await client.get("/berry", 1);

    expect(requested).toEqual([`${baseURL}/berry/1`]);
  });

  it("should leave a trailing slash inside the query string alone", async () => {
    const requested: string[] = [];
    const client = new TestClient({
      baseURL: "https://example.test/api/v2",
      cache: false,
      fetch: (url) => {
        requested.push(url);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    await client.getByURL("https://example.test/api/v2/berry?q=a/");

    expect(requested).toEqual(["https://example.test/api/v2/berry?q=a/"]);
  });

  it("should encode an identifier instead of letting it reach past the endpoint", async () => {
    const requested: string[] = [];
    const client = new TestClient({
      cache: false,
      fetch: (url) => {
        requested.push(url);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    // A name is whatever the caller passed, and `getBerryByName(req.query.name)`
    // is the shape that call takes. Unencoded, a `?` addresses another query and
    // a `/` another endpoint.
    await client.get("/berry", "cheri?limit=99999");
    await client.get("/berry", "../pokemon/1");
    await client.get("/berry", "cheri#frag");

    expect(requested).toEqual([
      `${BASE_URL.REST}/berry/cheri%3Flimit%3D99999`,
      `${BASE_URL.REST}/berry/..%2Fpokemon%2F1`,
      `${BASE_URL.REST}/berry/cheri%23frag`,
    ]);
  });

  it("should leave a valid resource name untouched", async () => {
    const requested: string[] = [];
    const client = new TestClient({
      cache: false,
      fetch: (url) => {
        requested.push(url);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    await client.get("/berry", "chesto");
    await client.get("/pokemon", "mr-mime");

    expect(requested).toEqual([
      `${BASE_URL.REST}/berry/chesto`,
      `${BASE_URL.REST}/pokemon/mr-mime`,
    ]);
  });

  it("should join a path below the endpoint without encoding the separator", async () => {
    const requested: string[] = [];
    const client = new TestClient({
      cache: false,
      fetch: (url) => {
        requested.push(url);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    await client.get("/pokemon", 25, "encounters");

    expect(requested).toEqual([`${BASE_URL.REST}/pokemon/25/encounters`]);
  });

  it("should give a resource one cache key however it is reached", async () => {
    const calls = countingHandler(BERRY_URL);
    const client = new TestClient();

    await client.get("/berry", 1);
    await client.getByURL(`${BERRY_URL}/`);

    expect(calls.count).toBe(1);
  });

  it("should not mistake a version marker in the host for one in the path", async () => {
    const calls = countingHandler("https://api.v2.example.test/api/v2/berry/1");
    const baseURL = "https://api.v2.example.test/api/v2";

    await new TestClient({ baseURL }).getByURL(`${baseURL}/berry/1/`);

    expect(calls.urls[0]).toBe("https://api.v2.example.test/api/v2/berry/1");
  });

  it("should keep the query string of a resource URL", async () => {
    const calls = countingHandler(`${BASE_URL.REST}/berry`, { count: 0, results: [] });

    await new TestClient().getByURL(`${BASE_URL.REST}/berry?offset=20&limit=50`);

    expect(calls.urls[0]).toBe(`${BASE_URL.REST}/berry?offset=20&limit=50`);
  });

  it("should reject a URL that names no endpoint", async () => {
    await expect(new TestClient().getByURL("https://example.test/berry/1")).rejects.toThrow(
      TypeError,
    );
  });

  it("should reject a URL that is not absolute", async () => {
    await expect(new TestClient().getByURL("/berry/1")).rejects.toThrow(TypeError);
  });

  it("should send a credentialed baseURL as an Authorization header", async () => {
    const requested: string[] = [];
    const sent: RequestInit["headers"][] = [];
    const logged: string[] = [];
    const store = new RecordingStore();
    const client = new TestClient({
      baseURL: "https://someone:hunter2@poke.example/api/v2",
      cache: store,
      fetch: (url, init) => {
        requested.push(url);
        sent.push(init?.headers);
        return Promise.resolve(Response.json({ id: 1 }));
      },
      logger: {
        debug: ({ url }) => logged.push(url),
        error: ({ url }) => logged.push(url),
      },
    });

    await client.get("/berry", 1);

    // Native `fetch` rejects a URL carrying userinfo, so the credentials travel
    // as a header and nothing downstream of the URL ever sees them.
    expect(requested).toEqual(["https://poke.example/api/v2/berry/1"]);
    expect(sent).toEqual([
      { Accept: "application/json", Authorization: `Basic ${btoa("someone:hunter2")}` },
    ]);
    expect(logged).toEqual([
      "https://poke.example/api/v2/berry/1",
      "https://poke.example/api/v2/berry/1",
    ]);
    expect(store.writes).toEqual([["https://poke.example/api/v2/berry/1", { id: 1 }]]);
  });

  it("should percent-decode credentials before encoding them", async () => {
    const sent: RequestInit["headers"][] = [];
    const client = new TestClient({
      baseURL: "https://someone:hunter%402@poke.example/api/v2",
      cache: false,
      fetch: (_url, init) => {
        sent.push(init?.headers);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    await client.get("/berry", 1);

    expect(sent).toEqual([
      { Accept: "application/json", Authorization: `Basic ${btoa("someone:hunter@2")}` },
    ]);
  });

  it("should send credentials it cannot percent-decode as they stand", async () => {
    const sent: RequestInit["headers"][] = [];
    // `URL` parses `%zz` happily; `decodeURIComponent` rejects it.
    const client = new TestClient({
      baseURL: "https://some%zzone:hunter2@poke.example/api/v2",
      cache: false,
      fetch: (_url, init) => {
        sent.push(init?.headers);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    await expect(client.get("/berry", 1)).resolves.toEqual({ id: 1 });
    expect(sent).toEqual([
      { Accept: "application/json", Authorization: `Basic ${btoa("some%zzone:hunter2")}` },
    ]);
  });

  it("should leave a url it cannot parse exactly as it stands", async () => {
    const requested: string[] = [];
    const sent: RequestInit["headers"][] = [];
    // Looks credentialed but has no scheme, so `URL` refuses it. Nothing can be
    // stripped from a string nobody can parse, and `fetch` is the one to complain.
    const client = new TestClient({
      baseURL: "://someone:hunter2@poke.example/api/v2",
      cache: false,
      fetch: (url, init) => {
        requested.push(url);
        sent.push(init?.headers);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    await client.get("/berry", 1);

    expect(requested).toEqual(["://someone:hunter2@poke.example/api/v2/berry/1"]);
    expect(sent).toEqual([{ Accept: "application/json" }]);
  });

  it("should not read an at sign in a path as credentials", async () => {
    const requested: string[] = [];
    const sent: RequestInit["headers"][] = [];
    const client = new TestClient({
      cache: false,
      fetch: (url, init) => {
        requested.push(url);
        sent.push(init?.headers);
        return Promise.resolve(Response.json({ id: 1 }));
      },
    });

    // `@` is a legal path character, so a link can carry one with no userinfo
    // in front of it. Only a parsed username or password is a credential.
    await client.getByURL(`${BASE_URL.REST}/berry/a@b`);

    expect(requested).toEqual([`${BASE_URL.REST}/berry/a@b`]);
    expect(sent).toEqual([{ Accept: "application/json" }]);
  });
});
