import { createMockStepExecutionContext } from '@jupiterone/integration-sdk/testing';

export function createStepContext(): ReturnType<
  typeof createMockStepExecutionContext
> {
  return createMockStepExecutionContext({
    instanceConfig: {
      apiHostname: process.env.API_HOSTNAME,
      integrationKey: process.env.INTEGRATION_KEY,
      secretKey: process.env.SECRET_KEY,
    },
  });
}
