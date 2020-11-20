import {
  IntegrationExecutionContext,
  IntegrationProviderAuthenticationError,
  IntegrationValidationError,
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
    if (err.code == 401) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: '/admin/v1/settings',
        status: err.code,
        statusText: err.message,
      });
    } else {
      context.logger.warn({ err }, err.message);
      throw new IntegrationValidationError(`${err.code}: ${err.message}`);
    }
  }
}
