import { createMockExecutionContext } from '@jupiterone/integration-sdk/testing';
import validateInvocation from '../validateInvocation';
import fetchMock from 'jest-fetch-mock';
import { testConfig } from '../collector/__tests__/constants';

beforeEach(() => {
  fetchMock.doMock();
});

test('rejects if apiKey is not present', async () => {
  fetchMock.mockResponse('{}');

  const context = createMockExecutionContext({
    instanceConfig: {},
  });

  await expect(validateInvocation(context)).rejects.toThrow(
    /Failed to authenticate/,
  );
});

test('rejects if unable to hit provider apis', async () => {
  fetchMock.mockResponse(() =>
    Promise.resolve({
      status: 403,
      body: 'Unauthorized',
    }),
  );

  const context = createMockExecutionContext();
  context.instance.config = { apiKey: 'test' };

  await expect(validateInvocation(context)).rejects.toThrow(
    /Failed to authenticate/,
  );
});

test('resolves when configuration is valid', async () => {
  fetchMock.mockResponse('{}');

  const context = createMockExecutionContext();
  context.instance.config = testConfig;

  await expect(validateInvocation(context)).resolves.toBe(undefined);
});
