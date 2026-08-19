/**
 * Brands the error, so the guard can match on it instead of the prototype chain:
 * a tree loading both the ESM and the CJS build has two distinct classes.
 */
const ERROR_KIND = "pokenode:http";

/**
 * ## Pokenode Error
 * Thrown when the PokéAPI answers with a non-2xx status. Transport failures are
 * not wrapped — the native error propagates untouched.
 */
export class PokenodeError extends Error {
  override readonly name = "PokenodeError";
  readonly kind = ERROR_KIND;

  /** HTTP status code of the response. */
  readonly status: number;
  /** HTTP status text of the response. */
  readonly statusText: string;
  /** URL that produced the error. */
  readonly url: string;
  /** Parsed response body, when the error response carried JSON. */
  readonly body: unknown;

  /**
   * @param message Overrides the default text, for a status whose failure is not
   *   self-explanatory.
   */
  constructor(response: Response, body: unknown, message?: string) {
    super(message ?? `Request to ${response.url} failed with status ${response.status}`);

    this.status = response.status;
    this.statusText = response.statusText;
    this.url = response.url;
    this.body = body;
  }

  /** Whether the error came from a pokenode-ts client. */
  static isPokenodeError(error: unknown): error is PokenodeError {
    return (
      typeof error === "object" &&
      error !== null &&
      "kind" in error &&
      (error as { kind: unknown }).kind === ERROR_KIND
    );
  }
}

/**
 * Builds a {@link PokenodeError} from a failed response, reading the body when
 * it is JSON. The PokéAPI answers 404s with plain text, so a parse failure is
 * expected and leaves `body` undefined.
 */
export const toPokenodeError = async (
  response: Response,
  message?: string,
): Promise<PokenodeError> => {
  let body: unknown;

  try {
    body = await response.json();
  } catch {
    body = undefined;
  }

  return new PokenodeError(response, body, message);
};
