import Axios, { AxiosError, AxiosResponse } from 'axios';
import { Rest } from '../../constants';

export const listBerries = async (
  offset?: number,
  limit?: number
): Promise<AxiosResponse<number[]>> =>
  new Promise<AxiosResponse<number[]>>((resolve, reject) => {
    const url = `${Rest.URL}/ry?offset=${offset}&limit=${limit}`;

    Axios({
      url,
      method: 'GET',
      headers: { 'content-type': 'application/json' },
      responseType: 'json',
    })
      .then((response: AxiosResponse<number[]>) => {
        resolve(response);
      })
      .catch((error: AxiosError<unknown>) => {
        reject(error);
      });
  });

export const getBerryById = async (berryId: number): Promise<AxiosResponse<number[]>> =>
  new Promise<AxiosResponse<number[]>>((resolve, reject) => {
    const url = `${Rest.URL}/berry/${berryId}`;

    Axios({
      url,
      method: 'GET',
      headers: { 'content-type': 'application/json' },
      responseType: 'json',
    })
      .then((response: AxiosResponse<number[]>) => {
        resolve(response);
      })
      .catch((error: AxiosError<unknown>) => {
        reject(error);
      });
  });
