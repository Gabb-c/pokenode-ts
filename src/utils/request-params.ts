import { ENDPOINTS } from "../constants";

type ObjectValue<T> = T[keyof T];
type Endpoint = ObjectValue<typeof ENDPOINTS>;

export const getListURL = (endpoint: Endpoint, offset?: number, limit?: number): string => {
  return `${endpoint}?offset=${offset ?? 0}&limit=${limit ?? 20}`;
};
