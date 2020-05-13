import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk';

import instanceConfigFields from './instanceConfigFields';
import validateInvocation from './validateInvocation';

import fetchUsers from './steps/fetch-users';

export const invocationConfig: IntegrationInvocationConfig = {
  instanceConfigFields,
  validateInvocation,
  integrationSteps: [fetchUsers],
};
