import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import pino from 'pino';

export const createLogger = (options: pino.LoggerOptions): pino.Logger => pino(options);

export const handleRequest = (
  config: AxiosRequestConfig,
  logger: pino.Logger
): AxiosRequestConfig => {
  logger.info(`[ Request Config ] ${config.method?.toUpperCase() || ''} | ${config.url || ''}`);
  return config;
};

export const handleRequestError = async (
  error: AxiosError<unknown>,
  logger: pino.Logger
): Promise<AxiosError<unknown>> => {
  logger.error(`[ Request Error ] ${error.code || 'UNKNOWN'} | ${error.message}`);
  return Promise.reject(error);
};

export const handleResponse = (response: AxiosResponse, logger: pino.Logger): AxiosResponse => {
  logger.info(response.data);
  return response;
};

export const handleResponseError = async (
  error: AxiosError<unknown>,
  logger: pino.Logger
): Promise<AxiosError<unknown>> => {
  logger.error(`[ Response Error ] ${error.code || 'UNKNOWN'} | ${error.message}`);
  return Promise.reject(error);
};
