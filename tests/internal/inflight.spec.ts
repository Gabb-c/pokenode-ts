import { InFlight } from "../../src/internal/inflight";

/** A `start` callback the test settles by hand, recording the signal each call got. */
const controllable = () => {
  const started: { signal: AbortSignal | undefined; resolve: (value: string) => void }[] = [];

  const start = (signal: AbortSignal | undefined): Promise<string> =>
    new Promise((resolve, reject) => {
      started.push({ signal, resolve });
      signal?.addEventListener("abort", () => reject(signal.reason), { once: true });
    });

  return { started, start };
};

describe("InFlight", () => {
  it("should share one start between concurrent callers", async () => {
    const inFlight = new InFlight<string>();
    const { started, start } = controllable();

    const first = inFlight.share("k", undefined, start);
    const second = inFlight.share("k", undefined, start);
    started[0]?.resolve("v");

    await expect(first).resolves.toEqual({ value: "v", joined: false });
    await expect(second).resolves.toEqual({ value: "v", joined: true });
    expect(started).toHaveLength(1);
  });

  it("should start again once the shared request settles", async () => {
    const inFlight = new InFlight<string>();
    const { started, start } = controllable();

    const first = inFlight.share("k", undefined, start);
    started[0]?.resolve("one");
    await first;

    const second = inFlight.share("k", undefined, start);
    started[1]?.resolve("two");

    await expect(second).resolves.toEqual({ value: "two", joined: false });
  });

  it("should hand start a signal of its own only when the caller has one", () => {
    const inFlight = new InFlight<string>();
    const { started, start } = controllable();
    const caller = new AbortController();

    void inFlight.share("plain", undefined, start);
    void inFlight.share("scoped", caller.signal, start);

    expect(started[0]?.signal).toBeUndefined();
    expect(started[1]?.signal).toBeInstanceOf(AbortSignal);
    expect(started[1]?.signal).not.toBe(caller.signal);
  });

  it("should not abort while another caller is still waiting", async () => {
    const inFlight = new InFlight<string>();
    const { started, start } = controllable();
    const leaving = new AbortController();

    const left = inFlight.share("k", leaving.signal, start);
    const stayed = inFlight.share("k", new AbortController().signal, start);
    leaving.abort(new Error("gone"));

    await expect(left).rejects.toThrow("gone");
    expect(started[0]?.signal?.aborted).toBe(false);

    started[0]?.resolve("v");
    await expect(stayed).resolves.toEqual({ value: "v", joined: true });
  });

  it("should abort once the last caller leaves", async () => {
    const inFlight = new InFlight<string>();
    const { started, start } = controllable();
    const caller = new AbortController();

    const pending = inFlight.share("k", caller.signal, start);
    caller.abort(new Error("gone"));

    await expect(pending).rejects.toThrow("gone");
    expect(started[0]?.signal?.aborted).toBe(true);
  });

  it("should keep a replacement when the aborted request settles after it", async () => {
    const inFlight = new InFlight<string>();
    const { started, start } = controllable();
    const caller = new AbortController();

    const abandoned = inFlight.share("k", caller.signal, start);
    caller.abort(new Error("gone"));
    await expect(abandoned).rejects.toThrow("gone");

    const replacement = inFlight.share("k", undefined, start);
    const joiner = inFlight.share("k", undefined, start);
    started[1]?.resolve("v");

    await expect(replacement).resolves.toEqual({ value: "v", joined: false });
    await expect(joiner).resolves.toEqual({ value: "v", joined: true });
    expect(started).toHaveLength(2);
  });
});
