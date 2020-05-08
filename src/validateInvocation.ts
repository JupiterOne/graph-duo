import { IntegrationExecutionContext } from '@jupiterone/integration-sdk';
import { IntegrationError } from '@jupiterone/integration-sdk/src/errors';

import { createDuoClient } from './collector';

export default async function validateInvocation(
  context: IntegrationExecutionContext,
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
