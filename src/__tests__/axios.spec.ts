import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { Endpoints } from '../constants';
import client from '../config/axios';
import { Pokemon } from '../models';

describe('Test Axios instance', () => {
  it('Check if response status is OK', async () => {
    const data = await client
      .get(`${Endpoints.Pokemon}/luxray`)
      .then((response: AxiosResponse<Pokemon>) => response);

    expect(data.status).toBe(StatusCodes.OK);
  });
});
