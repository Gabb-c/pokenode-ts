import { tryCatch } from "@spongesoftware/trycatch";

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
   * @returns The desired resource or undefined if there is an error
   */
  public async get<T>(endpoint: string, config?: { baseURL: string }): Promise<T | undefined> {
    if (this.cache.has(endpoint)) {
      return this.cache.get(endpoint) as T;
    }
    const response = await tryCatch(
      fetch(`${config?.baseURL ?? this.baseUrl}${endpoint}`, {
        method: "GET",
        headers: this.headers,
      }),
    );

    if (!response.success) {
      if (this.logging) {
        console.error(`ERROR: ${response.error.message}`);
      }

      return undefined;
    }

    const data = await tryCatch(response.data.json());

    if (!data.success) {
      if (this.logging) {
        console.error(`ERROR: ${data.error.message}`);
      }

      return undefined;
    }

    this.cache.set(endpoint, data.data as T);
    return data.data as T;
  }
}
