import ServicesClient from './ServicesClient';

import fetch from 'node-fetch';
import nodeFetch from 'node-fetch';
import fetchMock from 'jest-fetch-mock';

jest.mock('moment', () => ({
  ...jest.requireActual('moment'),
  utc: () => ({
    format: () => 'fake date',
  }),
}));

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

    const apiHostname = 'hostname';
    const integrationKey = 'integration';
    const secretKey = 'secret';
    const client = new ServicesClient({
      apiHostname,
      integrationKey,
      secretKey,
    });

    await client.fetchUsers();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(expect.any(String), {
      headers: new fetch.Headers({
        Authorization:
          'Basic aW50ZWdyYXRpb246ZTc4ZDAxNjM5YzM2Yjg4OWFiN2Q0N2MxMjYyMzlhODYyODA4ZWI5NQ==',
        Date: 'fake date',
      }),
    });
  });
});
