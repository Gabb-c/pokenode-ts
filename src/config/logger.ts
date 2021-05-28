/* eslint-disable import/prefer-default-export */

import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import pino, { LoggerOptions, Logger, DestinationStream, DestinationObjectOptions } from 'pino';

export const createLogger = (
  options: LoggerOptions,
  destination?: DestinationObjectOptions
): Logger => pino(options, pino.destination({ sync: false, ...destination }));

export const handleRequest = (config: AxiosRequestConfig, logger: Logger): AxiosRequestConfig => {
  logger.info(config);
  logger.flush();
  return config;
};

export const handleRequestError = async (
  error: AxiosError<unknown>,
  logger: Logger
): Promise<AxiosError<unknown>> => {
  logger.error(`STATUS CODE ${error.code} | ${error.message}`);
  logger.flush();
  return Promise.reject(error);
};

export const handleResponse = (
  response: AxiosResponse<unknown>,
  logger: Logger
): AxiosResponse<unknown> => {
  logger.info(response);
  return response;
};

export const handleResponseError = async (
  error: AxiosError<unknown>,
  logger: Logger
): Promise<AxiosError<unknown>> => {
  logger.error(`STATUS CODE ${error.code} | ${error.message}`);
  logger.flush();
  return Promise.reject(error);
};
