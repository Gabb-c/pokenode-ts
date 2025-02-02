import { http, type DefaultBodyType, type HttpHandler, HttpResponse, type PathParams } from "msw";

import { BASE_URL, type Endpoint } from "@constants";

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
  R extends DefaultBodyType = undefined,
>(
  endpoint: Endpoint,
  mockResponse: R,
  identifier = "",
): HttpHandler => {
  let url = `${BASE_URL.REST}${endpoint}`;

  if (identifier) {
    url = `${url}/${identifier}`;
  }

  return http.get<P, B, R>(url, async () => {
    return HttpResponse.json(mockResponse);
  });
};
