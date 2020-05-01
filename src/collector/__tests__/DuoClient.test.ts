import nodeFetch from 'node-fetch';
import fetchMock from 'jest-fetch-mock';
import { createDuoClient } from '..';
import { testConfig } from './constants';

beforeEach(() => {
  fetchMock.doMock();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('fetchUsers', () => {
  test('calls fetch', async () => {
    const fetchSpy = jest.spyOn(nodeFetch, 'default');

    fetchMock.mockResponse(JSON.stringify({}));
    const client = createDuoClient(testConfig);

    await client.fetchUsers();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
