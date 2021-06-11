import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import pino, { LoggerOptions, Logger, DestinationObjectOptions } from 'pino';

export const createLogger = (options: LoggerOptions): Logger => pino(options);

export const handleRequest = (config: AxiosRequestConfig, logger: Logger): AxiosRequestConfig => {
  logger.info(
    `[ Request Config ] ${config.method?.toUpperCase() || ''} | ${config.url || ''} | ${
      config.cache?.excludeFromCache ? 'Not cached' : 'Cached'
    }`
  );
  return config;
};

export const handleRequestError = async (
  error: AxiosError<unknown>,
  logger: Logger
): Promise<AxiosError<unknown>> => {
  logger.error(`[ Request Error ] ${error.code || 'UNKNOWN'} | ${error.message}`);
  return Promise.reject(error);
};

export const handleResponse = (response: AxiosResponse, logger: Logger): AxiosResponse => {
  logger.info(response.data);
  return response;
};

export const handleResponseError = async (
  error: AxiosError<unknown>,
  logger: Logger
): Promise<AxiosError<unknown>> => {
  logger.error(`[ Response Error ] ${error.code || 'UNKNOWN'} | ${error.message}`);
  return Promise.reject(error);
};
