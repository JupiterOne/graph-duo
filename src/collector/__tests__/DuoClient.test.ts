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
  test('applies the appropriate headers', async () => {
    const fetchSpy = jest.spyOn(nodeFetch, 'default');

    fetchMock.mockResponse(JSON.stringify({}));
    const client = createDuoClient(testConfig);

    expect(
      client.buildAuthHeader({
        date: 'Tue, 21 Aug 2012 17:29:18 -0000',
        method: 'POST',
        host: client.hostname,
        path: '/admin/v1/users',
        params: 'realname=First%20Last&username=root',
        integrationKey: testConfig.integrationKey,
        secretKey: testConfig.secretKey,
      }),
    ).toEqual(
      'RElXSjhYNkFFWU9SNU9NQzZUUTE6MmQ5N2Q2MTY2MzE5NzgxYjVhM2EwN2FmMzlkMzY2ZjQ5MTIzNGVkYw==',
    );

    await client.fetchUsers();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
