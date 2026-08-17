import { BerryClient, MachineClient } from "@clients";
import { BASE_URL } from "@constants";
import type { APIResourceList, Berry, NamedAPIResource, NamedAPIResourceList } from "@models";
import { delay, HttpResponse, http } from "msw";

import { server } from "../helpers/setup";

/** A page of named links, as the PokéAPI would list them. */
const namedPage = (offset: number, limit: number, count: number): NamedAPIResourceList<Berry> => {
  const size = Math.max(Math.min(limit, count - offset), 0);

  return {
    count,
    next: offset + size < count ? `${BASE_URL.REST}/berry?offset=${offset + size}` : null,
    previous: null,
    results: Array.from({ length: size }, (_entry, index) => ({
      name: `berry-${offset + index}`,
      url: `${BASE_URL.REST}/berry/${offset + index + 1}/`,
    })),
  };
};

/** Records every page a walk asked for. */
const recordingList = (count: number) => {
  const pages: [offset: number, limit: number][] = [];

  return {
    pages,
    list: (offset: number, limit: number) => {
      pages.push([offset, limit]);
      return Promise.resolve(namedPage(offset, limit, count));
    },
  };
};

describe("BaseClient.paginate", () => {
  it("should walk every page of a list", async () => {
    const { pages, list } = recordingList(5);
    const names: string[] = [];

    for await (const berry of new BerryClient().paginate(list, { pageSize: 2 })) {
      names.push(berry.name);
    }

    expect(names).toEqual(["berry-0", "berry-1", "berry-2", "berry-3", "berry-4"]);
    expect(pages).toEqual([
      [0, 2],
      [2, 2],
      [4, 2],
    ]);
  });

  it("should stop on a page shorter than the one it asked for", async () => {
    const { pages, list } = recordingList(3);

    for await (const _berry of new BerryClient().paginate(list, { pageSize: 10 })) {
      // Drained for its requests, not its entries.
    }

    expect(pages).toEqual([[0, 10]]);
  });

  it("should page by twenty by default", async () => {
    const { pages, list } = recordingList(0);

    for await (const _berry of new BerryClient().paginate(list)) {
      // No entries to take.
    }

    expect(pages).toEqual([[0, 20]]);
  });

  it("should stop on an empty first page", async () => {
    const { list } = recordingList(0);
    const entries: NamedAPIResource<Berry>[] = [];

    for await (const berry of new BerryClient().paginate(list)) {
      entries.push(berry);
    }

    expect(entries).toEqual([]);
  });

  it("should walk a list whose entries have no name", async () => {
    const page: APIResourceList<unknown> = {
      count: 1,
      next: null,
      previous: null,
      results: [{ url: `${BASE_URL.REST}/machine/1/` }],
    };
    const urls: string[] = [];

    for await (const machine of new MachineClient().paginate(() => Promise.resolve(page))) {
      urls.push(machine.url);
    }

    expect(urls).toEqual([`${BASE_URL.REST}/machine/1/`]);
  });

  it("should stop requesting pages once the caller breaks out", async () => {
    const { pages, list } = recordingList(100);

    for await (const _berry of new BerryClient().paginate(list, { pageSize: 2 })) {
      break;
    }

    expect(pages).toEqual([[0, 2]]);
  });

  it("should resolve each link in the order it was listed", async () => {
    server.use(
      http.get(`${BASE_URL.REST}/berry/:id`, async ({ params }) => {
        const id = Number(params.id);
        // Answered slowest first, so completion order cannot be list order.
        await delay((5 - id) * 20);
        return HttpResponse.json({ id, name: `berry-${id}` });
      }),
    );

    const { list } = recordingList(4);
    const ids: number[] = [];

    for await (const berry of new BerryClient({ cache: false }).paginate(list, {
      pageSize: 4,
      resolve: true,
    })) {
      // Typed `Berry`, not `NamedAPIResource<Berry>`: `resolve` picks the other
      // overload, so this line stops compiling if that inference regresses.
      ids.push(berry.id);
    }

    expect(ids).toEqual([1, 2, 3, 4]);
  });

  it("should resolve no more links at a time than it was allowed", async () => {
    let inFlight = 0;
    let peak = 0;

    const client = new BerryClient({
      cache: false,
      fetch: async () => {
        inFlight += 1;
        peak = Math.max(peak, inFlight);
        await delay(10);
        inFlight -= 1;
        return Response.json({ id: 1 });
      },
    });

    const { list } = recordingList(8);

    for await (const _berry of client.paginate(list, {
      pageSize: 8,
      resolve: true,
      concurrency: 3,
    })) {
      // Drained for its request pattern, not its entries.
    }

    expect(peak).toBe(3);
  });

  it("should surface a failure while resolving a page", async () => {
    server.use(
      http.get(`${BASE_URL.REST}/berry/:id`, () => HttpResponse.json({}, { status: 500 })),
    );

    const { list } = recordingList(2);
    const walk = async (): Promise<void> => {
      for await (const _berry of new BerryClient().paginate(list, { resolve: true })) {
        // The first resolution throws before anything is yielded.
      }
    };

    await expect(walk()).rejects.toThrow(/failed with status 500/);
  });

  it("should stop a walk when the scope it runs in aborts", async () => {
    server.use(
      http.get(`${BASE_URL.REST}/berry/:id`, async () => {
        await delay(200);
        return HttpResponse.json({ id: 1 });
      }),
    );

    const { list } = recordingList(4);
    const controller = new AbortController();
    const walk = async (): Promise<void> => {
      for await (const _berry of new BerryClient()
        .with({ signal: controller.signal })
        .paginate(list, { resolve: true })) {
        // Aborted before the first resolution finishes.
      }
    };

    const walked = walk();
    controller.abort(new Error("caller went away"));

    await expect(walked).rejects.toThrow("caller went away");
  });
});
