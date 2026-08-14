import { PokenodeError, toPokenodeError } from "@config/errors";

const notFound = () =>
  new PokenodeError(new Response(null, { status: 404, statusText: "Not Found" }), {
    detail: "Not found.",
  });

describe("PokenodeError", () => {
  it("should carry the response details", () => {
    const error = notFound();

    expect(error.name).toBe("PokenodeError");
    expect(error.kind).toBe("pokenode:http");
    expect(error.status).toBe(404);
    expect(error.statusText).toBe("Not Found");
    expect(error.body).toEqual({ detail: "Not found." });
    expect(error).toBeInstanceOf(PokenodeError);
    expect(error).toBeInstanceOf(Error);
  });

  it("should read a JSON error body", async () => {
    const error = await toPokenodeError(Response.json({ detail: "Not found." }, { status: 404 }));

    expect(error.body).toEqual({ detail: "Not found." });
  });

  it("should leave the body undefined when the response is not JSON", async () => {
    const error = await toPokenodeError(new Response("Not Found", { status: 404 }));

    expect(error.body).toBeUndefined();
  });
});

describe("PokenodeError.isPokenodeError", () => {
  it("should recognise the errors the library throws", () => {
    expect(PokenodeError.isPokenodeError(notFound())).toBe(true);
  });

  it("should recognise an instance from a duplicated copy of the class", () => {
    // Stands in for a consumer whose tree loads both the ESM and the CJS build:
    // a structurally identical error whose prototype chain is a different class.
    const fromOtherCopy = Object.assign(new Error("boom"), { kind: "pokenode:http" });

    expect(PokenodeError.isPokenodeError(fromOtherCopy)).toBe(true);
    expect(fromOtherCopy instanceof PokenodeError).toBe(false);
  });

  it("should narrow an unknown error to the response details", () => {
    const error: unknown = notFound();

    if (!PokenodeError.isPokenodeError(error)) {
      throw new Error("guard should have matched");
    }

    expect(error.status).toBe(404);
    expect(error.url).toBe("");
  });

  it("should reject anything else", () => {
    expect(PokenodeError.isPokenodeError(new Error("boom"))).toBe(false);
    expect(PokenodeError.isPokenodeError({ kind: "other:http" })).toBe(false);
    expect(PokenodeError.isPokenodeError(null)).toBe(false);
    expect(PokenodeError.isPokenodeError(undefined)).toBe(false);
    expect(PokenodeError.isPokenodeError("pokenode:http")).toBe(false);
  });
});
