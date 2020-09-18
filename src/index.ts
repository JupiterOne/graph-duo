import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';

import instanceConfigFields from './instanceConfigFields';
import validateInvocation from './validateInvocation';

import fetchUsers from './steps/fetchUsers';
import fetchPhones from './steps/fetchPhones';
import fetchIntegrations from './steps/fetchIntegrations';
import { DuoIntegrationConfig } from './types';

export const invocationConfig: IntegrationInvocationConfig<DuoIntegrationConfig> = {
  instanceConfigFields,
  validateInvocation,
  integrationSteps: [fetchUsers, fetchPhones, fetchIntegrations],
};
