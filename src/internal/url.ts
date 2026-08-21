import type { Endpoint } from "../constants";

/**
 * Scanned rather than matched with `/\/+$/`: that pattern backtracks through
 * every slash of a long run that turns out not to end the string, which is
 * quadratic on a URL an untrusted caller supplies. This walks each character
 * once.
 */
export const trimTrailingSlash = (url: string): string => {
  let end = url.length;

  while (end > 0 && url[end - 1] === "/") {
    end -= 1;
  }

  return url.slice(0, end);
};

/** Builds the paginated request path shared by both list methods. */
export const listPath = (endpoint: Endpoint, offset: number, limit: number): string => {
  const query = new URLSearchParams({ offset: String(offset), limit: String(limit) });

  return `${endpoint}?${query}`;
};

/**
 * Drops the trailing slash from a request URL, leaving any query string alone.
 *
 * Both call paths must produce one cache key: `Transport.resource` builds
 * `/berry/1`, while the PokéAPI's own links end in a slash.
 *
 * Split at the query rather than matched with a lookahead, for the reason given
 * on {@link trimTrailingSlash}.
 */
export const normalizeURL = (url: string): string => {
  const queryAt = url.indexOf("?");

  if (queryAt === -1) {
    return trimTrailingSlash(url);
  }

  return trimTrailingSlash(url.slice(0, queryAt)) + url.slice(queryAt);
};

/** A path segment naming an API version, as in `/api/v2/berry/1`. */
const API_VERSION_SEGMENT = /^v\d+$/;

/**
 * Percent-decodes one userinfo component, leaving a component that cannot be
 * decoded as it stands: `URL` accepts sequences `decodeURIComponent` rejects —
 * `us%zzer` parses and then throws — and a credential nobody can decode is still
 * worth sending as written rather than failing the request over.
 */
const decodeUserinfo = (component: string): string => {
  try {
    return decodeURIComponent(component);
  } catch {
    return component;
  }
};

/** Base64-encodes userinfo as RFC 7617 wants it: UTF-8 bytes, percent-decoded. */
const toBasicAuth = (username: string, password: string): string => {
  const userinfo = `${decodeUserinfo(username)}:${decodeUserinfo(password)}`;
  const bytes = new TextEncoder().encode(userinfo);
  let latin1 = "";

  for (const byte of bytes) {
    latin1 += String.fromCharCode(byte);
  }

  return `Basic ${btoa(latin1)}`;
};

/** A request URL and the `Authorization` header its userinfo became, if any. */
export interface CredentiallessURL {
  url: string;
  authorization: string | undefined;
}

/**
 * Moves any credentials a URL carries into an `Authorization` header.
 *
 * A self-hosted instance behind basic auth is configured as
 * `https://user:secret@host/api/v2`, and that password must not reach the wire
 * as userinfo: `fetch` rejects a credentialed URL outright, and everything
 * downstream of the URL — the log payload, the cache key — would carry it.
 *
 * A URL too malformed to parse cannot carry credentials in the first place, and
 * `fetch` is about to reject it anyway, so it is passed through untouched.
 *
 * The URL that comes back is what everything downstream keys on — the cache
 * entry, the in-flight map, the log line — so two calls to the same host under
 * different credentials share a cache entry and a round trip. That is the trade
 * this exists for: one instance behind one set of credentials. A client per
 * identity needs a `CacheStore` per identity to go with it.
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
 * Reduces an absolute resource URL to the endpoint path to request.
 *
 * When the URL belongs to `baseURL`, the path is simply what follows it.
 * Otherwise — a link from pokeapi.co handed to a client aimed at a self-hosted
 * instance — the path after the API version segment is used, so the resource is
 * re-resolved against the client's own base rather than fetched from elsewhere.
 *
 * The version segment is matched on parsed URL components: a raw-string search
 * also matches a host like `api.v2.example.com`.
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
