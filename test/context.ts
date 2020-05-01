import { createMockStepExecutionContext } from '@jupiterone/integration-sdk/testing';

export function createStepContext(): ReturnType<
  typeof createMockStepExecutionContext
> {
  return createMockStepExecutionContext({
    instanceConfig: {
      apiHostname: 'https://api-56cd46b9.duosecurity.com',
      integrationKey: 'test',
      secretKey: 'test',
      siteId: 'test',
    },
  });
}
