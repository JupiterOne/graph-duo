import { createStepContext } from 'test';

import {
  createMockExecutionContext,
  Recording,
  setupRecording,
} from '@jupiterone/integration-sdk/testing';

import validateInvocation from '../validateInvocation';

describe('validateInvocation config', () => {
  test('rejects if apiKey is not present', async () => {
    const context = createMockExecutionContext({
      instanceConfig: {},
    });

    await expect(validateInvocation(context)).rejects.toThrow(/requires all/);
  });
});

describe('validateInvocation API access', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('rejects if unable to hit provider apis', async () => {
    recording = setupRecording({
      directory: __dirname,
      name: 'validateInvocationUnauthorized',
      options: {
        recordFailedRequests: true,
      },
    });

    const context = createStepContext();
    context.instance.config.secretKey = 'testingUnauthorized';

    await expect(validateInvocation(context)).rejects.toThrow(
      /Failed to authenticate/,
    );
  });

  test('resolves when configuration is valid', async () => {
    recording = setupRecording({
      directory: __dirname,
      name: 'validateInvocation',
    });

    const context = createStepContext();
    await expect(validateInvocation(context)).resolves.toBe(undefined);
  });
});
