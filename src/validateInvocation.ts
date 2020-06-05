import {
  IntegrationExecutionContext,
  IntegrationError,
} from '@jupiterone/integration-sdk-core';

import { createDuoClient } from './collector';
import { DuoIntegrationConfig } from './types';

export default async function validateInvocation(
  context: IntegrationExecutionContext<DuoIntegrationConfig>,
): Promise<void> {
  const config = context.instance.config;
  const client = createDuoClient(config);

  try {
    await client.fetchAccountSettings();
  } catch (err) {
    throw new IntegrationError({
      message: 'Failed to authenticate with provided credentials',
      cause: err,
      code: err.code,
    });
  }
}
