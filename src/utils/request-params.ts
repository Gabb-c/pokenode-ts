import { Endpoints } from "../constants";

export const getListURL = (endpoint: Endpoints, offset?: number, limit?: number): string => {
  return `${endpoint}?offset=${offset ?? 0}&limit=${limit ?? 20}`;
};
