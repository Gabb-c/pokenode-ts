import {
  listPath,
  normalizeURL,
  splitCredentials,
  toEndpointPath,
  trimTrailingSlash,
} from "../../src/internal/url";

const BASE = "https://pokeapi.co/api/v2";

const basic = (userinfo: string): string => `Basic ${Buffer.from(userinfo).toString("base64")}`;

describe("trimTrailingSlash", () => {
  it.each([
    ["https://h/api/v2", "https://h/api/v2"],
    ["https://h/api/v2/", "https://h/api/v2"],
    ["https://h/api/v2///", "https://h/api/v2"],
    ["///", ""],
    ["", ""],
  ])("should trim %j to %j", (input, expected) => {
    expect(trimTrailingSlash(input)).toBe(expected);
  });
});

describe("normalizeURL", () => {
  it.each([
    ["https://h/berry/1/", "https://h/berry/1"],
    ["https://h/berry/1", "https://h/berry/1"],
    ["https://h/berry/?offset=0", "https://h/berry?offset=0"],
    ["https://h/berry?next=/a/", "https://h/berry?next=/a/"],
  ])("should normalize %j to %j", (input, expected) => {
    expect(normalizeURL(input)).toBe(expected);
  });
});

describe("listPath", () => {
  it("should put the page in the query", () => {
    expect(listPath("/berry", 20, 50)).toBe("/berry?offset=20&limit=50");
  });
});

describe("splitCredentials", () => {
  it.each([
    ["no userinfo", "https://h/api/v2/berry/1"],
    ["an at sign in the path", "https://h/api/v2/@berry"],
    ["a url it cannot parse", "not a url @ all"],
  ])("should pass through %s untouched", (_label, url) => {
    expect(splitCredentials(url)).toEqual({ url, authorization: undefined });
  });

  it.each([
    ["plain credentials", "user:secret", "user:secret"],
    ["percent-encoded credentials", "us%20er:p%40ss", "us er:p@ss"],
    ["UTF-8 credentials", "jos%C3%A9:p", "josé:p"],
    ["credentials it cannot decode", "us%zzer:p", "us%zzer:p"],
  ])("should move %s into a header", (_label, userinfo, decoded) => {
    expect(splitCredentials(`https://${userinfo}@h/api/v2/berry/1`)).toEqual({
      url: "https://h/api/v2/berry/1",
      authorization: basic(decoded),
    });
  });
});

describe("toEndpointPath", () => {
  it.each([
    ["a url under the base", `${BASE}/berry/1/`, "/berry/1/"],
    ["the query string", `${BASE}/berry?offset=20&limit=20`, "/berry?offset=20&limit=20"],
    ["a foreign host", "https://mirror.test/api/v2/berry/1", "/berry/1"],
    ["a foreign version", "https://mirror.test/v3/berry/1", "/berry/1"],
  ])("should resolve %s", (_label, url, expected) => {
    expect(toEndpointPath(url, BASE)).toBe(expected);
  });

  it("should not read a version marker out of the host", () => {
    expect(() => toEndpointPath("https://api.v2.example.com/berry/1", BASE)).toThrow(TypeError);
  });

  it("should reject a url that is not absolute", () => {
    expect(() => toEndpointPath("/berry/1", BASE)).toThrow(TypeError);
  });
});
