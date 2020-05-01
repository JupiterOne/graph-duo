import { createMockStepExecutionContext } from '@jupiterone/integration-sdk/testing';

export function createStepContext(): ReturnType<
  typeof createMockStepExecutionContext
> {
  return createMockStepExecutionContext({
    instanceConfig: {
      apiHostname: process.env.API_HOSTNAME || 'host.name.com',
      integrationKey: process.env.INTEGRATION_KEY || 'key',
      secretKey: process.env.SECRET_KEY || 'secret',
    },
  });
}
