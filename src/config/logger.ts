import { AxiosError } from 'axios';
import { CacheAxiosResponse, CacheRequestConfig } from 'axios-cache-interceptor';

import pino from 'pino';

export const createLogger = (options?: pino.LoggerOptions | pino.DestinationStream): pino.Logger =>
  pino(options);

export const handleRequest = (
  config: CacheRequestConfig,
  logger: pino.Logger
): CacheRequestConfig => {
  logger.info(`[ Request Config ] ${config.method?.toUpperCase() || ''} | ${config.url || ''}`);
  return config;
};

export const handleRequestError = (
  error: AxiosError<unknown>,
  logger: pino.Logger
): Promise<AxiosError<unknown>> => {
  logger.error(`[ Request Error ] CODE ${error.code || 'UNKNOWN'} | ${error.message}`);
  throw error;
};

export const handleResponse = (
  response: CacheAxiosResponse,
  logger: pino.Logger
): CacheAxiosResponse => {
  logger.info(response.data);
  return response;
};

export const handleResponseError = (
  error: AxiosError<unknown>,
  logger: pino.Logger
): Promise<AxiosError<unknown>> => {
  logger.error(`[ Response Error ] CODE ${error.code || 'UNKNOWN'} | ${error.message}`);
  throw error;
};
