/**
 * ## Request Client
 * Request class leverageing the Fetch API to interact with the PokéAPI.
 */
export class RequestClient {
  /** The in memory cache to store responses. */
  private readonly cache: Map<string, unknown>;
  /** The base URL for the PokéAPI. */
  private readonly baseUrl: string;
  /** The headers to be sent with each request. */
  private readonly headers: Headers;
  /** Enables or disables logging. */
  private readonly logging: boolean;

  constructor(baseURL: string, logging?: boolean) {
    this.cache = new Map();
    this.baseUrl = baseURL;
    this.headers = new Headers();
    this.headers.set("Content-Type", "application/json");
    this.logging = logging ?? false;
  }

  /**
   * Get a resource from the PokéAPI
   * @param endpoint The endpoint to fetch
   * @param config Optional configuration for the request
   * @returns The desired resource
   */
  public async get<T>(endpoint: string, config?: { baseURL: string }): Promise<T> {
    if (this.cache.has(endpoint)) {
      return this.cache.get(endpoint) as T;
    }
    const response = await fetch(`${config?.baseURL ?? this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: this.headers,
    })
      .then((response) => {
        if (this.logging) {
          console.log(`[ Request Config ] GET | ${response.url}`);
        }
        return response;
      })
      .catch((error) => {
        if (this.logging) {
          console.error(`[ Request Error ] CODE ${error.code || "UNKNOWN"} | ${error.message}`);
        }
        return Promise.reject(error as Error);
      });

    const data: T = (await response.json()) as T;
    this.cache.set(endpoint, data);
    return data;
  }
}
