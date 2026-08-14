import type { AxiosError, AxiosResponse } from "axios";
import type { CacheAxiosResponse, InternalCacheRequestConfig } from "axios-cache-interceptor";

/**
 * What the response interceptor actually receives: axios-cache-interceptor
 * types its response manager as `Partial<CacheAxiosResponse> & AxiosResponse`,
 * so the cache-specific fields are optional on the way through.
 */
type InterceptedResponse = Partial<CacheAxiosResponse> & AxiosResponse;

export const handleRequest = (
  config: InternalCacheRequestConfig,
  logsEnabled?: boolean,
): InternalCacheRequestConfig => {
  if (logsEnabled) {
    console.log(`[ Request Config ] ${config.method?.toUpperCase() || ""} | ${config.url || ""}`);
  }
  return config;
};

export const handleRequestError = (
  error: AxiosError<unknown>,
  logsEnabled?: boolean,
): Promise<AxiosError<unknown>> => {
  if (logsEnabled) {
    console.error(`[ Request Error ] CODE ${error.code || "UNKNOWN"} | ${error.message}`);
  }
  return Promise.reject(error);
};

export const handleResponse = (
  response: InterceptedResponse,
  logsEnabled?: boolean,
): InterceptedResponse => {
  if (logsEnabled) {
    console.log(
      `[ Response ] STATUS ${response.status} | ${response.cached ? "CACHED" : "NOT CACHED"}`,
    );
  }
  return response;
};

export const handleResponseError = (
  error: AxiosError<unknown>,
  logsEnabled?: boolean,
): Promise<AxiosError<unknown>> => {
  if (logsEnabled) {
    console.error(`[ Response Error ] CODE ${error.code || "UNKNOWN"} | ${error.message}`);
  }
  return Promise.reject(error);
};
