import { http, type DefaultBodyType, HttpResponse, type PathParams } from "msw";

import { BASE_URL, type Endpoint } from "../../src/constants";

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
 *
 * @param {Endpoint} endpoint - The endpoint to mock, as a string.
 * @param {R} mockResponse - The response data to return for the mocked request.
 * @param {string} [identifier] - An optional identifier to append to the endpoint path.
 * @template P - The expected path parameters type, defaulting to PokeApiListRequestParams.
 * @template B - The expected request body type, defaulting to DefaultBodyType.
 * @template R - The expected response body type, defaulting to DefaultBodyType.
 * @returns {MockedResponse<P, B, R>} The mocked response object.
 */
export const baseHandler = <
  P extends PathParams<keyof P> = PokeApiListRequestParams,
  B extends DefaultBodyType = DefaultBodyType,
  R extends DefaultBodyType = undefined,
>(
  endpoint: Endpoint,
  mockResponse: R,
  identifier = "",
) => {
  // Constructs the full URL for the mock request, including any identifier.
  const url = `${BASE_URL.REST}${endpoint}${identifier ? `/${identifier}` : ""}`;

  // Defines a mocked GET request handler that returns the provided mockResponse.
  return http.get<P, B, R>(url, async () => {
    return HttpResponse.json(mockResponse);
  });
};
