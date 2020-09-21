import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import { DuoIntegrationConfig } from '../src/types';

export function createStepContext(options?: { apiHostname?: string }) {
  const context = createMockStepExecutionContext<DuoIntegrationConfig>();
  context.instance.config = {
    apiHostname: options?.apiHostname || 'https://api-56cd46b9.duosecurity.com',
    integrationKey: process.env.INTEGRATION_KEY || 'duo-integration-key',
    secretKey: process.env.SECRET_KEY || 'duo-secret-key',
  };

  return context;
}
