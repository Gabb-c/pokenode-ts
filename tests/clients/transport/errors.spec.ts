import { PokenodeError } from "@config/errors";
import { HttpResponse, http } from "msw/http";
import { server } from "../../helpers/setup";
import { BERRY_URL, TestClient } from "../../helpers/transport";

describe("BaseClient errors", () => {
  it("should throw a PokenodeError on a non-2xx response", async () => {
    server.use(
      http.get(BERRY_URL, () => HttpResponse.json({ detail: "Not found." }, { status: 404 })),
    );

    const error = await new TestClient().get("/berry", 1).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(PokenodeError);
    expect(PokenodeError.isPokenodeError(error)).toBe(true);
    expect(error).toMatchObject({
      name: "PokenodeError",
      kind: "pokenode:http",
      status: 404,
      url: BERRY_URL,
      body: { detail: "Not found." },
    });
  });

  it("should leave the body undefined when the error response is not JSON", async () => {
    server.use(http.get(BERRY_URL, () => new HttpResponse("Not Found", { status: 404 })));

    const error = (await new TestClient()
      .get("/berry", 1)
      .catch((caught: unknown) => caught)) as PokenodeError;

    expect(error.body).toBeUndefined();
    expect(error.statusText).toBeDefined();
  });
});
