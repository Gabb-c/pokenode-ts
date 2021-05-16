import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { BaseURL } from '../constants';

const config: AxiosRequestConfig = {
  baseURL: BaseURL.REST,
  headers: {
    'Content-Type': 'application/json',
  },
};

const client: AxiosInstance = axios.create(config);

export default client;
