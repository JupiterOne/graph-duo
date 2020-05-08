import { createMockStepExecutionContext } from '@jupiterone/integration-sdk/testing';

export function createStepContext(): ReturnType<
  typeof createMockStepExecutionContext
> {
  const context = createMockStepExecutionContext();
  context.instance.config.apiHostname = 'https://api-56cd46b9.duosecurity.com';
  return context;
}
