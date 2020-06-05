import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import { DuoIntegrationConfig } from 'src/types';

export function createStepContext() {
  const context = createMockStepExecutionContext<DuoIntegrationConfig>();
  context.instance.config = {
    apiHostname: 'https://api-56cd46b9.duosecurity.com',
    integrationKey: 'duo-integration-key',
    secretKey: 'duo-secret-key',
  };

  return context;
}
