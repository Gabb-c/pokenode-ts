import type { Endpoint } from "../constants";

/** A scan, not `/\/+$/`: that regex is quadratic on a long slash run (ReDoS). */
export const trimTrailingSlash = (url: string): string => {
  let end = url.length;

  while (end > 0 && url[end - 1] === "/") {
    end -= 1;
  }

  return url.slice(0, end);
};

export const listPath = (endpoint: Endpoint, offset: number, limit: number): string => {
  const query = new URLSearchParams({ offset: String(offset), limit: String(limit) });

  return `${endpoint}?${query}`;
};

/**
 * Drops the path's trailing slash, so `/berry/1` and the API's `/berry/1/` share
 * one cache key. The query is left alone.
 */
export const normalizeURL = (url: string): string => {
  const queryAt = url.indexOf("?");

  if (queryAt === -1) {
    return trimTrailingSlash(url);
  }

  return trimTrailingSlash(url.slice(0, queryAt)) + url.slice(queryAt);
};

const API_VERSION_SEGMENT = /^v\d+$/;

/** `URL` accepts `us%zzer` but `decodeURIComponent` throws on it, so send it as written. */
const decodeUserinfo = (component: string): string => {
  try {
    return decodeURIComponent(component);
  } catch {
    return component;
  }
};

/** RFC 7617: percent-decoded, UTF-8 bytes, base64. */
const toBasicAuth = (username: string, password: string): string => {
  const userinfo = `${decodeUserinfo(username)}:${decodeUserinfo(password)}`;
  const bytes = new TextEncoder().encode(userinfo);
  let latin1 = "";

  for (const byte of bytes) {
    latin1 += String.fromCodePoint(byte);
  }

  return `Basic ${btoa(latin1)}`;
};

export interface CredentiallessURL {
  url: string;
  authorization: string | undefined;
}

/**
 * Moves userinfo into an `Authorization` header: `fetch` rejects credentialed
 * URLs, and the cache key and logs must not carry the password.
 *
 * The stripped URL is the cache key, so different credentials for one host share
 * entries; a client per identity needs a `CacheStore` per identity. An
 * unparseable URL passes through for `fetch` to reject.
 */
export const splitCredentials = (url: string): CredentiallessURL => {
  if (!url.includes("@")) {
    return { url, authorization: undefined };
  }

  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return { url, authorization: undefined };
  }

  if (!parsed.username && !parsed.password) {
    return { url, authorization: undefined };
  }

  const authorization = toBasicAuth(parsed.username, parsed.password);

  parsed.username = "";
  parsed.password = "";

  return { url: parsed.toString(), authorization };
};

/**
 * The endpoint path of an absolute URL. A foreign URL is re-resolved from its
 * version segment onward against `baseURL`, never fetched from its own host.
 *
 * Matched on parsed path segments: a raw-string search matches `api.v2.example.com`.
 */
export const toEndpointPath = (resourceURL: string, baseURL: string): string => {
  const resource = new URL(resourceURL);
  const base = new URL(baseURL);
  const basePath = trimTrailingSlash(base.pathname);

  if (
    resource.origin === base.origin &&
    (resource.pathname === basePath || resource.pathname.startsWith(`${basePath}/`))
  ) {
    return `${resource.pathname.slice(basePath.length)}${resource.search}`;
  }

  const segments = resource.pathname.split("/");
  const version = segments.findIndex((segment) => API_VERSION_SEGMENT.test(segment));

  if (version === -1) {
    throw new TypeError(`Cannot resolve "${resourceURL}" against the base URL "${baseURL}"`);
  }

  return `/${segments.slice(version + 1).join("/")}${resource.search}`;
};
