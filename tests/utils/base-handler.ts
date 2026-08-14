import { BASE_URL, type Endpoint } from "@constants";
import {
  type DefaultBodyType,
  type HttpHandler,
  HttpResponse,
  http,
  type JsonBodyType,
  type PathParams,
} from "msw";

type PokeApiListRequestParams = {
  limit: string;
  offset: string;
};

/**
 * Creates a base handler for API mocking using MSW.
 *
 * This function provides a reusable foundation for mocking API endpoints,
 * simplifying test setup and ensuring consistent mocking patterns.
 *
 * It constructs a GET request handler for the specified endpoint and response data,
 * optionally including a dynamic path segment for flexibility.
 */
export const baseHandler = <
  P extends PathParams<keyof P> = PokeApiListRequestParams,
  B extends DefaultBodyType = DefaultBodyType,
  // Constrained to JsonBodyType so HttpResponse.json's return type lines up
  // with the resolver's expected type; msw 2.15 tightened this.
  R extends JsonBodyType = JsonBodyType,
>(
  endpoint: Endpoint,
  mockResponse: R,
  identifier = "",
): HttpHandler => {
  let url = `${BASE_URL.REST}${endpoint}`;

  if (identifier) {
    url = `${url}/${identifier}`;
  }

  // R stays on `mockResponse` for call-site safety but is not threaded into
  // http.get: msw's resolver return type is a conditional on R, which cannot be
  // resolved while R is still generic. The handler is returned as HttpHandler
  // either way, so nothing is lost.
  return http.get<P, B, JsonBodyType>(url, () => HttpResponse.json(mockResponse));
};
