import { AxiosError } from 'axios';
import { CacheAxiosResponse, InternalCacheRequestConfig } from 'axios-cache-interceptor';

export const handleRequest = (
  config: InternalCacheRequestConfig,
  logsEnabled?: boolean
): InternalCacheRequestConfig => {
  if (logsEnabled) {
    console.log(`[ Request Config ] ${config.method?.toUpperCase() || ''} | ${config.url || ''}`);
  }
  return config;
};

export const handleRequestError = (
  error: AxiosError<unknown>,
  logsEnabled?: boolean
): Promise<AxiosError<unknown>> => {
  if (logsEnabled) {
    console.error(`[ Request Error ] CODE ${error.code || 'UNKNOWN'} | ${error.message}`);
  }
  return Promise.reject(error);
};

export const handleResponse = (
  response: CacheAxiosResponse,
  logsEnabled?: boolean
): CacheAxiosResponse => {
  if (logsEnabled) {
    console.log(
      `[ Response ] STATUS ${response.status} | ${response.cached ? 'CACHED' : 'NOT CACHED'}`
    );
  }
  return response;
};

export const handleResponseError = (
  error: AxiosError<unknown>,
  logsEnabled?: boolean
): Promise<AxiosError<unknown>> => {
  if (logsEnabled) {
    console.error(`[ Response Error ] CODE ${error.code || 'UNKNOWN'} | ${error.message}`);
  }
  return Promise.reject(error);
};
