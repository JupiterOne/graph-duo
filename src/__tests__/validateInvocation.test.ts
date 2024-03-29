import { createStepContext } from '../../test';

import {
  createMockExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { setupDuoRecording } from '../../test/setupDuoRecording';
import validateInvocation from '../validateInvocation';
import { DuoIntegrationConfig } from '../types';
import { IntegrationProviderAuthenticationError } from '@jupiterone/integration-sdk-core';

describe('validateInvocation config', () => {
  test('rejects if apiKey is not present', async () => {
    const context = createMockExecutionContext<DuoIntegrationConfig>({
      instanceConfig: {} as DuoIntegrationConfig,
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
    recording = setupDuoRecording({
      directory: __dirname,
      name: 'validateInvocationUnauthorized',
      options: {
        recordFailedRequests: true,
      },
    });

    const context = createStepContext();
    context.instance.config.secretKey = 'testingUnauthorized';

    await expect(validateInvocation(context)).rejects.toBeInstanceOf(
      IntegrationProviderAuthenticationError,
    );
  });

  test('resolves when configuration is valid', async () => {
    recording = setupDuoRecording({
      directory: __dirname,
      name: 'validateInvocation',
    });

    const context = createStepContext();
    await expect(validateInvocation(context)).resolves.toBe(undefined);
  });
});
